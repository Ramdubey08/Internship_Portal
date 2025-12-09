# 🐳 Docker Deployment Guide

Production-ready Docker deployment for Internship Portal with PostgreSQL, Django, and Nginx.

---

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB+ RAM
- 10GB+ disk space

---

## 🚀 Quick Start

### 1. Clone and Setup Environment

```bash
# Clone repository
git clone <repository-url>
cd InternShip_Portal

# Copy environment file
cp .env.example .env

# Edit .env with your production values
nano .env  # or use any text editor
```

### 2. Configure Environment Variables

**Important:** Update these values in `.env`:

```env
SECRET_KEY=generate-a-random-50-character-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_PASSWORD=strong_database_password_here
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

**Generate SECRET_KEY:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 3. Build and Run Containers

```bash
# Build all services
docker-compose build

# Start all services in detached mode
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access Application

- **Frontend:** http://localhost
- **Backend API:** http://localhost/api/
- **Django Admin:** http://localhost/admin/

---

## 📦 Services Overview

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| `db` | PostgreSQL 16 | 5432 | Database server |
| `backend` | Django + Gunicorn | 8000 | REST API backend |
| `frontend` | React + Nginx | 80 | Web application |

---

## 🛠️ Docker Commands

### Build & Start
```bash
# Build images
docker-compose build

# Build without cache
docker-compose build --no-cache

# Start services
docker-compose up -d

# Start specific service
docker-compose up -d backend
```

### Stop & Remove
```bash
# Stop all services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove with volumes (WARNING: deletes database)
docker-compose down -v
```

### Logs & Monitoring
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Check service health
docker-compose ps
```

### Database Management
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Seed database
docker-compose exec backend python manage.py seed_portal

# Access PostgreSQL shell
docker-compose exec db psql -U postgres -d internship_portal

# Backup database
docker-compose exec db pg_dump -U postgres internship_portal > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres internship_portal < backup.sql
```

### Django Management
```bash
# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput

# Run Django shell
docker-compose exec backend python manage.py shell

# Run tests
docker-compose exec backend python manage.py test

# Create migration
docker-compose exec backend python manage.py makemigrations

# Check deployment checklist
docker-compose exec backend python manage.py check --deploy
```

### Container Access
```bash
# Access backend container shell
docker-compose exec backend bash

# Access database container
docker-compose exec db bash

# Access frontend container
docker-compose exec frontend sh
```

---

## 🔧 Production Configuration

### 1. Update Django Settings

**In `.env`:**
```env
DEBUG=False
SECRET_KEY=<generated-secret-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,localhost

# Database
DB_NAME=internship_portal
DB_USER=postgres
DB_PASSWORD=<strong-password>
DB_HOST=db
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security (enable when using HTTPS)
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
```

### 2. SSL/TLS with Let's Encrypt (Optional)

Add to `docker-compose.yml`:

```yaml
services:
  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

Update `frontend/nginx.conf`:
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # ... rest of config
}
```

### 3. Scale Services

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Scale with load balancer
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 📊 Monitoring & Logging

### View Resource Usage
```bash
# Container stats
docker stats

# Specific container
docker stats internship_backend
```

### Log Management
```bash
# Last 100 lines
docker-compose logs --tail=100

# Follow logs with timestamps
docker-compose logs -f -t

# Export logs
docker-compose logs > app_logs.txt
```

### Health Checks
```bash
# Check all services
docker-compose ps

# Inspect health status
docker inspect --format='{{.State.Health.Status}}' internship_backend
```

---

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose build
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

### Database Backup Schedule
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=/backups
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U postgres internship_portal > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -type f -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /path/to/backup.sh
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if database is ready
docker-compose exec backend python manage.py check --database default

# Test database connection
docker-compose exec db pg_isready -U postgres

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py seed_portal
```

### Static Files Not Loading
```bash
# Recollect static files
docker-compose exec backend python manage.py collectstatic --noinput --clear

# Check volume mounts
docker-compose exec backend ls -la /app/staticfiles

# Restart frontend
docker-compose restart frontend
```

### Permission Issues
```bash
# Fix media/static permissions
docker-compose exec backend chown -R appuser:appuser /app/media /app/staticfiles
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Rebuild without cache
docker-compose build --no-cache backend

# Remove and recreate
docker-compose rm -f backend
docker-compose up -d backend
```

### Port Already in Use
```bash
# Find process using port
lsof -i :80
lsof -i :8000

# Kill process or change port in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead
```

---

## 🔐 Security Best Practices

1. **Change default passwords** in `.env`
2. **Use strong SECRET_KEY** (50+ characters)
3. **Enable HTTPS** in production with SSL certificates
4. **Set DEBUG=False** in production
5. **Configure ALLOWED_HOSTS** with your domain
6. **Use environment variables** for sensitive data
7. **Regular backups** of database
8. **Keep Docker images updated**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```
9. **Limit exposed ports** (close 5432, 8000 in firewall)
10. **Use Docker secrets** for sensitive data in swarm mode

---

## 📈 Performance Optimization

### 1. Database Connection Pooling
Add to `.env`:
```env
DB_CONN_MAX_AGE=600
```

### 2. Gunicorn Workers
Calculate workers: `(2 x CPU cores) + 1`
```env
GUNICORN_WORKERS=5
```

### 3. Nginx Caching
Update `frontend/nginx.conf`:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g;

location /api/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 10m;
    # ... rest of config
}
```

### 4. Static File Compression
Already enabled in `nginx.conf` with gzip.

---

## 🌐 Domain Setup

### 1. Point Domain to Server
```
A Record: @ → Your_Server_IP
A Record: www → Your_Server_IP
```

### 2. Update Configuration
```env
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Restart Services
```bash
docker-compose down
docker-compose up -d
```

---

## 📞 Support

For issues:
- Check logs: `docker-compose logs -f`
- Review this guide
- Check Docker documentation
- Verify environment variables

---

## ✅ Production Checklist

- [ ] `.env` configured with strong passwords
- [ ] `DEBUG=False` in production
- [ ] Database backups scheduled
- [ ] SSL/HTTPS configured
- [ ] ALLOWED_HOSTS set correctly
- [ ] Static files collected
- [ ] Migrations applied
- [ ] Superuser created
- [ ] Health checks passing
- [ ] Logs monitored
- [ ] Firewall configured
- [ ] Domain DNS configured

---

**Version:** 1.0.0  
**Last Updated:** December 2, 2025
