
import os
import json
from django.core.management.base import BaseCommand
from anime.models import Anime, Genre
from django.conf import settings

class Command(BaseCommand):
    help = 'Seed database with initial anime and genre data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')
        
        # Create genres
        genres_data = [
            {'id': 'action', 'name': 'Action'},
            {'id': 'adventure', 'name': 'Adventure'},
            {'id': 'comedy', 'name': 'Comedy'},
            {'id': 'drama', 'name': 'Drama'},
            {'id': 'fantasy', 'name': 'Fantasy'},
            {'id': 'horror', 'name': 'Horror'},
            {'id': 'magic', 'name': 'Magic'},
            {'id': 'mecha', 'name': 'Mecha'},
            {'id': 'music', 'name': 'Music'},
            {'id': 'mystery', 'name': 'Mystery'},
            {'id': 'psychological', 'name': 'Psychological'},
            {'id': 'romance', 'name': 'Romance'},
            {'id': 'sci-fi', 'name': 'Sci-Fi'},
            {'id': 'slice-of-life', 'name': 'Slice of Life'},
            {'id': 'sports', 'name': 'Sports'},
            {'id': 'supernatural', 'name': 'Supernatural'},
            {'id': 'thriller', 'name': 'Thriller'}
        ]
        
        genre_dict = {}
        for genre_data in genres_data:
            genre, created = Genre.objects.get_or_create(
                id=genre_data['id'],
                defaults={'name': genre_data['name']}
            )
            self.stdout.write(f"{'Created' if created else 'Found'} genre: {genre.name}")
            genre_dict[genre.name.lower()] = genre
        
        # Load frontend sample data
        anime_data = [
            {
                "id": 1,
                "title": "Attack on Titan",
                "image": "https://cdn.myanimelist.net/images/anime/1323/120081.jpg",
                "description": "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls.",
                "type": "TV",
                "episodes": 25,
                "year": 2013,
                "rating": 8.9,
                "genres": ["Action", "Drama", "Fantasy"],
                "studio": "Wit Studio"
            },
            {
                "id": 2,
                "title": "Fullmetal Alchemist: Brotherhood",
                "image": "https://cdn.myanimelist.net/images/anime/1208/94745.jpg",
                "description": "After a horrific alchemy experiment goes wrong, brothers Edward and Alphonse Elric search for the Philosopher's Stone to restore their bodies.",
                "type": "TV",
                "episodes": 64,
                "year": 2009,
                "rating": 9.1,
                "genres": ["Action", "Adventure", "Drama", "Fantasy"],
                "studio": "Bones"
            },
            {
                "id": 3,
                "title": "Death Note",
                "image": "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
                "description": "A high school student discovers a supernatural notebook that grants its user the ability to kill anyone whose name is written in its pages.",
                "type": "TV",
                "episodes": 37,
                "year": 2006,
                "rating": 8.6,
                "genres": ["Mystery", "Psychological", "Supernatural", "Thriller"],
                "studio": "Madhouse"
            },
            {
                "id": 4,
                "title": "My Hero Academia",
                "image": "https://cdn.myanimelist.net/images/anime/1319/122795.jpg",
                "description": "In a world where people with superpowers are the norm, a boy without powers dreams of becoming a hero.",
                "type": "TV",
                "episodes": 25,
                "year": 2016,
                "rating": 8.0,
                "genres": ["Action", "Comedy"],
                "studio": "Bones"
            },
            {
                "id": 5,
                "title": "One Punch Man",
                "image": "https://cdn.myanimelist.net/images/anime/12/76049.jpg",
                "description": "Saitama has a unique hobby: being a hero. After saving a child, he decided to become a hero for fun.",
                "type": "TV",
                "episodes": 12,
                "year": 2015,
                "rating": 8.5,
                "genres": ["Action", "Comedy"],
                "studio": "Madhouse"
            },
            {
                "id": 6,
                "title": "Demon Slayer",
                "image": "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
                "description": "Tanjiro Kamado sets out to become a demon slayer to avenge his family and cure his sister.",
                "type": "TV",
                "episodes": 26,
                "year": 2019,
                "rating": 8.5,
                "genres": ["Action", "Fantasy"],
                "studio": "ufotable"
            },
            {
                "id": 7,
                "title": "Spirited Away",
                "image": "https://cdn.myanimelist.net/images/anime/6/79597.jpg",
                "description": "During her family's move to the suburbs, Chihiro wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
                "type": "Movie",
                "episodes": 1,
                "year": 2001,
                "rating": 8.8,
                "genres": ["Adventure", "Fantasy"],
                "studio": "Studio Ghibli"
            },
            {
                "id": 8,
                "title": "Your Name",
                "image": "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
                "description": "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?",
                "type": "Movie",
                "episodes": 1,
                "year": 2016,
                "rating": 8.9,
                "genres": ["Romance", "Fantasy", "Drama"],
                "studio": "CoMix Wave Films"
            },
            {
                "id": 9,
                "title": "Violet Evergarden",
                "image": "https://cdn.myanimelist.net/images/anime/1795/95088.jpg",
                "description": "An ex-soldier becomes an Auto Memory Doll, writing letters for people who cannot write, learning about life and emotions.",
                "type": "TV",
                "episodes": 13,
                "year": 2018,
                "rating": 8.6,
                "genres": ["Drama", "Fantasy", "Slice of Life"],
                "studio": "Kyoto Animation"
            },
            {
                "id": 10,
                "title": "Steins;Gate",
                "image": "https://cdn.myanimelist.net/images/anime/5/73199.jpg",
                "description": "A self-proclaimed mad scientist discovers time travel and must use it to save someone very important to him.",
                "type": "TV",
                "episodes": 24,
                "year": 2011,
                "rating": 9.0,
                "genres": ["Sci-Fi", "Thriller"],
                "studio": "White Fox"
            },
            {
                "id": 11,
                "title": "Hunter x Hunter (2011)",
                "image": "https://cdn.myanimelist.net/images/anime/1337/99013.jpg",
                "description": "Gon Freecss aspires to become a Hunter, an exceptional being capable of greatness, to find his father who left him when he was younger.",
                "type": "TV",
                "episodes": 148,
                "year": 2011,
                "rating": 9.1,
                "genres": ["Action", "Adventure", "Fantasy"],
                "studio": "Madhouse"
            },
            {
                "id": 12,
                "title": "Your Lie in April",
                "image": "https://cdn.myanimelist.net/images/anime/3/67177.jpg",
                "description": "A piano prodigy who lost his ability to play meets a violinist who helps him rediscover music.",
                "type": "TV",
                "episodes": 22,
                "year": 2014,
                "rating": 8.7,
                "genres": ["Drama", "Music", "Romance"],
                "studio": "A-1 Pictures"
            },
            {
                "id": 13,
                "title": "A Silent Voice",
                "image": "https://cdn.myanimelist.net/images/anime/1122/96435.jpg",
                "description": "A young man is ostracized by his classmates after bullying a deaf girl. Years later, he sets off on a path for redemption.",
                "type": "Movie",
                "episodes": 1,
                "year": 2016,
                "rating": 8.9,
                "genres": ["Drama"],
                "studio": "Kyoto Animation"
            },
            {
                "id": 14,
                "title": "Made in Abyss",
                "image": "https://cdn.myanimelist.net/images/anime/6/86733.jpg",
                "description": "An orphaned girl and her robot friend descend into the Abyss, a mysterious and dangerous hole in the Earth.",
                "type": "TV",
                "episodes": 13,
                "year": 2017,
                "rating": 8.7,
                "genres": ["Adventure", "Drama", "Fantasy"],
                "studio": "Kinema Citrus"
            },
            {
                "id": 15,
                "title": "Cowboy Bebop",
                "image": "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
                "description": "A ragtag group of bounty hunters chase down criminals in the year 2071.",
                "type": "TV",
                "episodes": 26,
                "year": 1998,
                "rating": 8.8,
                "genres": ["Action", "Adventure", "Sci-Fi"],
                "studio": "Sunrise"
            }
        ]
        
        for anime_item in anime_data:
            anime, created = Anime.objects.get_or_create(
                id=anime_item["id"],
                defaults={
                    "title": anime_item["title"],
                    "image": anime_item["image"],
                    "description": anime_item["description"],
                    "type": anime_item["type"],
                    "episodes": anime_item["episodes"],
                    "year": anime_item["year"],
                    "rating": anime_item["rating"],
                    "studio": anime_item["studio"]
                }
            )
            
            if created:
                # Add genres
                for genre_name in anime_item["genres"]:
                    genre_key = genre_name.lower()
                    if genre_key in genre_dict:
                        anime.genres.add(genre_dict[genre_key])
                    
                anime.save()
                self.stdout.write(f"Created anime: {anime.title}")
            else:
                self.stdout.write(f"Found anime: {anime.title}")
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded data!'))
