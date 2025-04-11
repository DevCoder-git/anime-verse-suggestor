
from rest_framework import serializers
from .models import Anime, Genre, Rating, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'name')

class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'avatar')

class CommentSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ('id', 'anime_id', 'user', 'content', 'created_at')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class RatingSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Rating
        fields = ('id', 'anime_id', 'user', 'score', 'created_at')

class AnimeSerializer(serializers.ModelSerializer):
    genres = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )
    
    class Meta:
        model = Anime
        fields = (
            'id', 'title', 'image', 'description', 'year',
            'type', 'episodes', 'rating', 'genres', 'studio'
        )

class AnimeDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    ratings = RatingSerializer(many=True, read_only=True)
    
    class Meta:
        model = Anime
        fields = (
            'id', 'title', 'image', 'description', 'year',
            'type', 'episodes', 'rating', 'genres', 'studio',
            'comments', 'ratings'
        )
