from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.contrib.auth.models import User
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Profile, Internship, Application
from .serializers import (
    ProfileSerializer, InternshipSerializer, 
    ApplicationSerializer, ApplicationStatusSerializer, UserSerializer
)
from .permissions import IsCompany, IsStudent, IsCompanyOwner


class StandardResultsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class InternshipViewSet(viewsets.ModelViewSet):
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    pagination_class = StandardResultsPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'skills_required', 'location']
    ordering_fields = ['created_at', 'stipend', 'last_date']
    ordering = ['-created_at']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsCompany]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = Internship.objects.filter(is_active=True)
        
        # Filter by company's own internships
        if self.request.query_params.get('my_internships'):
            if self.request.user.is_authenticated and hasattr(self.request.user, 'profile'):
                queryset = queryset.filter(poster=self.request.user.profile)
        
        # Search filters
        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) | 
                Q(description__icontains=q) |
                Q(skills_required__icontains=q)
            )
        
        skills = self.request.query_params.get('skills')
        if skills:
            queryset = queryset.filter(skills_required__icontains=skills)
        
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        remote = self.request.query_params.get('remote')
        if remote is not None:
            queryset = queryset.filter(remote=remote.lower() in ['true', '1', 'yes'])
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(poster=self.request.user.profile)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.poster.user != request.user:
            return Response(
                {"detail": "You don't have permission to edit this internship."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.poster.user != request.user:
            return Response(
                {"detail": "You don't have permission to delete this internship."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    pagination_class = StandardResultsPagination
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if hasattr(user, 'profile'):
            if user.profile.role == 'student':
                # Students see their own applications
                return Application.objects.filter(student=user.profile)
            elif user.profile.role == 'company':
                # Companies see applications to their internships
                return Application.objects.filter(internship__poster=user.profile)
        
        return Application.objects.none()
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsStudent]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [IsAuthenticated, IsCompany]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ApplicationStatusSerializer
        return ApplicationSerializer
    
    def perform_create(self, serializer):
        # Check for duplicate application
        internship = serializer.validated_data.get('internship')
        if Application.objects.filter(
            internship=internship,
            student=self.request.user.profile
        ).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'detail': 'You have already applied to this internship'})
        
        serializer.save(student=self.request.user.profile)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.internship.poster.user != request.user:
            return Response(
                {"detail": "You can only update applications for your internships."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        """Get applications by the current student"""
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'student':
            return Response(
                {"detail": "Only students can access this endpoint."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        applications = Application.objects.filter(student=request.user.profile)
        page = self.paginate_queryset(applications)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def internship_applications(self, request, pk=None):
        """Get all applications for a specific internship (company only)"""
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'company':
            return Response(
                {"detail": "Only companies can access this endpoint."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            internship = Internship.objects.get(pk=pk, poster=request.user.profile)
        except Internship.DoesNotExist:
            return Response(
                {"detail": "Internship not found or you don't have permission."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        applications = Application.objects.filter(internship=internship)
        page = self.paginate_queryset(applications)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user's profile"""
        if not hasattr(request.user, 'profile'):
            return Response(
                {"detail": "Profile not found. Please create a profile first."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProfileSerializer(request.user.profile)
        return Response(serializer.data)
    
    def patch(self, request):
        """Update current user's profile"""
        if not hasattr(request.user, 'profile'):
            return Response(
                {"detail": "Profile not found. Please create a profile first."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProfileSerializer(
            request.user.profile, 
            data=request.data, 
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        """Full update of current user's profile"""
        if not hasattr(request.user, 'profile'):
            return Response(
                {"detail": "Profile not found. Please create a profile first."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProfileSerializer(
            request.user.profile, 
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([])  # No authentication required
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user with profile
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    role = request.data.get('role', 'student')
    
    # Validation
    if not username or not email or not password:
        return Response(
            {"detail": "Username, email, and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(username=username).exists():
        return Response(
            {"detail": "Username already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(email=email).exists():
        return Response(
            {"detail": "Email already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if role not in ['student', 'company']:
        return Response(
            {"detail": "Role must be either 'student' or 'company'."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        with transaction.atomic():
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # Profile is auto-created by signal, update the role
            profile = user.profile
            profile.role = role
            
            # Update profile fields based on role
            if role == 'company':
                company_name = request.data.get('company_name', '')
                bio = request.data.get('bio', '')
                if company_name:
                    profile.company_name = company_name
                if bio:
                    profile.bio = bio
            
            profile.save()
            
            # Serialize response
            user_serializer = UserSerializer(user)
            profile_serializer = ProfileSerializer(profile)
            
            return Response({
                "message": "User registered successfully.",
                "user": user_serializer.data,
                "profile": profile_serializer.data
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response(
            {"detail": f"Registration failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
