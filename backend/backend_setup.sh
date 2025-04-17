
#!/bin/bash

# This script will set up and run the Django backend

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Load sample data
echo "Loading sample data..."
python manage.py seed_data

# Create superuser (only if it doesn't exist)
echo "Creating a default admin user (username: admin, password: admin)..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell

# Run the server
echo "Starting the server..."
python manage.py runserver
