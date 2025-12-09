"""
Custom middleware for the internship portal
"""
import re
import logging
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings

logger = logging.getLogger(__name__)

class CSRFExemptAPIMiddleware(MiddlewareMixin):
    """
    Exempt API endpoints from CSRF validation
    Must run BEFORE CsrfViewMiddleware in MIDDLEWARE list
    """
    def process_request(self, request):
        # Check if the path matches any exempt URL patterns
        if hasattr(settings, 'CSRF_EXEMPT_URLS'):
            path = request.path_info.lstrip('/')
            logger.warning(f"Checking CSRF exempt for path: {path}")
            for pattern in settings.CSRF_EXEMPT_URLS:
                if re.match(pattern, path):
                    logger.warning(f"CSRF EXEMPTED for path: {path}")
                    setattr(request, '_dont_enforce_csrf_checks', True)
                    break
        return None
