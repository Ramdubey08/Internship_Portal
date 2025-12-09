from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InternshipViewSet, ApplicationViewSet, ProfileView, register_user

router = DefaultRouter()
router.register(r'internships', InternshipViewSet, basename='internship')
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('register/', register_user, name='register'),
]
