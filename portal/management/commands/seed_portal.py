from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from portal.models import Profile, Internship, Application
from datetime import date, timedelta
import random


class Command(BaseCommand):
    help = 'Seed the database with sample data for Internship Portal'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database seeding...')
        
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        Application.objects.all().delete()
        Internship.objects.all().delete()
        Profile.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        
        # Create Company User
        self.stdout.write('Creating company user...')
        company_user = User.objects.create_user(
            username='techcorp',
            email='techcorp@example.com',
            password='password123',
            first_name='Tech',
            last_name='Corp'
        )
        company_profile = Profile.objects.get(user=company_user)
        company_profile.role = 'company'
        company_profile.company_name = 'TechCorp Solutions'
        company_profile.bio = 'Leading technology solutions provider specializing in software development and innovation.'
        company_profile.skills = 'Python, Django, React, Cloud Computing, AI/ML'
        company_profile.save()
        self.stdout.write(self.style.SUCCESS(f'✓ Created company: {company_user.username}'))
        
        # Create Student Users
        students_data = [
            {
                'username': 'john_doe',
                'email': 'john@example.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'bio': 'Computer Science student passionate about web development and machine learning.',
                'skills': 'Python, JavaScript, React, Node.js, MongoDB'
            },
            {
                'username': 'jane_smith',
                'email': 'jane@example.com',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'bio': 'Full-stack developer with experience in building scalable applications.',
                'skills': 'Java, Spring Boot, Angular, PostgreSQL, Docker'
            },
            {
                'username': 'alex_kumar',
                'email': 'alex@example.com',
                'first_name': 'Alex',
                'last_name': 'Kumar',
                'bio': 'Data Science enthusiast with strong analytical and programming skills.',
                'skills': 'Python, R, Machine Learning, Data Analysis, SQL, Tableau'
            }
        ]
        
        students = []
        self.stdout.write('Creating student users...')
        for student_data in students_data:
            user = User.objects.create_user(
                username=student_data['username'],
                email=student_data['email'],
                password='password123',
                first_name=student_data['first_name'],
                last_name=student_data['last_name']
            )
            profile = Profile.objects.get(user=user)
            profile.role = 'student'
            profile.bio = student_data['bio']
            profile.skills = student_data['skills']
            profile.save()
            students.append(profile)
            self.stdout.write(self.style.SUCCESS(f'✓ Created student: {user.username}'))
        
        # Create Sample Internships
        internships_data = [
            {
                'title': 'Frontend Developer Intern',
                'description': 'Join our team to build amazing user interfaces using React and modern web technologies. You will work on real-world projects and learn from experienced developers.',
                'skills_required': 'React, JavaScript, HTML, CSS, Git',
                'stipend': 15000.00,
                'duration': '3 months',
                'location': 'Mumbai',
                'remote': False,
                'last_date': date.today() + timedelta(days=30),
                'is_active': True
            },
            {
                'title': 'Backend Developer Intern',
                'description': 'Work on scalable backend systems using Django and REST APIs. Learn about database design, API development, and cloud deployment.',
                'skills_required': 'Python, Django, REST API, PostgreSQL, Docker',
                'stipend': 18000.00,
                'duration': '6 months',
                'location': 'Bangalore',
                'remote': True,
                'last_date': date.today() + timedelta(days=25),
                'is_active': True
            },
            {
                'title': 'Data Science Intern',
                'description': 'Apply machine learning algorithms to solve real business problems. Work with large datasets and build predictive models.',
                'skills_required': 'Python, Machine Learning, Pandas, NumPy, SQL',
                'stipend': 20000.00,
                'duration': '4 months',
                'location': 'Hyderabad',
                'remote': True,
                'last_date': date.today() + timedelta(days=20),
                'is_active': True
            },
            {
                'title': 'Mobile App Developer Intern',
                'description': 'Build cross-platform mobile applications using React Native. Create beautiful and performant mobile experiences.',
                'skills_required': 'React Native, JavaScript, Mobile Development, Git',
                'stipend': 16000.00,
                'duration': '3 months',
                'location': 'Pune',
                'remote': False,
                'last_date': date.today() + timedelta(days=15),
                'is_active': True
            },
            {
                'title': 'DevOps Intern',
                'description': 'Learn about CI/CD pipelines, containerization, and cloud infrastructure. Work with modern DevOps tools and practices.',
                'skills_required': 'Docker, Kubernetes, Jenkins, AWS, Linux',
                'stipend': 17000.00,
                'duration': '6 months',
                'location': 'Delhi',
                'remote': True,
                'last_date': date.today() + timedelta(days=10),
                'is_active': True
            },
            {
                'title': 'UI/UX Design Intern',
                'description': 'Design beautiful and intuitive user interfaces. Work on user research, wireframing, prototyping, and visual design.',
                'skills_required': 'Figma, Adobe XD, UI Design, User Research, Prototyping',
                'stipend': 12000.00,
                'duration': '3 months',
                'location': 'Chennai',
                'remote': False,
                'last_date': date.today() + timedelta(days=5),
                'is_active': False  # This one is closed
            }
        ]
        
        internships = []
        self.stdout.write('Creating internships...')
        for internship_data in internships_data:
            internship = Internship.objects.create(
                poster=company_profile,
                **internship_data
            )
            internships.append(internship)
            status = 'Active' if internship.is_active else 'Closed'
            self.stdout.write(self.style.SUCCESS(f'✓ Created internship: {internship.title} ({status})'))
        
        # Create Sample Applications
        self.stdout.write('Creating applications...')
        
        # Student 1 (john_doe) applies to Frontend, Backend, and Data Science
        applications_data = [
            {
                'internship': internships[0],  # Frontend
                'student': students[0],  # john_doe
                'cover_letter': 'I am very excited about this Frontend Developer position. With my strong skills in React and JavaScript, I am confident I can contribute effectively to your team. I have built several personal projects using React and am eager to learn more in a professional environment.',
                'status': 'accepted'
            },
            {
                'internship': internships[1],  # Backend
                'student': students[0],  # john_doe
                'cover_letter': 'I am interested in the Backend Developer role. I have experience with Python and Django from academic projects and would love to work on scalable backend systems.',
                'status': 'reviewing'
            },
            {
                'internship': internships[2],  # Data Science
                'student': students[0],  # john_doe
                'cover_letter': 'Machine learning fascinates me, and I have completed several online courses on the topic. I would be thrilled to apply my knowledge in a real-world setting.',
                'status': 'pending'
            },
            
            # Student 2 (jane_smith) applies to Backend, Mobile, DevOps
            {
                'internship': internships[1],  # Backend
                'student': students[1],  # jane_smith
                'cover_letter': 'With my experience in Java and Spring Boot, I am eager to expand my skills to Python and Django. I am a quick learner and passionate about backend development.',
                'status': 'shortlisted'
            },
            {
                'internship': internships[3],  # Mobile
                'student': students[1],  # jane_smith
                'cover_letter': 'I have built a few mobile apps using React Native and am excited about the opportunity to work on professional mobile applications.',
                'status': 'accepted'
            },
            {
                'internship': internships[4],  # DevOps
                'student': students[1],  # jane_smith
                'cover_letter': 'I have hands-on experience with Docker and AWS from my previous projects. I am passionate about automation and cloud infrastructure.',
                'status': 'pending'
            },
            
            # Student 3 (alex_kumar) applies to Data Science, Backend, DevOps
            {
                'internship': internships[2],  # Data Science
                'student': students[2],  # alex_kumar
                'cover_letter': 'As a Data Science enthusiast, I have worked on multiple ML projects including classification, regression, and clustering. I am proficient in Python, Pandas, and Scikit-learn. This internship aligns perfectly with my career goals.',
                'status': 'shortlisted'
            },
            {
                'internship': internships[1],  # Backend
                'student': students[2],  # alex_kumar
                'cover_letter': 'I am interested in backend development as it complements my data science skills. I would love to learn how to build APIs and work with databases.',
                'status': 'rejected'
            },
            {
                'internship': internships[4],  # DevOps
                'student': students[2],  # alex_kumar
                'cover_letter': 'I have basic knowledge of Docker and Linux. I am eager to learn about CI/CD pipelines and cloud deployment strategies.',
                'status': 'pending'
            }
        ]
        
        for app_data in applications_data:
            application = Application.objects.create(**app_data)
            self.stdout.write(self.style.SUCCESS(
                f'✓ Application: {application.student.user.username} → {application.internship.title} ({application.status})'
            ))
        
        # Print Summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('DATABASE SEEDING COMPLETED!'))
        self.stdout.write('='*60)
        self.stdout.write(f'\n📊 Summary:')
        self.stdout.write(f'  • Users: {User.objects.count()} (1 company, 3 students, 1 admin)')
        self.stdout.write(f'  • Internships: {Internship.objects.count()} (5 active, 1 closed)')
        self.stdout.write(f'  • Applications: {Application.objects.count()}')
        
        self.stdout.write(f'\n🔑 Login Credentials:')
        self.stdout.write(f'  Company:')
        self.stdout.write(f'    Username: techcorp')
        self.stdout.write(f'    Password: password123')
        self.stdout.write(f'  Students:')
        self.stdout.write(f'    Username: john_doe, jane_smith, alex_kumar')
        self.stdout.write(f'    Password: password123 (for all)')
        self.stdout.write(f'  Admin:')
        self.stdout.write(f'    Username: admin')
        self.stdout.write(f'    Password: admin123')
        
        self.stdout.write(f'\n📈 Application Status Distribution:')
        self.stdout.write(f'  • Pending: {Application.objects.filter(status="pending").count()}')
        self.stdout.write(f'  • Reviewing: {Application.objects.filter(status="reviewing").count()}')
        self.stdout.write(f'  • Shortlisted: {Application.objects.filter(status="shortlisted").count()}')
        self.stdout.write(f'  • Accepted: {Application.objects.filter(status="accepted").count()}')
        self.stdout.write(f'  • Rejected: {Application.objects.filter(status="rejected").count()}')
        
        self.stdout.write('\n✨ Ready to test the application!\n')
