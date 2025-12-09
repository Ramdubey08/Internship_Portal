# 📝 Local Development vs Docker

## Environment Configuration

The project supports both **local development** (SQLite) and **Docker production** (PostgreSQL).

### Local Development (Current Setup)

When running locally **without Docker**, the `.env` file is **NOT automatically loaded** by Django.

**To run locally:**
```bash
# Activate virtual environment
source venv/Scripts/activate  # Windows Git Bash
# OR
venv\Scripts\activate  # Windows CMD

# Run Django server (uses SQLite from settings.py defaults)
python manage.py runserver

# Run tests (uses SQLite)
python manage.py test portal

# Run frontend (separate terminal)
cd frontend
npm start
```

**Local configuration** (in `settings.py`):
- Database: SQLite (`db.sqlite3`)
- DEBUG: True (default)
- ALLOWED_HOSTS: [] (allows localhost/127.0.0.1)
- CORS_ALLOW_ALL_ORIGINS: True

### Docker Production

When running with **Docker**, environment variables from `.env` are loaded by docker-compose.

**To run with Docker:**
```bash
# One-time setup
./docker_setup.sh

# OR manual commands
docker compose build
docker compose up -d
```

**Docker configuration** (from `.env`):
- Database: PostgreSQL (container)
- DEBUG: False
- ALLOWED_HOSTS: from env
- DATABASE_URL: `postgresql://postgres:password@db:5432/internship_portal`

---

## Why .env is NOT Used Locally

Django doesn't load `.env` files automatically. The `.env` file is specifically for Docker deployment where `docker-compose.yml` loads it via the `env_file` directive.

**For local development**, Django uses the default values in `settings.py`:
```python
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-...')  # Uses fallback
DEBUG = os.environ.get('DEBUG', 'True') == 'True'  # Uses fallback 'True'
DATABASE_URL = os.environ.get('DATABASE_URL', None)  # Uses fallback None → SQLite
```

---

## Loading .env Locally (Optional)

If you want to use `.env` for local development, install `python-dotenv`:

```bash
pip install python-dotenv
```

Then add to `manage.py` (before `execute_from_command_line`):
```python
from dotenv import load_dotenv
load_dotenv()
```

**However, this is NOT recommended** because:
- Local development works fine with SQLite
- PostgreSQL requires Docker or manual installation
- Mixing environments can cause confusion

---

## Best Practice

✅ **Local Development**: Use defaults (SQLite, DEBUG=True)
✅ **Docker Production**: Use `.env` file (PostgreSQL, DEBUG=False)

Keep them separate and switch between them as needed:

| Environment | Database | How to Run | Config Source |
|-------------|----------|------------|---------------|
| **Local** | SQLite | `python manage.py runserver` | `settings.py` defaults |
| **Docker** | PostgreSQL | `docker compose up` | `.env` file |

---

## Current Status

Your local environment is correctly configured:
- ✅ SQLite database working
- ✅ 18 tests passing
- ✅ Django server running on port 8000
- ✅ React dev server running on port 3000

Your Docker environment is ready:
- ✅ `.env` configured with PostgreSQL settings
- ✅ All Docker files created
- ✅ Waiting for Docker installation

---

## Quick Reference

```bash
# Local development (current)
python manage.py runserver          # Backend on :8000
cd frontend && npm start             # Frontend on :3000
python manage.py test portal         # Run tests with SQLite

# Docker production (when installed)
docker compose up -d                 # Start all services
docker compose logs -f               # View logs
docker compose exec backend python manage.py test  # Run tests in container
```

---

**Remember**: You don't need to install PostgreSQL locally. Use SQLite for development and PostgreSQL in Docker for production!
