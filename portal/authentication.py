"""
Custom authentication classes for the portal app
"""
from rest_framework_simplejwt.authentication import JWTAuthentication


class JWTAuthenticationWithoutCSRF(JWTAuthentication):
    """
    JWT Authentication that doesn't enforce CSRF
    """
    def enforce_csrf(self, request):
        return  # Do not enforce CSRF
