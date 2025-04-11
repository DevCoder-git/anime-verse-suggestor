
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile, Watchlist

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Profile Info', {'fields': ('avatar', 'bio')}),
    )

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_favorite_genres')
    
    def get_favorite_genres(self, obj):
        return ", ".join([genre.name for genre in obj.favorite_genres.all()])
    get_favorite_genres.short_description = 'Favorite Genres'

class WatchlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'anime', 'date_added')
    list_filter = ('user', 'date_added')
    search_fields = ('user__username', 'anime__title')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Watchlist, WatchlistAdmin)
