# Complete Student Application Flow Example

## Sequence: Student applies to internship

### 1. User clicks "Apply" button on internship detail page

**File: `src/pages/InternshipDetail.jsx`**

```jsx
// User sees internship details
<InternshipDetail />

// Clicks apply button (only visible to students)
{isStudent && !hasApplied && (
  <button onClick={() => setShowApplyModal(true)}>
    Apply Now
  </button>
)}

// Modal opens
{showApplyModal && (
  <ApplyModal
    internshipId={internship.id}
    onClose={() => setShowApplyModal(false)}
    onSuccess={handleApplicationSuccess}
  />
)}
```

### 2. ApplyModal opens with form

**File: `src/components/ApplyModal.jsx`**

```jsx
const ApplyModal = ({ internshipId, onClose, onSuccess }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // User fills form
  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        placeholder="Explain why you're a good fit..."
      />
      <input 
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
      <button type="submit">Submit Application</button>
    </form>
  );
};
```

### 3. User submits form - POST request

**File: `src/components/ApplyModal.jsx` → `handleSubmit()`**

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Prepare data
    const response = await applicationAPI.create({
      internship_id: internshipId,
      cover_letter: coverLetter,
      cv_copy: cvFile
    });

    if (response.success) {
      setShowSuccess(true);  // Show success toast
      setTimeout(() => {
        onSuccess();  // Close modal and refresh
      }, 2000);
    }
  } catch (err) {
    setError(err.message);
  }
  
  setLoading(false);
};
```

### 4. API call to backend

**File: `src/services/api.js` → `applicationAPI.create()`**

```jsx
const applicationAPI = {
  create: async (data) => {
    const formData = new FormData();
    formData.append('internship_id', data.internship_id);
    formData.append('cover_letter', data.cover_letter);
    if (data.cv_copy) {
      formData.append('cv_copy', data.cv_copy);
    }

    const response = await api.post('/applications/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  }
};
```

**Axios interceptor adds JWT token:**

```jsx
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Request sent:**
```
POST http://localhost:8000/api/applications/
Headers:
  Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
  Content-Type: multipart/form-data

Body (FormData):
  internship_id: 5
  cover_letter: "I am very interested in this position because..."
  cv_copy: [File object]
```

### 5. Django backend processes request

**File: `portal/views.py` → `ApplicationViewSet.create()`**

```python
class ApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        # Check user is student
        if request.user.profile.role != 'student':
            return Response(
                {'detail': 'Only students can apply'},
                status=403
            )
        
        # Get internship
        internship_id = request.data.get('internship_id')
        internship = Internship.objects.get(id=internship_id)
        
        # Check duplicate
        if Application.objects.filter(
            internship=internship,
            student=request.user.profile
        ).exists():
            return Response(
                {'detail': 'Already applied'},
                status=400
            )
        
        # Create application
        application = Application.objects.create(
            internship=internship,
            student=request.user.profile,
            cover_letter=request.data.get('cover_letter'),
            cv_copy=request.FILES.get('cv_copy'),
            status='pending'
        )
        
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=201)
```

**Database insertion:**
```sql
INSERT INTO portal_application 
  (internship_id, student_id, cover_letter, cv_copy, status, applied_at)
VALUES
  (5, 3, 'I am very interested...', 'resumes/cv_123.pdf', 'pending', NOW());
```

### 6. Success response returned

**Backend responds:**
```json
{
  "id": 42,
  "internship": {
    "id": 5,
    "title": "Frontend Developer Intern",
    "company": "TechCorp"
  },
  "student": {
    "id": 3,
    "user": {
      "username": "john_doe"
    }
  },
  "cover_letter": "I am very interested in this position...",
  "cv_copy": "http://localhost:8000/media/resumes/cv_123.pdf",
  "status": "pending",
  "applied_at": "2025-12-02T10:30:00Z"
}
```

### 7. Success toast displayed

**File: `src/components/ApplyModal.jsx`**

```jsx
{showSuccess && (
  <div style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: '#27ae60',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
    animation: 'slideIn 0.3s ease-out'
  }}>
    <h3>✓ Application Submitted!</h3>
    <p>Your application has been sent successfully</p>
  </div>
)}
```

### 8. UI updates automatically

**File: `src/pages/InternshipDetail.jsx` → `handleApplicationSuccess()`**

```jsx
const handleApplicationSuccess = async () => {
  setShowApplyModal(false);
  setHasApplied(true);
  
  // Refresh internship data to update application count
  const result = await internshipAPI.getById(id);
  if (result.success) {
    setInternship(result.data);
  }
};
```

**UI changes:**
- "Apply Now" button disappears
- "Already Applied" badge appears
- Application count increments: "15 applications" → "16 applications"
- Success toast auto-dismisses after 2 seconds

### 9. Student can view application

Navigate to `/applications` to see:

```jsx
<MyApplications />
// Shows new application with status "Pending"
```

### 10. Company receives application

Company navigates to `/internships/:id/applicants`:

```jsx
<ApplicantDetail />
// Shows list of all applicants including new one
// Can update status: Pending → Reviewing → Shortlisted → Accepted/Rejected
```

---

## Complete Flow Diagram

```
Student Action          Frontend                    Backend                 Database
-------------          ---------                   --------                ---------
Click "Apply"  →  Open ApplyModal
                       ↓
Fill form       →  State updates
                       ↓
Click Submit    →  handleSubmit()
                       ↓
                  applicationAPI.create()
                       ↓
                  FormData prepared
                       ↓
                  POST /api/applications/  →  ApplicationViewSet.create()
                  + JWT token                        ↓
                                              Validate student role
                                                     ↓
                                              Check duplicate
                                                     ↓
                                              Create application  →  INSERT INTO portal_application
                                                     ↓                       ↓
                  ← 201 Created              Serialize response    ← Record saved
                       ↓
                  Success response
                       ↓
                  setShowSuccess(true)
                       ↓
                  Display toast ✓
                       ↓
                  Wait 2 seconds
                       ↓
                  onSuccess callback
                       ↓
                  Close modal
                       ↓
                  Refresh internship
                       ↓
                  GET /api/internships/:id  →  InternshipViewSet.retrieve()
                       ↓                                ↓
                  ← Updated data            Return with applications_count
                       ↓
                  Update UI:
                  - Hide "Apply" button
                  - Show "Applied" badge
                  - Update count
```

---

## Error Handling

### Duplicate Application
```jsx
// Backend returns 400
{ "detail": "You have already applied to this internship" }

// Frontend displays
<div className="alert alert-error">
  You have already applied to this internship
</div>
```

### Not a Student
```jsx
// Backend returns 403
{ "detail": "Only students can apply to internships" }

// Frontend: Apply button not shown (role check)
{isStudent && <button>Apply</button>}
```

### File Too Large
```jsx
// Frontend validation
if (file.size > 5 * 1024 * 1024) {
  setError('File size must be less than 5MB');
  return;
}
```

### Token Expired
```jsx
// Axios interceptor auto-refreshes token
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Refresh token
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post('/api/token/refresh/', {
        refresh: refreshToken
      });
      localStorage.setItem('access_token', response.data.access);
      
      // Retry original request
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

---

## Testing the Flow

1. **Start servers:**
   ```bash
   # Terminal 1: Django
   cd c:\STUDY\InternShip_Portal
   source venv/Scripts/activate
   python manage.py runserver
   
   # Terminal 2: React
   cd c:\STUDY\InternShip_Portal\frontend
   npm start
   ```

2. **Register as student:**
   - Go to http://localhost:3000/register
   - Fill form with role="student"
   - Login

3. **Browse internships:**
   - Go to http://localhost:3000/internships
   - Click on an internship

4. **Apply:**
   - Click "Apply Now"
   - Fill cover letter
   - Upload resume (optional)
   - Click "Submit Application"
   - See success toast
   - Verify "Applied" badge appears

5. **View application:**
   - Go to http://localhost:3000/applications
   - See your application with status "Pending"

6. **Company view (create company account):**
   - Register with role="company"
   - Create an internship
   - Login as student and apply
   - Login as company
   - Go to dashboard
   - Click "View Applicants" on your internship
   - See the application
   - Change status to "Accepted"

---

## Key Files Reference

- **Application Flow:**
  - `src/pages/InternshipDetail.jsx` - Apply button + modal trigger
  - `src/components/ApplyModal.jsx` - Form + submission logic
  - `src/services/api.js` - API calls
  - `src/services/applications.js` - Application-specific functions
  - `portal/views.py` - Backend validation + creation
  - `portal/models.py` - Application model

- **Viewing Applications:**
  - `src/pages/MyApplications.jsx` - Student view
  - `src/pages/ApplicantDetail.jsx` - Company view
  - `src/pages/StudentDashboard.jsx` - Stats
  - `src/pages/CompanyDashboard.jsx` - Stats