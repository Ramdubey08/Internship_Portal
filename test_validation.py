"""
Test file validation in Django shell.

Run these commands in Django shell:
python manage.py shell

Then execute:
"""

# Test 1: Create a test user and verify profile auto-creation
from django.contrib.auth.models import User
from portal.models import Profile

# Create user
user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')

# Check if profile was created
print(f"Profile created: {hasattr(user, 'profile')}")
print(f"Profile role: {user.profile.role}")

# Test 2: Test file validation
from django.core.files.uploadedfile import SimpleUploadedFile
from portal.utils import validate_cv_file, validate_image_file
from django.core.exceptions import ValidationError

# Test valid PDF
valid_pdf = SimpleUploadedFile("test.pdf", b"file_content", content_type="application/pdf")
try:
    validate_cv_file(valid_pdf)
    print("✓ Valid PDF passed validation")
except ValidationError as e:
    print(f"✗ Valid PDF failed: {e}")

# Test invalid extension
invalid_file = SimpleUploadedFile("test.txt", b"file_content", content_type="text/plain")
try:
    validate_cv_file(invalid_file)
    print("✗ Invalid file passed (should have failed)")
except ValidationError as e:
    print(f"✓ Invalid file rejected: {e}")

# Test valid image
valid_image = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")
try:
    validate_image_file(valid_image)
    print("✓ Valid image passed validation")
except ValidationError as e:
    print(f"✗ Valid image failed: {e}")

# Test oversized file (mock)
from io import BytesIO
large_file = SimpleUploadedFile("large.pdf", b"x" * (6 * 1024 * 1024), content_type="application/pdf")  # 6MB
try:
    validate_cv_file(large_file)
    print("✗ Large file passed (should have failed)")
except ValidationError as e:
    print(f"✓ Large file rejected: {e}")

print("\n=== All validation tests completed ===")
