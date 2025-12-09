"""
Views for serving React frontend
"""
from django.http import HttpResponse
from django.conf import settings
import os

def serve_react(request):
    """Serve the React index.html for all non-API routes"""
    try:
        index_path = os.path.join(settings.BASE_DIR, 'frontend', 'build', 'index.html')
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    except Exception as e:
        return HttpResponse(f'Error loading frontend: {str(e)}', status=500)
