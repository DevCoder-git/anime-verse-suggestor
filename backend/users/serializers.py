
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, Watchlist
from anime.serializers import GenreSerializer, AnimeSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'avatar')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    favorite_genres = GenreSerializer(many=True, read_only=True)
    joined_date = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'favorite_genres', 'bio', 'joined_date')
    
    def get_joined_date(self, obj):
        return obj.user.date_joined
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Include user fields at top level
        for key, value in data.pop('user').items():
            if key not in data:
                data[key] = value
        return data

class WatchlistSerializer(serializers.ModelSerializer):
    anime = AnimeSerializer(read_only=True)
    
    class Meta:
        model = Watchlist
        fields = ('id', 'anime', 'date_added')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)
        return user
