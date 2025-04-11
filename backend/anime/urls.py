
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AnimeViewSet, GenreViewSet, AnimeSearchAPIView,
    AnimeCommentsAPIView, AddCommentAPIView,
    AnimeRatingsAPIView, RateAnimeAPIView,
    UserRatingAPIView, TrendingAnimeAPIView,
    AnimeRecommendationsAPIView
)

router = DefaultRouter()
router.register(r'anime', AnimeViewSet)
router.register(r'genres', GenreViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('anime/search/', AnimeSearchAPIView.as_view()),
    path('anime/<int:anime_id>/comments/', AnimeCommentsAPIView.as_view()),
    path('anime/<int:anime_id>/comments/add/', AddCommentAPIView.as_view()),
    path('anime/<int:anime_id>/ratings/', AnimeRatingsAPIView.as_view()),
    path('anime/<int:anime_id>/rate/', RateAnimeAPIView.as_view()),
    path('anime/<int:anime_id>/user-rating/', UserRatingAPIView.as_view()),
    path('anime/trending/', TrendingAnimeAPIView.as_view()),
    path('anime/recommendations/', AnimeRecommendationsAPIView.as_view()),
]
