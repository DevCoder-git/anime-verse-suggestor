
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, UserProfileView, 
    WatchlistView, WatchlistAddView, 
    WatchlistRemoveView, WatchlistCheckView
)

urlpatterns = [
    # Authentication URLs
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    
    # User Profile URLs
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    
    # Watchlist URLs
    path('watchlist/', WatchlistView.as_view(), name='watchlist'),
    path('watchlist/add/', WatchlistAddView.as_view(), name='watchlist_add'),
    path('watchlist/remove/<int:anime_id>/', WatchlistRemoveView.as_view(), name='watchlist_remove'),
    path('watchlist/check/<int:anime_id>/', WatchlistCheckView.as_view(), name='watchlist_check'),
]
