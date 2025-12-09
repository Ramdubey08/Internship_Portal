"""
Production WSGI Server for Windows
Uses Waitress (Windows-compatible alternative to Gunicorn)
"""

import os

# Set production environment BEFORE importing Django
os.environ['DEBUG'] = 'False'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'intern_portal.settings')

from waitress import serve
from intern_portal.wsgi import application

if __name__ == '__main__':
    print("=" * 60)
    print("PRODUCTION SERVER STARTING")
    print("=" * 60)
    print("")
    print("Server Configuration:")
    print("  * Host: 0.0.0.0")
    print("  * Port: 8000")
    print("  * Threads: 4")
    print("")
    print("Access Points:")
    print("  * Frontend:  http://localhost:8000")
    print("  * API:       http://localhost:8000/api/")
    print("  * Admin:     http://localhost:8000/admin/")
    print("")
    print("Default Credentials:")
    print("  * Admin:    admin / admin123")
    print("  * Company:  techcorp / password123")
    print("  * Students: john_doe, jane_smith, alex_kumar / password123")
    print("")
    print("=" * 60)
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    print("")
    
    # Start Waitress production server
    serve(
        application,
        host='0.0.0.0',
        port=8000,
        threads=4,
        url_scheme='http',
        channel_timeout=120
    )
