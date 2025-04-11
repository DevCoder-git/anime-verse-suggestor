
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
echo "Do you want to create a superuser? (y/n)"
read create_superuser
if [ "$create_superuser" = "y" ]; then
    python manage.py createsuperuser
fi

# Run the server
echo "Starting the server..."
python manage.py runserver
