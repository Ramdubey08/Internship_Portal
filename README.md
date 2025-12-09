# 🎓 Internship Portal

A full-stack web application for managing internship postings and applications. Companies can post internships, and students can browse and apply to them.

## 🚀 Features

### For Students
- Browse and search internships by keywords, location, skills
- Filter by remote/on-site positions
- Apply to internships with cover letter and resume
- Track application status (pending, reviewing, shortlisted, accepted, rejected)
- View personalized dashboard with application statistics
- Update profile with bio, skills, and CV

### For Companies
- Post and manage internship listings
- View all applicants for posted internships
- Update application statuses
- Track internship analytics (applications count, active/inactive)
- Manage company profile with logo and description

### Technical Features
- **JWT Authentication** with access/refresh tokens and auto-refresh
- **Role-based access control** (Student/Company permissions)
- **File upload validation** (CV: PDF/DOC/DOCX max 5MB, Logo: JPG/PNG max 2MB)
- **RESTful API** with DRF ViewSets and serializers
- **Responsive UI** with custom CSS (mobile-first design)
- **Real-time search** and filtering
- **Automated profile creation** via Django signals
- **Comprehensive test suite** (18 tests covering models and APIs)

---

## 📋 Tech Stack

### Backend
- **Django 5.2.9** - Web framework
- **Django REST Framework 3.16.1** - API toolkit
- **SimpleJWT 5.5.1** - JWT authentication
- **SQLite3** - Database (development)
- **Pillow 12.0.0** - Image processing
- **django-cors-headers 4.9.0** - CORS handling

### Frontend
- **React 18.2.0** - UI library
- **React Router 6.20.0** - Client-side routing
- **Axios 1.6.2** - HTTP client with interceptors
- **react-hook-form 7.48.0** - Form validation
- **jwt-decode 4.0.0** - Token parsing

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js 16+ and npm
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd InternShip_Portal
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser
# Or use the seeded admin: username=admin, password=admin123

# Seed database with sample data
python manage.py seed_portal

# Start Django server
python manage.py runserver
```

Backend will run at: **http://127.0.0.1:8000/**

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Frontend will run at: **http://localhost:3000/**

---

## 🔑 Login Credentials (Seeded Data)

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | `admin` | `admin123` | Django admin access |
| Company | `techcorp` | `password123` | TechCorp Solutions |
| Student | `john_doe` | `password123` | CS student with 3 applications |
| Student | `jane_smith` | `password123` | Full-stack developer |
| Student | `alex_kumar` | `password123` | Data Science enthusiast |

---

## 📊 Seeded Data

The `seed_portal` command creates:
- **1 Company** with complete profile
- **3 Students** with bios and skills
- **6 Internships** (5 active, 1 closed)
- **9 Applications** with various statuses

**Application Distribution:**
- Pending: 3
- Reviewing: 1
- Shortlisted: 2
- Accepted: 2
- Rejected: 1

---

## 🧪 Testing

### Run Django Tests
```bash
cd InternShip_Portal
source venv/Scripts/activate
python manage.py test portal --verbosity=2
```

**Test Coverage:**
- ✅ Profile model (auto-creation, roles, validations)
- ✅ Internship model (CRUD, relationships)
- ✅ Application model (uniqueness, status)
- ✅ Authentication API (login, JWT tokens)
- ✅ Internship API (permissions, filtering)
- ✅ Application API (student apply, company update)

**Result:** 18 tests passed ✓

### Run Pytest (Alternative)
```bash
pytest portal/tests.py -v
```

### API Testing with cURL
See `API_TEST_COMMANDS.md` for complete cURL examples:
- Register/Login
- Create internship
- Apply to internship
- Change application status
- Search and filter internships

---

## 📁 Project Structure

```
InternShip_Portal/
├── intern_portal/              # Django project settings
│   ├── settings.py            # Configuration
│   ├── urls.py                # Root URL routing
│   └── wsgi.py                # WSGI config
├── portal/                     # Main Django app
│   ├── models.py              # Profile, Internship, Application
│   ├── serializers.py         # DRF serializers
│   ├── views.py               # API ViewSets
│   ├── permissions.py         # Custom permissions
│   ├── admin.py               # Django admin config
│   ├── signals.py             # Auto-create Profile
│   ├── utils.py               # File validators
│   ├── tests.py               # Unit tests
│   ├── urls.py                # API routing
│   └── management/
│       └── commands/
│           └── seed_portal.py # Database seeding
├── frontend/                   # React application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── InternshipCard.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── ApplyModal.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx (Landing)
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── InternshipDetail.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── CompanyDashboard.jsx
│   │   │   ├── CreateInternship.jsx
│   │   │   ├── EditInternship.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── MyApplications.jsx
│   │   ├── services/          # API services
│   │   │   ├── api.js         # Axios instance + interceptors
│   │   │   ├── internships.js # Internship operations
│   │   │   └── applications.js# Application operations
│   │   ├── context/
│   │   │   └── AuthContext.jsx# Auth state management
│   │   ├── styles.css         # Global styles
│   │   ├── App.jsx            # Root component + routing
│   │   └── index.js           # Entry point
│   ├── package.json
│   └── package-lock.json
├── requirements.txt            # Python dependencies
├── manage.py                   # Django CLI
├── db.sqlite3                  # Database
├── README.md                   # This file
├── API_TEST_COMMANDS.md        # cURL examples
└── STUDENT_APPLICATION_FLOW.md # Flow documentation
```

---

## 🔄 Application Flow Example

### Student Applies to Internship

1. **Student clicks "Apply Now"** on internship detail page
2. **Modal opens** with cover letter textarea and file upload
3. **Student fills form** and clicks "Submit Application"
4. **POST request** to `/api/applications/` with:
   ```json
   {
     "internship_id": 5,
     "cover_letter": "I am interested...",
     "cv_copy": File
   }
   ```
5. **Backend validates:**
   - User is a student
   - No duplicate application exists
   - File size/type is valid
6. **Creates application** with status="pending"
7. **Returns success** response with application data
8. **Success toast** appears (animated slide-in)
9. **UI updates automatically:**
   - "Apply Now" button changes to "Already Applied" badge
   - Application count increments
   - Modal closes after 2 seconds
10. **Student can view** in My Applications page

See `STUDENT_APPLICATION_FLOW.md` for complete sequence diagram.

---

## 🌐 API Endpoints

### Authentication
- `POST /api/token/` - Login (get access/refresh tokens)
- `POST /api/token/refresh/` - Refresh access token

### Profile
- `GET /api/profile/` - Get current user profile
- `PATCH /api/profile/` - Update profile

### Internships
- `GET /api/internships/` - List internships (with filters)
- `POST /api/internships/` - Create internship (Company only)
- `GET /api/internships/:id/` - Get internship details
- `PUT /api/internships/:id/` - Update internship (Company only)
- `DELETE /api/internships/:id/` - Delete internship (Company only)

**Query Parameters:**
- `?q=keyword` - Search in title/description
- `?location=Mumbai` - Filter by location
- `?skills=Python` - Filter by required skills
- `?remote=true` - Filter remote internships
- `?my_internships=true` - Company's posted internships

### Applications
- `GET /api/applications/` - List applications
- `POST /api/applications/` - Apply to internship (Student only)
- `GET /api/applications/my_applications/` - Student's applications
- `GET /api/applications/:id/internship_applications/` - Applicants for internship (Company)
- `PATCH /api/applications/:id/` - Update application status (Company)

---

## 🎨 Frontend Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Landing | Public | Homepage with featured internships |
| `/login` | Login | Public | Login form |
| `/register` | Register | Public | Registration form |
| `/internships` | InternshipList | Public | Browse all internships |
| `/internships/:id` | InternshipDetail | Public | Internship details + Apply |
| `/search` | Search | Public | Advanced search with filters |
| `/dashboard` | StudentDashboard / CompanyDashboard | Private | Role-based dashboard |
| `/profile` | ProfileEdit | Private | Update user profile |
| `/applications` | MyApplications | Student | Student's applications |
| `/internships/create` | CreateInternship | Company | Post new internship |
| `/internships/:id/edit` | EditInternship | Company | Edit internship |
| `/internships/:id/applicants` | ApplicantDetail | Company | View applicants |

---

## 🔐 Security Features

- **JWT Authentication** with 60-minute access tokens
- **Refresh tokens** valid for 1 day
- **Auto token refresh** via Axios interceptors
- **Role-based permissions** enforced at API level
- **File upload validation** (size, type, MIME)
- **CSRF protection** (enabled by default)
- **CORS configured** for development
- **Unique constraints** prevent duplicate applications
- **Password hashing** with Django's default PBKDF2

---

## 📝 Environment Variables (Optional)

Create `.env` file in project root:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🚀 Deployment

### Backend (Django)
1. Set `DEBUG=False` in settings
2. Configure `ALLOWED_HOSTS`
3. Use PostgreSQL/MySQL instead of SQLite
4. Set up static file serving (WhiteNoise/nginx)
5. Use Gunicorn/uWSGI as WSGI server
6. Configure environment variables
7. Run `python manage.py collectstatic`

### Frontend (React)
1. Run `npm run build`
2. Serve `build/` folder via nginx/Apache
3. Update API base URL to production backend
4. Configure routing (HTML5 History mode)

### Recommended Platforms
- **Backend:** Heroku, Railway, DigitalOcean, AWS EC2
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Database:** PostgreSQL on Heroku, AWS RDS

---

## 🐛 Troubleshooting

### Backend Issues

**Database locked error:**
```bash
# Delete db and recreate
rm db.sqlite3
python manage.py migrate
python manage.py seed_portal
```

**Module not found:**
```bash
pip install -r requirements.txt
```

**Port 8000 already in use:**
```bash
python manage.py runserver 8080
```

### Frontend Issues

**Compilation errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Proxy errors (ECONNREFUSED):**
- Ensure Django server is running on port 8000
- Check `proxy` in `package.json` points to `http://localhost:8000`

**Module not found:**
```bash
npm install
```

---

## 📖 Documentation

- **API Testing:** See `API_TEST_COMMANDS.md`
- **Application Flow:** See `STUDENT_APPLICATION_FLOW.md`
- **Django Admin:** http://127.0.0.1:8000/admin/
- **DRF Browsable API:** http://127.0.0.1:8000/api/

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Developer Notes

### Adding New Features

**Add new API endpoint:**
1. Add method to ViewSet in `portal/views.py`
2. Add route in `portal/urls.py` if needed
3. Create serializer if needed
4. Update permissions

**Add new frontend page:**
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `Navbar.jsx`

### Database Schema

**Profile** (One-to-One with User)
- role: student/company
- bio, skills, cv, company_name, logo

**Internship** (ForeignKey to Profile where role=company)
- title, description, skills_required
- stipend, duration, location, remote
- last_date, is_active, created_at

**Application** (ForeignKey to Internship + Student Profile)
- cover_letter, cv_copy
- status: pending/reviewing/shortlisted/accepted/rejected
- applied_at
- Unique constraint: (internship, student)

---

## 🎯 Future Enhancements

- [ ] Email notifications for application status changes
- [ ] Real-time chat between students and companies
- [ ] Payment integration for premium listings
- [ ] Advanced analytics dashboard
- [ ] Application deadline reminders
- [ ] Resume builder/parser
- [ ] Company verification system
- [ ] Bookmark/save internships
- [ ] Application feedback system
- [ ] Export applications to PDF
- [ ] Bulk application status updates
- [ ] Internship recommendations (ML-based)

---

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Check documentation files
- Review test cases for examples

---

## ✨ Acknowledgments

Built with Django REST Framework and React for a modern, scalable internship management system.

**Version:** 1.0.0  
**Last Updated:** December 2, 2025

---

**Happy Coding! 🚀**
# Internship_Portal
