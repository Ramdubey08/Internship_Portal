#!/bin/bash

# Production Server Startup Script
# Serves both Django API and React Frontend using Gunicorn

echo "🚀 Starting Production Server..."
echo "================================"

cd "$(dirname "$0")"

# Activate virtual environment
if [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
else
    echo "❌ Virtual environment not found"
    exit 1
fi

# Set production environment
export DEBUG=False
export DJANGO_SETTINGS_MODULE=intern_portal.settings

# Run migrations
echo "📊 Running migrations..."
python manage.py migrate --noinput

# Collect static files
echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser if not exists
echo "👤 Checking superuser..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('✅ Superuser created: admin/admin123')
else:
    print('✅ Superuser already exists')
" 2>/dev/null || echo "ℹ️  Superuser check skipped"

echo ""
echo "================================"
echo "🌐 Server starting on port 8000"
echo "================================"
echo ""
echo "Access points:"
echo "  • Frontend: http://localhost:8000"
echo "  • API:      http://localhost:8000/api/"
echo "  • Admin:    http://localhost:8000/admin/"
echo ""
echo "Credentials:"
echo "  • Admin: admin / admin123"
echo "  • Company: techcorp / password123"
echo "  • Students: john_doe, jane_smith, alex_kumar / password123"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================"
echo ""

# Start Gunicorn server
gunicorn \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    intern_portal.wsgi:application
