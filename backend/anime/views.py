
import random
from django.db.models import Q, Count, Avg, F
from rest_framework import status, viewsets, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Anime, Genre, Rating, Comment
from .serializers import (
    AnimeSerializer, AnimeDetailSerializer, GenreSerializer,
    CommentSerializer, RatingSerializer
)

class AnimeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Anime.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AnimeDetailSerializer
        return AnimeSerializer

class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class AnimeSearchAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])
        
        anime_list = Anime.objects.filter(
            Q(title__icontains=query) | 
            Q(description__icontains=query) |
            Q(studio__icontains=query) |
            Q(genres__name__icontains=query)
        ).distinct()
        
        serializer = AnimeSerializer(anime_list, many=True)
        return Response(serializer.data)

class AnimeCommentsAPIView(APIView):
    def get(self, request, anime_id):
        try:
            anime = Anime.objects.get(pk=anime_id)
            comments = Comment.objects.filter(anime=anime).order_by('-created_at')
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        except Anime.DoesNotExist:
            return Response(
                {'error': 'Anime not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class AddCommentAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, anime_id):
        try:
            anime = Anime.objects.get(pk=anime_id)
            data = {
                'content': request.data.get('content'),
                'anime_id': anime_id
            }
            serializer = CommentSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                serializer.save(anime=anime)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Anime.DoesNotExist:
            return Response(
                {'error': 'Anime not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class AnimeRatingsAPIView(APIView):
    def get(self, request, anime_id):
        try:
            anime = Anime.objects.get(pk=anime_id)
            ratings = Rating.objects.filter(anime=anime)
            serializer = RatingSerializer(ratings, many=True)
            return Response(serializer.data)
        except Anime.DoesNotExist:
            return Response(
                {'error': 'Anime not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class RateAnimeAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, anime_id):
        try:
            anime = Anime.objects.get(pk=anime_id)
            score = request.data.get('score')
            
            if not score or not isinstance(score, int) or score < 1 or score > 10:
                return Response(
                    {'error': 'Score must be an integer between 1 and 10'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update or create the rating
            rating, created = Rating.objects.update_or_create(
                anime=anime,
                user=request.user,
                defaults={'score': score}
            )
            
            # Update the anime's average rating
            avg_rating = Rating.objects.filter(anime=anime).aggregate(Avg('score'))['score__avg']
            anime.rating = round(avg_rating, 1)
            anime.save()
            
            serializer = RatingSerializer(rating)
            return Response(serializer.data)
        except Anime.DoesNotExist:
            return Response(
                {'error': 'Anime not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class UserRatingAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, anime_id):
        try:
            rating = Rating.objects.get(anime_id=anime_id, user=request.user)
            return Response({'score': rating.score})
        except Rating.DoesNotExist:
            return Response({'score': None})

class TrendingAnimeAPIView(APIView):
    def get(self, request):
        # Get trending anime based on recent ratings and comments
        anime_with_activity = Anime.objects.annotate(
            rating_count=Count('ratings'),
            comment_count=Count('comments')
        ).order_by('-rating_count', '-comment_count', '-rating')[:10]
        
        serializer = AnimeSerializer(anime_with_activity, many=True)
        return Response(serializer.data)

class AnimeRecommendationsAPIView(APIView):
    def get(self, request):
        genres = request.query_params.getlist('genres', [])
        anime_type = request.query_params.get('type', '')
        anime_id = request.query_params.get('anime_id', None)
        user = request.user if request.user.is_authenticated else None
        
        # Base queryset
        queryset = Anime.objects.all()
        
        # Collaborative Filtering: Find similar users and their favorite anime
        if user:
            # Get user's ratings
            user_ratings = Rating.objects.filter(user=user).select_related('anime')
            if user_ratings.exists():
                # Find users with similar taste (rated same anime highly)
                user_high_rated_anime = user_ratings.filter(score__gte=7).values_list('anime_id', flat=True)
                
                if user_high_rated_anime:
                    # Find users who also rated these anime highly
                    similar_users = Rating.objects.filter(
                        anime_id__in=user_high_rated_anime,
                        score__gte=7
                    ).exclude(user=user).values_list('user_id', flat=True).distinct()
                    
                    # Get anime these similar users rated highly but current user hasn't watched
                    user_watched_anime = user_ratings.values_list('anime_id', flat=True)
                    collaborative_recs = Rating.objects.filter(
                        user_id__in=similar_users,
                        score__gte=8
                    ).exclude(
                        anime_id__in=user_watched_anime
                    ).values_list('anime_id', flat=True).distinct()
                    
                    if collaborative_recs:
                        # Boost these anime in recommendations
                        queryset = queryset.annotate(
                            is_collab_rec=Count('id', filter=Q(id__in=collaborative_recs))
                        )
        
        # Content-Based Filtering
        # Filter by anime_id for similar anime
        if anime_id:
            try:
                source_anime = Anime.objects.get(pk=anime_id)
                source_genres = source_anime.genres.all()
                queryset = queryset.filter(genres__in=source_genres).exclude(pk=anime_id).distinct()
            except Anime.DoesNotExist:
                pass
        
        # Filter by genre
        if genres:
            queryset = queryset.filter(genres__id__in=genres).distinct()
        
        # Filter by type
        if anime_type:
            queryset = queryset.filter(type=anime_type)
        
        # Add rating sort with collaborative boost
        if user and user_ratings.exists():
            queryset = queryset.order_by('-is_collab_rec', '-rating')
        else:
            queryset = queryset.order_by('-rating')
        
        # Limit results
        results = queryset[:15]
        
        # If we have too few results, add some random recommendations
        if len(results) < 5:
            all_anime = list(Anime.objects.all())
            random_picks = random.sample(all_anime, min(10, len(all_anime)))
            # Ensure no duplicates
            for anime in random_picks:
                if anime not in results:
                    results.append(anime)
            
        serializer = AnimeSerializer(results, many=True)
        return Response(serializer.data)
