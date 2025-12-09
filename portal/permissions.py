from rest_framework import permissions


class IsCompany(permissions.BasePermission):
    """
    Permission check for company users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and 
            request.user.profile.role == 'company'
        )


class IsStudent(permissions.BasePermission):
    """
    Permission check for student users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and 
            request.user.profile.role == 'student'
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners to edit.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if obj has user attribute (Profile)
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # Check if obj has poster attribute (Internship)
        if hasattr(obj, 'poster'):
            return obj.poster.user == request.user
        
        # Check if obj has student attribute (Application)
        if hasattr(obj, 'student'):
            return obj.student.user == request.user
        
        return False


class IsCompanyOwner(permissions.BasePermission):
    """
    Permission for company to manage their own internships.
    """
    def has_object_permission(self, request, view, obj):
        return (
            request.user and 
            request.user.is_authenticated and 
            hasattr(obj, 'poster') and
            obj.poster.user == request.user
        )
