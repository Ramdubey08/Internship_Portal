from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Internship, Application


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'user', 'role', 'bio', 'skills', 'cv', 'company_name', 'logo']
        read_only_fields = ['id', 'user', 'role']


class InternshipSerializer(serializers.ModelSerializer):
    poster = ProfileSerializer(read_only=True)
    applications_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Internship
        fields = [
            'id', 'poster', 'title', 'description', 'skills_required', 
            'stipend', 'duration', 'location', 'remote', 'last_date', 
            'is_active', 'created_at', 'applications_count'
        ]
        read_only_fields = ['id', 'poster', 'created_at']
    
    def get_applications_count(self, obj):
        return obj.applications.count()


class ApplicationSerializer(serializers.ModelSerializer):
    student = ProfileSerializer(read_only=True)
    internship = InternshipSerializer(read_only=True)
    internship_id = serializers.PrimaryKeyRelatedField(
        queryset=Internship.objects.all(),
        write_only=True,
        source='internship'
    )
    
    class Meta:
        model = Application
        fields = [
            'id', 'internship', 'internship_id', 'student', 
            'cover_letter', 'cv_copy', 'status', 'applied_at'
        ]
        read_only_fields = ['id', 'student', 'applied_at', 'status']
    
    def validate_internship_id(self, value):
        if not value.is_active:
            raise serializers.ValidationError("This internship is no longer accepting applications.")
        return value


class ApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']
