
from django.contrib.auth import get_user_model
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes

from .serializers import UserRegistrationSerializer, UserProfileSerializer, WatchlistSerializer
from .models import UserProfile, Watchlist
from anime.models import Anime, Comment, Rating

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    def put(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        user = request.user
        
        # Update user fields
        if 'username' in request.data:
            user.username = request.data['username']
        if 'email' in request.data:
            user.email = request.data['email']
        if 'bio' in request.data:
            profile.bio = request.data['bio']
        
        # Handle avatar upload
        if 'avatar' in request.FILES:
            user.avatar = request.FILES['avatar']
        
        # Update favorite genres
        if 'favorite_genres' in request.data:
            profile.favorite_genres.set(request.data['favorite_genres'])
        
        user.save()
        profile.save()
        
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

class WatchlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        watchlist = Watchlist.objects.filter(user=request.user)
        serializer = WatchlistSerializer(watchlist, many=True)
        return Response(serializer.data)

class WatchlistAddView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            anime_id = request.data.get('anime_id')
            anime = Anime.objects.get(id=anime_id)
            watchlist_item, created = Watchlist.objects.get_or_create(
                user=request.user,
                anime=anime
            )
            return Response({'status': 'added' if created else 'already in watchlist'})
        except Anime.DoesNotExist:
            return Response({'error': 'Anime not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class WatchlistRemoveView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, anime_id):
        try:
            Watchlist.objects.filter(user=request.user, anime_id=anime_id).delete()
            return Response({'status': 'removed'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class WatchlistCheckView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, anime_id):
        is_in_watchlist = Watchlist.objects.filter(user=request.user, anime_id=anime_id).exists()
        return Response({'in_watchlist': is_in_watchlist})

# Admin moderation views
class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class AdminUserManagementView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """List all users for admin"""
        users = User.objects.all()
        return Response({
            'users': [
                {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_active': user.is_active,
                    'is_staff': user.is_staff,
                    'date_joined': user.date_joined
                } for user in users
            ]
        })
    
    def post(self, request):
        """Toggle user active status"""
        user_id = request.data.get('user_id')
        action = request.data.get('action')
        
        try:
            user = User.objects.get(id=user_id)
            if action == 'deactivate':
                user.is_active = False
                message = f"User {user.username} deactivated"
            elif action == 'activate':
                user.is_active = True
                message = f"User {user.username} activated"
            elif action == 'make_admin':
                user.is_staff = True
                message = f"User {user.username} promoted to admin"
            elif action == 'remove_admin':
                user.is_staff = False
                message = f"Admin privileges removed from {user.username}"
            else:
                return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.save()
            return Response({'message': message})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class AdminContentModerationView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """List reported or flagged content"""
        # Get comments that might need moderation (example criteria)
        reported_comments = Comment.objects.filter(reported=True) if hasattr(Comment, 'reported') else []
        
        return Response({
            'reported_comments': CommentSerializer(reported_comments, many=True).data
        })
    
    def post(self, request):
        """Moderate content - remove comment or clear report flag"""
        comment_id = request.data.get('comment_id')
        action = request.data.get('action')
        
        try:
            comment = Comment.objects.get(id=comment_id)
            if action == 'remove':
                comment.delete()
                return Response({'message': 'Comment removed'})
            elif action == 'approve':
                if hasattr(Comment, 'reported'):
                    comment.reported = False
                    comment.save()
                return Response({'message': 'Comment approved'})
            else:
                return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

class ReportCommentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, comment_id):
        """Allow users to report inappropriate comments"""
        try:
            comment = Comment.objects.get(id=comment_id)
            
            # If the model has a reported field, use it
            if hasattr(Comment, 'reported'):
                comment.reported = True
                comment.save()
            
            # In a real implementation, you might want to create a separate Report model
            # to track who reported what and why
            
            return Response({'message': 'Comment reported to moderators'})
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

class UserStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get statistics for the current user"""
        user = request.user
        
        # Count ratings
        rating_count = Rating.objects.filter(user=user).count()
        
        # Count comments
        comment_count = Comment.objects.filter(user=user).count()
        
        # Get watchlist size
        watchlist_count = Watchlist.objects.filter(user=user).count()
        
        # Get average rating given by user
        avg_rating = Rating.objects.filter(user=user).aggregate(Avg('score'))
        
        return Response({
            'rating_count': rating_count,
            'comment_count': comment_count,
            'watchlist_count': watchlist_count,
            'average_rating': avg_rating['score__avg'] or 0
        })
