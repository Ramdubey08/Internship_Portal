# API Testing with cURL Commands

## Base URL
```
http://localhost:8000/api
```

---

## 1. REGISTER NEW USER

### Register as Student
```bash
curl -X POST http://localhost:8000/api/token/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_student",
    "password": "testpass123",
    "email": "student@test.com",
    "first_name": "Test",
    "last_name": "Student"
  }'
```

### Register as Company
```bash
curl -X POST http://localhost:8000/api/token/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_company",
    "password": "testpass123",
    "email": "company@test.com",
    "first_name": "Test",
    "last_name": "Company"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": 5,
    "username": "test_student",
    "email": "student@test.com"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 2. LOGIN

```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "techcorp",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Save the access token for subsequent requests:**
```bash
export TOKEN="your_access_token_here"
```

---

## 3. GET PROFILE

```bash
curl -X GET http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "id": 1,
  "user": {
    "id": 2,
    "username": "techcorp",
    "email": "techcorp@example.com",
    "first_name": "Tech",
    "last_name": "Corp"
  },
  "role": "company",
  "bio": "Leading technology solutions provider...",
  "skills": "Python, Django, React, Cloud Computing, AI/ML",
  "cv": null,
  "company_name": "TechCorp Solutions",
  "logo": null
}
```

---

## 4. UPDATE PROFILE

```bash
curl -X PATCH http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio information",
    "skills": "Python, Django, React, AWS"
  }'
```

---

## 5. LIST INTERNSHIPS

### Get all internships
```bash
curl -X GET http://localhost:8000/api/internships/ \
  -H "Authorization: Bearer $TOKEN"
```

### Search internships by keyword
```bash
curl -X GET "http://localhost:8000/api/internships/?q=developer" \
  -H "Authorization: Bearer $TOKEN"
```

### Filter by location
```bash
curl -X GET "http://localhost:8000/api/internships/?location=Mumbai" \
  -H "Authorization: Bearer $TOKEN"
```

### Filter by skills
```bash
curl -X GET "http://localhost:8000/api/internships/?skills=Python" \
  -H "Authorization: Bearer $TOKEN"
```

### Filter remote internships
```bash
curl -X GET "http://localhost:8000/api/internships/?remote=true" \
  -H "Authorization: Bearer $TOKEN"
```

### Get my posted internships (company only)
```bash
curl -X GET "http://localhost:8000/api/internships/?my_internships=true" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "count": 6,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "poster": {
        "id": 1,
        "user": {
          "username": "techcorp"
        },
        "company_name": "TechCorp Solutions"
      },
      "title": "Frontend Developer Intern",
      "description": "Join our team to build amazing user interfaces...",
      "skills_required": "React, JavaScript, HTML, CSS, Git",
      "stipend": "15000.00",
      "duration": "3 months",
      "location": "Mumbai",
      "remote": false,
      "last_date": "2025-01-01",
      "is_active": true,
      "created_at": "2025-12-02T10:00:00Z",
      "applications_count": 1
    }
  ]
}
```

---

## 6. GET SINGLE INTERNSHIP

```bash
curl -X GET http://localhost:8000/api/internships/1/ \
  -H "Authorization: Bearer $TOKEN"
```

---

## 7. CREATE INTERNSHIP (Company Only)

**First, login as company to get token:**
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "techcorp",
    "password": "password123"
  }'
```

**Then create internship:**
```bash
curl -X POST http://localhost:8000/api/internships/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Full Stack Developer Intern",
    "description": "Work on both frontend and backend technologies. Build complete web applications.",
    "skills_required": "React, Node.js, MongoDB, Express",
    "stipend": "25000.00",
    "duration": "6 months",
    "location": "Remote",
    "remote": true,
    "last_date": "2025-12-31",
    "is_active": true
  }'
```

**Expected Response:**
```json
{
  "id": 7,
  "poster": {
    "id": 1,
    "user": {
      "username": "techcorp"
    },
    "company_name": "TechCorp Solutions"
  },
  "title": "Full Stack Developer Intern",
  "description": "Work on both frontend and backend technologies...",
  "skills_required": "React, Node.js, MongoDB, Express",
  "stipend": "25000.00",
  "duration": "6 months",
  "location": "Remote",
  "remote": true,
  "last_date": "2025-12-31",
  "is_active": true,
  "created_at": "2025-12-02T11:30:00Z",
  "applications_count": 0
}
```

---

## 8. UPDATE INTERNSHIP (Company Only)

```bash
curl -X PATCH http://localhost:8000/api/internships/7/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stipend": "30000.00",
    "is_active": false
  }'
```

---

## 9. DELETE INTERNSHIP (Company Only)

```bash
curl -X DELETE http://localhost:8000/api/internships/7/ \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** `204 No Content`

---

## 10. APPLY TO INTERNSHIP (Student Only)

**First, login as student:**
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

**Then apply:**
```bash
curl -X POST http://localhost:8000/api/applications/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "internship_id": 4,
    "cover_letter": "I am very interested in this Mobile App Developer position. I have experience with React Native and am eager to contribute to your team."
  }'
```

**With file upload (use multipart/form-data):**
```bash
curl -X POST http://localhost:8000/api/applications/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "internship_id=4" \
  -F "cover_letter=I am very interested in this position..." \
  -F "cv_copy=@/path/to/resume.pdf"
```

**Expected Response:**
```json
{
  "id": 10,
  "internship": {
    "id": 4,
    "title": "Mobile App Developer Intern"
  },
  "student": {
    "id": 2,
    "user": {
      "username": "john_doe"
    }
  },
  "cover_letter": "I am very interested in this Mobile App Developer position...",
  "cv_copy": "http://localhost:8000/media/resumes/cv_john_doe.pdf",
  "status": "pending",
  "applied_at": "2025-12-02T12:00:00Z"
}
```

---

## 11. GET MY APPLICATIONS (Student Only)

```bash
curl -X GET http://localhost:8000/api/applications/my_applications/ \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "internship": {
      "id": 1,
      "title": "Frontend Developer Intern"
    },
    "status": "accepted",
    "applied_at": "2025-12-02T10:30:00Z"
  },
  {
    "id": 2,
    "internship": {
      "id": 2,
      "title": "Backend Developer Intern"
    },
    "status": "reviewing",
    "applied_at": "2025-12-02T10:35:00Z"
  }
]
```

---

## 12. GET APPLICANTS FOR INTERNSHIP (Company Only)

```bash
curl -X GET http://localhost:8000/api/applications/1/internship_applications/ \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "internship": {
      "id": 1,
      "title": "Frontend Developer Intern"
    },
    "student": {
      "id": 2,
      "user": {
        "username": "john_doe",
        "email": "john@example.com"
      },
      "bio": "Computer Science student passionate about web development...",
      "skills": "Python, JavaScript, React, Node.js, MongoDB"
    },
    "cover_letter": "I am very excited about this Frontend Developer position...",
    "cv_copy": null,
    "status": "accepted",
    "applied_at": "2025-12-02T10:30:00Z"
  }
]
```

---

## 13. CHANGE APPLICATION STATUS (Company Only)

```bash
curl -X PATCH http://localhost:8000/api/applications/2/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shortlisted"
  }'
```

**Valid status values:**
- `pending`
- `reviewing`
- `shortlisted`
- `accepted`
- `rejected`

**Expected Response:**
```json
{
  "id": 2,
  "status": "shortlisted"
}
```

---

## 14. REFRESH TOKEN

```bash
curl -X POST http://localhost:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "your_refresh_token_here"
  }'
```

**Expected Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## Complete Test Sequence

### Test as Company User

```bash
# 1. Login as company
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "techcorp", "password": "password123"}' \
  | jq -r '.access' > token.txt

export TOKEN=$(cat token.txt)

# 2. Get profile
curl -X GET http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer $TOKEN"

# 3. Create internship
curl -X POST http://localhost:8000/api/internships/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Internship",
    "description": "Test description",
    "skills_required": "Python, Django",
    "stipend": "20000.00",
    "duration": "3 months",
    "location": "Mumbai",
    "remote": false,
    "last_date": "2025-12-31",
    "is_active": true
  }'

# 4. View my internships
curl -X GET "http://localhost:8000/api/internships/?my_internships=true" \
  -H "Authorization: Bearer $TOKEN"

# 5. View applicants for internship ID 1
curl -X GET http://localhost:8000/api/applications/1/internship_applications/ \
  -H "Authorization: Bearer $TOKEN"

# 6. Change application status
curl -X PATCH http://localhost:8000/api/applications/1/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "accepted"}'
```

### Test as Student User

```bash
# 1. Login as student
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "password123"}' \
  | jq -r '.access' > token.txt

export TOKEN=$(cat token.txt)

# 2. Get profile
curl -X GET http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer $TOKEN"

# 3. Browse internships
curl -X GET "http://localhost:8000/api/internships/?q=developer" \
  -H "Authorization: Bearer $TOKEN"

# 4. Get internship details
curl -X GET http://localhost:8000/api/internships/1/ \
  -H "Authorization: Bearer $TOKEN"

# 5. Apply to internship
curl -X POST http://localhost:8000/api/applications/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "internship_id": 5,
    "cover_letter": "I am interested in this position and believe my skills align well."
  }'

# 6. View my applications
curl -X GET http://localhost:8000/api/applications/my_applications/ \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Responses

### 401 Unauthorized (No token or expired token)
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden (Permission denied)
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 400 Bad Request (Duplicate application)
```json
{
  "detail": "You have already applied to this internship"
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```
