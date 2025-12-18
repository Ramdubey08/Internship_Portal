from django.db import models
from django.contrib.auth.models import User
from .utils import validate_cv_file, validate_image_file


class Profile(models.Model):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('company', 'Company'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    bio = models.TextField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True, help_text="Comma-separated skills")
    cv = models.FileField(upload_to='cvs/', blank=True, null=True, validators=[validate_cv_file])
    company_name = models.CharField(max_length=255, blank=True, null=True)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True, validators=[validate_image_file])
    
    # Student-specific fields
    phone = models.CharField(max_length=15, blank=True, null=True)
    college = models.CharField(max_length=255, blank=True, null=True)
    degree = models.CharField(max_length=100, blank=True, null=True)
    graduation_year = models.IntegerField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    portfolio = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"
    
    class Meta:
        ordering = ['-id']


class Internship(models.Model):
    poster = models.ForeignKey(
        Profile, 
        on_delete=models.CASCADE, 
        related_name='internships',
        limit_choices_to={'role': 'company'}
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    skills_required = models.TextField(help_text="Comma-separated skills required")
    stipend = models.DecimalField(max_digits=10, decimal_places=2, help_text="Monthly stipend")
    duration = models.CharField(max_length=100, help_text="e.g., 3 months, 6 months")
    location = models.CharField(max_length=255)
    remote = models.BooleanField(default=False)
    last_date = models.DateField(help_text="Last date to apply")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.poster.company_name or self.poster.user.username}"
    
    class Meta:
        ordering = ['-created_at']


class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted'),
    ]
    
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='applications')
    student = models.ForeignKey(
        Profile, 
        on_delete=models.CASCADE, 
        related_name='applications',
        limit_choices_to={'role': 'student'}
    )
    cover_letter = models.TextField()
    cv_copy = models.FileField(upload_to='application_cvs/', blank=True, null=True, validators=[validate_cv_file])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.student.user.username} - {self.internship.title} ({self.status})"
    
    class Meta:
        ordering = ['-applied_at']
        unique_together = ['internship', 'student']
