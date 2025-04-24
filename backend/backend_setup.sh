
#!/bin/bash

# This script will set up and run the Django backend

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate || { echo "Failed to activate virtual environment"; exit 1; }

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt || { echo "Failed to install requirements"; exit 1; }

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate || { echo "Failed to run migrations"; exit 1; }

# Load sample data
echo "Loading sample data..."
python manage.py seed_data || { echo "Warning: Failed to load sample data"; }

# Create superuser (only if it doesn't exist)
echo "Creating a default admin user (username: admin, password: admin)..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell

# Display success message with instructions
echo "======================================================================"
echo "Backend setup completed successfully!"
echo "Admin user created with:"
echo "  Username: admin"
echo "  Password: admin"
echo ""
echo "Starting the server at http://localhost:8000/"
echo "To access the admin panel, visit: http://localhost:8000/admin/"
echo "======================================================================"

# Run the server
echo "Starting the server..."
python manage.py runserver
