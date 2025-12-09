from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Auto-create Profile when a new User is created.
    Default role is 'student' - can be changed later.
    """
    if created:
        Profile.objects.create(user=instance, role='student')


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Save profile whenever user is saved.
    """
    if hasattr(instance, 'profile'):
        instance.profile.save()
