
from django.contrib import admin
from .models import Anime, Genre, Rating, Comment

class AnimeAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'year', 'rating')
    list_filter = ('type', 'year')
    search_fields = ('title', 'description')
    filter_horizontal = ('genres',)

class GenreAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

class RatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'anime', 'score', 'created_at')
    list_filter = ('anime', 'score')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'anime', 'content_preview', 'created_at')
    list_filter = ('anime', 'created_at')
    search_fields = ('content', 'user__username', 'anime__title')
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Comment'

admin.site.register(Anime, AnimeAdmin)
admin.site.register(Genre, GenreAdmin)
admin.site.register(Rating, RatingAdmin)
admin.site.register(Comment, CommentAdmin)
