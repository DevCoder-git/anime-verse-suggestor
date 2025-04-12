
from django.contrib.auth import get_user_model
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes

from .serializers import UserRegistrationSerializer, UserProfileSerializer, WatchlistSerializer
from .models import UserProfile, Watchlist
from anime.models import Anime

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
