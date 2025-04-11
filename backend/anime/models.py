
from django.db import models
from django.conf import settings

class Genre(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class Anime(models.Model):
    TYPE_CHOICES = (
        ('TV', 'TV Series'),
        ('Movie', 'Movie'),
        ('OVA', 'OVA'),
        ('Special', 'Special'),
    )
    
    title = models.CharField(max_length=255)
    image = models.URLField(blank=True)
    description = models.TextField(blank=True)
    year = models.IntegerField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    episodes = models.IntegerField(default=1)
    rating = models.FloatField(default=0.0)
    genres = models.ManyToManyField(Genre, related_name='anime')
    studio = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return self.title
    
    @property
    def average_rating(self):
        ratings = Rating.objects.filter(anime=self)
        if ratings.exists():
            return sum(r.score for r in ratings) / ratings.count()
        return 0

class Rating(models.Model):
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('anime', 'user')
    
    def __str__(self):
        return f"{self.user.username} - {self.anime.title} - {self.score}"

class Comment(models.Model):
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} on {self.anime.title}"
