from django.contrib import admin
from .models import Profile, Internship, Application


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'company_name', 'id']
    list_filter = ['role']
    search_fields = ['user__username', 'user__email', 'company_name']


@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ['title', 'poster', 'stipend', 'location', 'remote', 'last_date', 'is_active', 'created_at']
    list_filter = ['remote', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'skills_required', 'location']
    date_hierarchy = 'created_at'


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['student', 'internship', 'status', 'applied_at']
    list_filter = ['status', 'applied_at']
    search_fields = ['student__user__username', 'internship__title']
    date_hierarchy = 'applied_at'
