
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    """Custom User Model extending Django's AbstractUser"""
    email = models.EmailField(_("email address"), unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
    joined_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
    
    def __str__(self):
        return self.username

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    favorite_genres = models.ManyToManyField('anime.Genre', blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"

class Watchlist(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='watchlist')
    anime = models.ForeignKey('anime.Anime', on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'anime')
        
    def __str__(self):
        return f"{self.user.username} - {self.anime.title}"
