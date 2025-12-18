# 🎓 InternHub - Complete Internship Management Portal

A modern, full-stack web application for managing internship postings and applications. Built with Django REST Framework and React, featuring a beautiful gradient UI with glassmorphism effects.

## ✨ Features

### For Students 🎒
- **Browse & Search** - View all active internships with advanced search and filtering
- **Smart Apply** - Apply to internships with cover letter and resume upload
- **Duplicate Prevention** - Cannot apply twice to the same internship
- **Application Tracking** - View all applications with status-based filtering (pending, reviewing, shortlisted, accepted, rejected)
- **Enhanced Profile** - Complete profile with:
  - Personal information (phone, full name)
  - Education details (college, degree, graduation year)
  - Skills showcase with colorful badges
  - Social links (GitHub, LinkedIn, Portfolio)
  - Resume/CV upload
- **Dashboard** - Personalized view with application statistics and status breakdown
- **Already Applied Badge** - Visual indicator on internships already applied to

### For Companies 🏢
- **Post Internships** - Create and manage internship listings with detailed descriptions
- **My Internships Only** - View only your own posted internships (role-based filtering)
- **Applicant Management** - View all applicants for each internship with:
  - Status-based filtering
  - Bulk status updates
  - Individual application review
- **Complete Student Profiles** - View detailed student information including:
  - Education background
  - Skills and bio
  - Social profiles (GitHub, LinkedIn, Portfolio)
  - Both application resume and profile resume
- **Application Review** - Dedicated page for reviewing individual applications with:
  - Collapsible full student profile view
  - Status update buttons (Reviewing, Shortlist, Accept, Reject)
  - Cover letter display
  - Resume download functionality
- **Dashboard** - Statistics overview with total internships, active count, applications received, pending reviews

### Technical Features ⚙️
- **JWT Authentication** with access/refresh tokens and auto-refresh mechanism
- **Role-based access control** with Student/Company permissions
- **File upload validation** - CV/Resume (PDF/DOC/DOCX max 5MB), Logo (JPG/PNG max 2MB)
- **Smart Resume Download** - Fetch API with blob download (no new tab opening)
- **RESTful API** with DRF ViewSets and nested serializers
- **Modern UI Design** with:
  - Purple-pink gradient theme (#6366f1 → #8b5cf6 → #d946ef)
  - Glassmorphism effects with backdrop-filter
  - Smooth animations (fadeIn, slideInRight, float)
  - Responsive design (mobile-first approach)
- **Real-time search** and filtering across internships
- **Automated profile creation** via Django signals
- **Production-ready** with Waitress WSGI server and WhiteNoise static files

---

## 📋 Tech Stack

### Backend
- **Django 5.2.9** - Web framework
- **Django REST Framework 3.16.1** - API toolkit
- **SimpleJWT 5.5.1** - JWT authentication
- **Waitress 3.0.2** - Production WSGI server (Windows compatible)
- **WhiteNoise 6.7.0** - Static file serving
- **SQLite3** - Database
- **Pillow 12.0.0** - Image processing
- **django-cors-headers 4.9.0** - CORS handling

### Frontend
- **React 18.2.0** - UI library
- **React Router 6.20.0** - Client-side routing
- **Axios 1.6.2** - HTTP client with interceptors
- **react-hook-form 7.48.0** - Form validation
- **jwt-decode 4.0.0** - Token parsing
- **Custom CSS** - Modern gradient design system

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+ (Tested on Python 3.12)
- Node.js 16+ and npm
- Git (optional)

### Quick Start (Production Mode)

1. **Extract/Clone the Project**
```bash
cd InternShip_Portal
```

2. **Backend Setup**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# (Optional) Create superuser
python manage.py createsuperuser
```

3. **Build Frontend**
```bash
cd frontend
npm install
npm run build
cd ..
```

4. **Start Production Server**
```bash
python run_production.py
```

Server will start at: **http://localhost:8000/**

### Development Mode

**Backend (Terminal 1):**
```bash
# Activate venv
venv\Scripts\activate

# Start Django dev server
python manage.py runserver
```
Backend: **http://127.0.0.1:8000/**

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```
Frontend: **http://localhost:3000/**

---

## 🎯 Default Access Credentials

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | `admin` | `admin123` | Django admin panel access |
| Company | `techcorp` | `password123` | TechCorp - 6 internships posted |
| Student | `john_doe` | `password123` | Student with sample applications |
| Student | `jane_smith` | `password123` | Student account |
| Student | `alex_kumar` | `password123` | Student account |

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
│   ├── settings.py            # Configuration (DEBUG, CORS, JWT, Media)
│   ├── urls.py                # Root URL routing
│   ├── wsgi.py                # WSGI config
│   └── asgi.py                # ASGI config
├── portal/                     # Main Django app
│   ├── models.py              # Profile, Internship, Application models
│   │                          # Profile: role, bio, skills, cv, phone, college, 
│   │                          #          degree, graduation_year, github, linkedin, portfolio
│   │                          # Internship: title, description, skills_required, stipend,
│   │                          #             duration, location, remote, last_date
│   │                          # Application: student, internship, cover_letter, cv_copy, status
│   ├── serializers.py         # DRF serializers with nested relations
│   ├── views.py               # API ViewSets with role-based filtering
│   ├── permissions.py         # IsStudent, IsCompany custom permissions
│   ├── admin.py               # Django admin configuration
│   ├── signals.py             # Auto-create Profile on User creation
│   ├── utils.py               # File validators (CV: 5MB, Logo: 2MB)
│   ├── urls.py                # API routing
│   └── migrations/            # Database migrations
├── frontend/                   # React application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx     # Animated logo, role badges, logout
│   │   │   ├── Footer.jsx
│   │   │   ├── ApplyModal.jsx # Application form with file upload
│   │   │   └── PrivateRoute.jsx # Protected routes
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx       # Landing page with hero section
│   │   │   ├── Login.jsx      # Split-screen gradient design
│   │   │   ├── Register.jsx   # Role selection with cards
│   │   │   ├── InternshipList.jsx # Browse all internships
│   │   │   ├── InternshipDetail.jsx # Detailed view with apply button
│   │   │   ├── Dashboard.jsx  # Role-based dashboard routing
│   │   │   ├── CompanyDashboard.jsx # Company stats and internships
│   │   │   ├── CreateInternship.jsx # Post new internship
│   │   │   ├── ApplicantDetail.jsx # View all applicants for internship
│   │   │   ├── ApplicationDetail.jsx # Review individual application
│   │   │   │                  # with collapsible student profile view
│   │   │   ├── MyApplications.jsx # Student's applications with filtering
│   │   │   ├── Profile.jsx    # Enhanced profile with education & social links
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── FAQ.jsx
│   │   ├── services/          # API services
│   │   │   └── api.js         # Axios instance + JWT interceptors
│   │   ├── context/
│   │   │   └── AuthContext.jsx# Auth state management
│   │   ├── styles.css         # Global styles (1500+ lines)
│   │   │                      # - Gradient design system
│   │   │                      # - Navbar with animations
│   │   │                      # - Auth page styling
│   │   │                      # - Responsive breakpoints
│   │   ├── App.jsx            # Root component with routing
│   │   └── index.js           # Entry point
│   ├── build/                 # Production build (created by npm run build)
│   ├── package.json
│   └── package-lock.json
├── media/                      # Uploaded files
│   ├── cvs/                   # Student resumes
│   ├── application_cvs/       # Application-specific CVs
│   └── logos/                 # Company logos
├── requirements.txt            # Python dependencies
├── manage.py                   # Django management CLI
├── run_production.py           # Production server script (Waitress)
├── db.sqlite3                  # SQLite database
└── README.md                   # This file
```

---

## 🔄 Key Workflows

### 1. Student Application Flow

1. **Browse Internships** → Student views all active internships
2. **View Details** → Click internship card to see full description
3. **Apply** → Click "Apply Now" button (if not already applied)
4. **Fill Form** → Cover letter + Resume upload in modal
5. **Submit** → FormData POST to backend
6. **Validation** → Backend checks duplicates, file size, internship status
7. **Success** → Button changes to "✅ Already Applied"
8. **Track** → View in My Applications with status filtering

### 2. Company Review Flow

1. **Dashboard** → View statistics (total internships, applications, pending)
2. **My Internships** → See all posted internships with applicant counts
3. **View Applicants** → Click "Applicants (X)" button
4. **Filter by Status** → Pending, Reviewing, Shortlisted, Accepted, Rejected
5. **Review Application** → Click "Review" button on any applicant
6. **View Full Profile** → Click "View Full Profile" to expand student details
   - Education (college, degree, year)
   - Bio and skills with badges
   - Social links (GitHub, LinkedIn, Portfolio)
   - Profile resume download
7. **Update Status** → Click status buttons (Reviewing/Shortlist/Accept/Reject)
8. **Download Resume** → Fetch API with blob download

### 3. Authentication & Token Refresh

1. **Login** → POST credentials to `/api/token/`
2. **Store Tokens** → Save access + refresh tokens in localStorage
3. **Auto Attach** → Axios interceptor adds `Authorization: Bearer <token>`
4. **Token Expiry** → 401 response triggers refresh
5. **Refresh Token** → POST refresh token to `/api/token/refresh/`
6. **Retry Request** → Original request retried with new access token
7. **Logout** → Clear tokens and redirect to login

---

## 🌐 API Endpoints

### Authentication
- `POST /api/register/` - Register new user (username, email, password, role)
- `POST /api/token/` - Login (returns access + refresh tokens)
- `POST /api/token/refresh/` - Refresh access token

### Profile
- `GET /api/profile/` - Get current user profile with all fields
- `PATCH /api/profile/` - Update profile (bio, skills, phone, college, degree, 
                          graduation_year, github, linkedin, portfolio, cv)

### Internships
- `GET /api/internships/` - List all active internships
  - Students: See all active internships
  - Companies: See only their own internships
- `POST /api/internships/` - Create internship (Company only)
- `GET /api/internships/:id/` - Get internship details with `has_applied` flag
- `PUT /api/internships/:id/` - Update internship (Company only)
- `DELETE /api/internships/:id/` - Delete internship (Company only)

**Query Parameters:**
- `?q=keyword` - Search in title/description/skills
- `?location=Mumbai` - Filter by location
- `?remote=true` - Filter remote internships only

### Applications
- `GET /api/applications/` - List all applications
- `POST /api/applications/` - Apply to internship (Student only)
  - Validates: no duplicates, internship is active, file size
- `GET /api/applications/my_applications/` - Current student's applications
- `GET /api/applications/:id/internship_applications/` - All applicants for internship (Company)
- `PATCH /api/applications/:id/` - Update application status (Company only)
  - Allowed statuses: pending, reviewing, shortlisted, accepted, rejected

---

## 🎨 UI Features & Design

### Design System
- **Color Palette:**
  - Primary gradient: `#6366f1 → #8b5cf6 → #d946ef` (Purple to Pink)
  - Success: `#27ae60` (Green)
  - Error: `#e74c3c` (Red)
  - Info: `#3498db` (Blue)
  - Warning: `#f39c12` (Orange)

### Animations
- **fadeIn** - Smooth element entrance
- **slideInRight** - Cards sliding from right
- **float** - Continuous floating effect (logo rocket)
- **spin** - Loading spinner rotation
- **Hover effects** - Scale transform on buttons and cards

### Components
- **Navbar** - Glassmorphism with backdrop-filter, animated logo, role badges
- **Auth Pages** - Split-screen layout with gradient backgrounds
- **Cards** - Shadow depth with hover elevation
- **Badges** - Gradient skill badges with white text
- **Buttons** - Smooth transitions with color-coded actions
- **Modals** - Centered overlay with backdrop blur

### Responsive Design
- **Desktop:** Full 2-column layouts, side-by-side cards
- **Tablet (< 968px):** Reduced spacing, flex-wrap layouts
- **Mobile (< 640px):** Single column, full-width buttons, stacked forms

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
---

## 🎯 Future Enhancements

- [ ] Email notifications for application status changes
- [ ] Real-time chat between students and companies  
- [ ] Advanced analytics dashboard with charts
- [ ] Application deadline reminders via email
- [ ] Resume parser (auto-fill profile from CV)
- [ ] Company verification badges
- [ ] Bookmark/save internships feature
- [ ] Bulk status updates for applications
- [ ] Internship recommendations using ML
- [ ] Export applications/reports to PDF
- [ ] Video interview scheduling
- [ ] Skill assessment tests

---

## 📊 Database Schema

**Profile** (OneToOne with User)
- role: student/company
- Personal: phone, bio
- Education: college, degree, graduation_year
- Skills: skills (comma-separated)
- Files: cv, logo
- Social: github, linkedin, portfolio
- Company: company_name

**Internship** (ForeignKey to Profile where role=company)
- Details: title, description, skills_required
- Compensation: stipend, duration
- Location: location, remote (boolean)
- Dates: last_date, created_at
- Status: is_active

**Application** (ForeignKey to Internship + Student Profile)
- Content: cover_letter, cv_copy
- Status: pending/reviewing/shortlisted/accepted/rejected
- Timestamp: applied_at
- Constraint: Unique (internship, student) - prevents duplicate applications

---

## 📞 Contact & Support

For issues, questions, or contributions:
- 📧 Email: support@internhub.com
- 🐛 Bug Reports: Create an issue on GitHub
- 💡 Feature Requests: Open a discussion

---

## ✨ Credits

**Developed by:** Your Name  
**Built with:** Django REST Framework + React  
**Design:** Modern gradient UI with glassmorphism  
**Version:** 2.0.0  
**Last Updated:** December 18, 2025

Special thanks to:
- Django & DRF communities
- React ecosystem
- All contributors and testers

---

**🚀 InternHub - Connecting Students with Opportunities**

---

Made with ❤️ and lots of ☕
