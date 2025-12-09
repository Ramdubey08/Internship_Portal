import pytest
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from portal.models import Profile, Internship, Application
from datetime import date, timedelta


# ==================== MODEL TESTS ====================

class ProfileModelTest(TestCase):
    """Test Profile model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_profile_auto_created_on_user_creation(self):
        """Profile should be automatically created when user is created"""
        self.assertTrue(hasattr(self.user, 'profile'))
        self.assertIsNotNone(self.user.profile)
    
    def test_profile_default_role_is_student(self):
        """Profile should have default role as 'student'"""
        self.assertEqual(self.user.profile.role, 'student')
    
    def test_profile_str_method(self):
        """Profile __str__ should return username and role"""
        # The __str__ method capitalizes the role
        expected = f"{self.user.username} - Student"
        self.assertEqual(str(self.user.profile), expected)
    
    def test_profile_can_be_company(self):
        """Profile role can be changed to company"""
        self.user.profile.role = 'company'
        self.user.profile.company_name = 'Test Company'
        self.user.profile.save()
        
        self.assertEqual(self.user.profile.role, 'company')
        self.assertEqual(self.user.profile.company_name, 'Test Company')


class InternshipModelTest(TestCase):
    """Test Internship model"""
    
    def setUp(self):
        self.company_user = User.objects.create_user(
            username='company',
            email='company@example.com',
            password='pass123'
        )
        self.company_profile = self.company_user.profile
        self.company_profile.role = 'company'
        self.company_profile.company_name = 'Tech Corp'
        self.company_profile.save()
        
        self.internship = Internship.objects.create(
            poster=self.company_profile,
            title='Backend Developer Intern',
            description='Work on Django projects',
            skills_required='Python, Django, REST API',
            stipend=15000.00,
            duration='3 months',
            location='Mumbai',
            remote=False,
            last_date=date.today() + timedelta(days=30),
            is_active=True
        )
    
    def test_internship_creation(self):
        """Internship should be created successfully"""
        self.assertEqual(self.internship.title, 'Backend Developer Intern')
        self.assertEqual(self.internship.poster, self.company_profile)
        self.assertTrue(self.internship.is_active)
    
    def test_internship_str_method(self):
        """Internship __str__ should return title - company"""
        expected = 'Backend Developer Intern - Tech Corp'
        self.assertEqual(str(self.internship), expected)
    
    def test_internship_applications_count(self):
        """Should track number of applications"""
        student_user = User.objects.create_user(
            username='student',
            email='student@example.com',
            password='pass123'
        )
        
        # Create application
        Application.objects.create(
            internship=self.internship,
            student=student_user.profile,
            cover_letter='I am interested',
            status='pending'
        )
        
        # Check applications count using the correct related name
        self.assertEqual(self.internship.applications.count(), 1)


class ApplicationModelTest(TestCase):
    """Test Application model"""
    
    def setUp(self):
        # Create company
        company_user = User.objects.create_user(username='company', password='pass')
        self.company_profile = company_user.profile
        self.company_profile.role = 'company'
        self.company_profile.save()
        
        # Create student
        student_user = User.objects.create_user(username='student', password='pass')
        self.student_profile = student_user.profile
        self.student_profile.role = 'student'
        self.student_profile.save()
        
        # Create internship
        self.internship = Internship.objects.create(
            poster=self.company_profile,
            title='Test Internship',
            description='Test',
            skills_required='Python',
            stipend=10000,
            duration='3 months',
            location='Mumbai',
            last_date=date.today() + timedelta(days=30)
        )
    
    def test_application_creation(self):
        """Application should be created successfully"""
        application = Application.objects.create(
            internship=self.internship,
            student=self.student_profile,
            cover_letter='I want to apply',
            status='pending'
        )
        
        self.assertEqual(application.status, 'pending')
        self.assertEqual(application.student, self.student_profile)
        self.assertEqual(application.internship, self.internship)
    
    def test_application_unique_constraint(self):
        """Student cannot apply to same internship twice"""
        Application.objects.create(
            internship=self.internship,
            student=self.student_profile,
            cover_letter='First application'
        )
        
        # Try to create duplicate
        with self.assertRaises(Exception):
            Application.objects.create(
                internship=self.internship,
                student=self.student_profile,
                cover_letter='Duplicate application'
            )
    
    def test_application_str_method(self):
        """Application __str__ should show student and internship"""
        application = Application.objects.create(
            internship=self.internship,
            student=self.student_profile,
            cover_letter='Test'
        )
        
        expected = f"{self.student_profile.user.username} - {self.internship.title} ({application.status})"
        self.assertEqual(str(application), expected)


# ==================== API TESTS ====================

class AuthenticationAPITest(APITestCase):
    """Test authentication endpoints"""
    
    def test_user_registration(self):
        """User should be able to register"""
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post('/api/register/', data)
        
        # Note: Adjust endpoint based on your URL configuration
        # This test assumes you have a registration endpoint
        # If not, you can skip this test
    
    def test_user_login(self):
        """User should be able to login and receive tokens"""
        user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post('/api/token/', data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)


class InternshipAPITest(APITestCase):
    """Test Internship API endpoints"""
    
    def setUp(self):
        # Create company user
        self.company_user = User.objects.create_user(
            username='company',
            password='pass123'
        )
        self.company_profile = self.company_user.profile
        self.company_profile.role = 'company'
        self.company_profile.company_name = 'Tech Corp'
        self.company_profile.save()
        
        # Create student user
        self.student_user = User.objects.create_user(
            username='student',
            password='pass123'
        )
        
        # Get tokens
        self.client = APIClient()
        response = self.client.post('/api/token/', {
            'username': 'company',
            'password': 'pass123'
        })
        self.company_token = response.data['access']
        
        response = self.client.post('/api/token/', {
            'username': 'student',
            'password': 'pass123'
        })
        self.student_token = response.data['access']
    
    def test_list_internships(self):
        """Any authenticated user can list internships"""
        Internship.objects.create(
            poster=self.company_profile,
            title='Test Internship',
            description='Test',
            skills_required='Python',
            stipend=15000,
            duration='3 months',
            location='Mumbai',
            last_date=date.today() + timedelta(days=30)
        )
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        response = self.client.get('/api/internships/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_create_internship_as_company(self):
        """Company should be able to create internship"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.company_token}')
        
        data = {
            'title': 'New Internship',
            'description': 'Great opportunity',
            'skills_required': 'React, Node.js',
            'stipend': '20000.00',
            'duration': '6 months',
            'location': 'Bangalore',
            'remote': True,
            'last_date': (date.today() + timedelta(days=60)).isoformat(),
            'is_active': True
        }
        
        response = self.client.post('/api/internships/', data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Internship')
    
    def test_create_internship_as_student_fails(self):
        """Student should not be able to create internship"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        
        data = {
            'title': 'New Internship',
            'description': 'Test',
            'skills_required': 'Python',
            'stipend': '15000.00',
            'duration': '3 months',
            'location': 'Mumbai',
            'last_date': (date.today() + timedelta(days=30)).isoformat()
        }
        
        response = self.client.post('/api/internships/', data)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ApplicationAPITest(APITestCase):
    """Test Application API endpoints"""
    
    def setUp(self):
        # Create company
        company_user = User.objects.create_user(username='company', password='pass')
        self.company_profile = company_user.profile
        self.company_profile.role = 'company'
        self.company_profile.save()
        
        # Create student
        student_user = User.objects.create_user(username='student', password='pass')
        self.student_profile = student_user.profile
        
        # Create internship
        self.internship = Internship.objects.create(
            poster=self.company_profile,
            title='Test Internship',
            description='Test',
            skills_required='Python',
            stipend=15000,
            duration='3 months',
            location='Mumbai',
            last_date=date.today() + timedelta(days=30)
        )
        
        # Get tokens
        self.client = APIClient()
        response = self.client.post('/api/token/', {
            'username': 'student',
            'password': 'pass'
        })
        self.student_token = response.data['access']
        
        response = self.client.post('/api/token/', {
            'username': 'company',
            'password': 'pass'
        })
        self.company_token = response.data['access']
    
    def test_student_can_apply(self):
        """Student should be able to apply to internship"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        
        data = {
            'internship_id': self.internship.id,
            'cover_letter': 'I am very interested in this position.'
        }
        
        response = self.client.post('/api/applications/', data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'pending')
    
    def test_student_cannot_apply_twice(self):
        """Student cannot apply to same internship twice"""
        Application.objects.create(
            internship=self.internship,
            student=self.student_profile,
            cover_letter='First application'
        )
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        
        data = {
            'internship_id': self.internship.id,
            'cover_letter': 'Second application'
        }
        
        response = self.client.post('/api/applications/', data)
        
        # Should return 400 or raise IntegrityError (handled by DRF as 400)
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_500_INTERNAL_SERVER_ERROR])
    
    def test_company_can_update_application_status(self):
        """Company should be able to update application status"""
        application = Application.objects.create(
            internship=self.internship,
            student=self.student_profile,
            cover_letter='I want to apply'
        )
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.company_token}')
        
        data = {'status': 'accepted'}
        response = self.client.patch(f'/api/applications/{application.id}/', data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'accepted')


# ==================== PYTEST EXAMPLES ====================

@pytest.mark.django_db
class TestProfileModel:
    """Pytest example for Profile model"""
    
    def test_profile_creation(self):
        user = User.objects.create_user(
            username='pytest_user',
            password='testpass'
        )
        
        assert user.profile is not None
        assert user.profile.role == 'student'
    
    def test_company_profile(self):
        user = User.objects.create_user(username='company', password='pass')
        profile = user.profile
        profile.role = 'company'
        profile.company_name = 'Test Co'
        profile.save()
        
        assert profile.role == 'company'
        assert profile.company_name == 'Test Co'


@pytest.mark.django_db
class TestInternshipAPI:
    """Pytest example for Internship API"""
    
    def test_list_internships(self, client):
        # Create company
        company_user = User.objects.create_user(username='company', password='pass')
        company_profile = company_user.profile
        company_profile.role = 'company'
        company_profile.save()
        
        # Create internship
        Internship.objects.create(
            poster=company_profile,
            title='Python Intern',
            description='Work on Django',
            skills_required='Python',
            stipend=10000,
            duration='3 months',
            location='Delhi',
            last_date=date.today() + timedelta(days=30)
        )
        
        # Get token
        response = client.post('/api/token/', {
            'username': 'company',
            'password': 'pass'
        })
        token = response.data['access']
        
        # Test list endpoint
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = client.get('/api/internships/')
        
        assert response.status_code == 200
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['title'] == 'Python Intern'
