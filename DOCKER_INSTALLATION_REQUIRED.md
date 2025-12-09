# Docker Installation Required

Docker is not currently installed on your system. Please install Docker Desktop to use the Docker deployment.

## Installation Steps

### Windows (Docker Desktop)

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop
   - Click "Download for Windows"

2. **System Requirements:**
   - Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
   - OR Windows 11 64-bit
   - WSL 2 feature enabled
   - 4GB RAM minimum (8GB recommended)

3. **Install Docker Desktop:**
   - Run the installer
   - Follow the installation wizard
   - Restart your computer when prompted

4. **Verify Installation:**
   ```bash
   docker --version
   docker compose version
   ```

5. **Start Docker Desktop:**
   - Launch Docker Desktop from Start menu
   - Wait for "Docker Desktop is running" notification

### Alternative: Use Docker without Installation

If you cannot install Docker, you can still deploy the application using traditional methods:

#### Option 1: Local Development (Current Setup)
- Backend: `python manage.py runserver`
- Frontend: `npm start`
- Database: SQLite (already working)

#### Option 2: Production with PostgreSQL (Manual)

**Install PostgreSQL:**
```bash
# Download from: https://www.postgresql.org/download/windows/
```

**Create Database:**
```bash
psql -U postgres
CREATE DATABASE internship_portal;
CREATE USER internship_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE internship_portal TO internship_user;
\q
```

**Update settings.py:**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'internship_portal',
        'USER': 'internship_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

**Install psycopg2:**
```bash
pip install psycopg2-binary
```

**Run migrations:**
```bash
python manage.py migrate
python manage.py seed_portal
python manage.py collectstatic
```

**Deploy with Gunicorn (Production):**
```bash
pip install gunicorn
gunicorn --bind 0.0.0.0:8000 intern_portal.wsgi:application
```

**Build React for Production:**
```bash
cd frontend
npm run build
# Serve build folder with any static file server
```

---

## After Installing Docker

Once Docker is installed, run:

```bash
# 1. Build containers
docker compose build

# 2. Start services
docker compose up -d

# 3. Check status
docker compose ps

# 4. View logs
docker compose logs -f
```

Access at:
- Frontend: http://localhost
- Backend API: http://localhost/api/
- Admin: http://localhost/admin/

---

## Current Status

✅ **All Docker files are ready:**
- Dockerfile (backend)
- frontend/Dockerfile
- docker-compose.yml
- .env configured
- nginx.conf
- .dockerignore files

⏳ **Waiting for:** Docker installation

Once Docker is installed, the deployment will work immediately without any code changes needed.
