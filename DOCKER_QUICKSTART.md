# Quick Docker Commands

## Build & Run
```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your values (important!)
nano .env

# 3. Build all services
docker-compose build

# 4. Start all services
docker-compose up -d

# 5. View logs
docker-compose logs -f

# 6. Check status
docker-compose ps
```

## Access Application
- Frontend: http://localhost
- Backend API: http://localhost/api/
- Django Admin: http://localhost/admin/

## Common Commands
```bash
# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# View backend logs
docker-compose logs -f backend

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Seed database
docker-compose exec backend python manage.py seed_portal

# Database backup
docker-compose exec db pg_dump -U postgres internship_portal > backup.sql

# Restart specific service
docker-compose restart backend
```

## Troubleshooting
```bash
# Rebuild without cache
docker-compose build --no-cache

# Check database connection
docker-compose exec backend python manage.py check --database default

# Recollect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

See DOCKER_DEPLOYMENT.md for complete guide.
