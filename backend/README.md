
# Anime Recommendation System Backend

This is the Django backend for the Anime Recommendation System.

## Setup Instructions

### Using the setup script

1. Make the setup script executable:
   ```
   chmod +x backend_setup.sh
   ```

2. Run the setup script:
   ```
   ./backend_setup.sh
   ```

The script will create a virtual environment, install dependencies, run migrations, seed the database with sample data, and start the server.

### Manual setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Load sample data:
   ```
   python manage.py seed_data
   ```

6. Create a superuser (admin):
   ```
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```
   python manage.py runserver
   ```

## API Endpoints

The API will be available at http://localhost:8000/api/

### Authentication

- `POST /api/auth/register/`: Register a new user
- `POST /api/auth/login/`: Login and get JWT token
- `POST /api/auth/refresh/`: Refresh JWT token

### User Profile

- `GET /api/auth/profile/`: Get user profile
- `PUT /api/auth/profile/`: Update user profile

### Watchlist

- `GET /api/auth/watchlist/`: Get user's watchlist
- `POST /api/auth/watchlist/add/`: Add anime to watchlist
- `DELETE /api/auth/watchlist/remove/<anime_id>/`: Remove anime from watchlist
- `GET /api/auth/watchlist/check/<anime_id>/`: Check if anime is in watchlist

### Anime

- `GET /api/anime/`: List all anime
- `GET /api/anime/<id>/`: Get anime details
- `GET /api/anime/search/?q=<query>`: Search anime
- `GET /api/anime/trending/`: Get trending anime
- `GET /api/anime/recommendations/?genres=<genre_ids>&type=<type>`: Get recommendations

### Comments

- `GET /api/anime/<anime_id>/comments/`: Get anime comments
- `POST /api/anime/<anime_id>/comments/add/`: Add comment to anime

### Ratings

- `GET /api/anime/<anime_id>/ratings/`: Get anime ratings
- `POST /api/anime/<anime_id>/rate/`: Rate an anime
- `GET /api/anime/<anime_id>/user-rating/`: Get user's rating for an anime

### Genres

- `GET /api/genres/`: List all genres
