#!/bin/bash

# Quick Docker Setup Script for Internship Portal
# Run this script after Docker Desktop is installed

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Internship Portal - Docker Setup                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker Desktop first."
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running. Please start Docker Desktop."
fi

print_success "Docker is installed and running"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    print_info "Creating .env from template..."
    cp .env.example .env
    
    # Generate SECRET_KEY
    print_info "Generating SECRET_KEY..."
    SECRET_KEY=$(python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" 2>/dev/null || echo "")
    
    if [ -n "$SECRET_KEY" ]; then
        # Update SECRET_KEY in .env (compatible with both macOS and Linux sed)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|SECRET_KEY=.*|SECRET_KEY=$SECRET_KEY|g" .env
        else
            sed -i "s|SECRET_KEY=.*|SECRET_KEY=$SECRET_KEY|g" .env
        fi
        print_success "Generated and set SECRET_KEY"
    else
        print_info "Could not generate SECRET_KEY automatically. Please update it manually in .env"
    fi
    
    print_success ".env file created"
else
    print_success ".env file already exists"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "Starting Docker build process..."
echo "════════════════════════════════════════════════════════════"
echo ""

# Build images
print_info "Building Docker images (this may take 5-10 minutes)..."
docker compose build

print_success "Docker images built successfully"
echo ""

# Start services
print_info "Starting services..."
docker compose up -d

print_success "Services started"
echo ""

# Wait for services to be healthy
print_info "Waiting for services to be ready (this may take 30-60 seconds)..."
sleep 5

# Check service status
echo ""
echo "════════════════════════════════════════════════════════════"
echo "Service Status:"
echo "════════════════════════════════════════════════════════════"
docker compose ps

echo ""
echo "════════════════════════════════════════════════════════════"
echo "Viewing startup logs (press Ctrl+C to stop viewing)..."
echo "════════════════════════════════════════════════════════════"
echo ""

# Show logs for 30 seconds
timeout 30 docker compose logs -f || true

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║               🎉 Deployment Complete! 🎉                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Access your application:"
echo "  Frontend:     http://localhost"
echo "  API:          http://localhost/api/"
echo "  Admin Panel:  http://localhost/admin/"
echo ""
echo "Default Login Credentials:"
echo "  Admin:        admin / admin123"
echo "  Company:      techcorp / password123"
echo "  Students:     john_doe, jane_smith, alex_kumar / password123"
echo ""
echo "Useful Commands:"
echo "  View logs:           docker compose logs -f"
echo "  Stop services:       docker compose stop"
echo "  Restart services:    docker compose restart"
echo "  Remove everything:   docker compose down -v"
echo "  Create superuser:    docker compose exec backend python manage.py createsuperuser"
echo ""
echo "Documentation:"
echo "  Complete Guide:      DOCKER_DEPLOYMENT.md"
echo "  Quick Reference:     DOCKER_QUICKSTART.md"
echo "  Validation Report:   DOCKER_VALIDATION_REPORT.md"
echo ""
print_success "Setup completed successfully!"
