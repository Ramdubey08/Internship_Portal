from django.core.exceptions import ValidationError
import os


def validate_file_size(file, max_size_mb=5):
    """
    Validate file size.
    Args:
        file: UploadedFile object
        max_size_mb: Maximum file size in megabytes
    """
    if file:
        file_size = file.size
        limit_mb = max_size_mb
        if file_size > limit_mb * 1024 * 1024:
            raise ValidationError(f'File size cannot exceed {limit_mb}MB')


def validate_cv_file(file):
    """
    Validate CV file type and size.
    Allowed formats: PDF, DOC, DOCX
    """
    if file:
        validate_file_size(file, max_size_mb=5)
        
        ext = os.path.splitext(file.name)[1].lower()
        valid_extensions = ['.pdf', '.doc', '.docx']
        
        if ext not in valid_extensions:
            raise ValidationError(
                f'Unsupported file extension. Allowed: {", ".join(valid_extensions)}'
            )


def validate_image_file(file):
    """
    Validate image file type and size.
    Allowed formats: JPG, JPEG, PNG, GIF
    """
    if file:
        validate_file_size(file, max_size_mb=2)
        
        ext = os.path.splitext(file.name)[1].lower()
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        
        if ext not in valid_extensions:
            raise ValidationError(
                f'Unsupported image format. Allowed: {", ".join(valid_extensions)}'
            )


def validate_cv_mime_type(file):
    """
    Validate CV MIME type.
    """
    if file:
        valid_mime_types = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        
        content_type = getattr(file, 'content_type', None)
        if content_type and content_type not in valid_mime_types:
            raise ValidationError(
                f'Invalid file type. Must be PDF or Word document.'
            )


def validate_image_mime_type(file):
    """
    Validate image MIME type.
    """
    if file:
        valid_mime_types = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp'
        ]
        
        content_type = getattr(file, 'content_type', None)
        if content_type and content_type not in valid_mime_types:
            raise ValidationError(
                f'Invalid image type. Must be JPEG, PNG, GIF, or WebP.'
            )
