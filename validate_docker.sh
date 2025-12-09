#!/bin/bash

# Docker Environment Validation Script
# Run this to check if Docker is properly installed and configured

set -e

echo "🔍 Checking Docker Installation..."
echo "=================================="
echo ""

# Function to print colored output
print_success() {
    echo "✅ $1"
}

print_error() {
    echo "❌ $1"
}

print_info() {
    echo "ℹ️  $1"
}

# Check if Docker is installed
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker is installed: $DOCKER_VERSION"
else
    print_error "Docker is NOT installed"
    print_info "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is available
if docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    print_success "Docker Compose is available: $COMPOSE_VERSION"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    print_success "Docker Compose (standalone) is available: $COMPOSE_VERSION"
else
    print_error "Docker Compose is NOT available"
    exit 1
fi

# Check if Docker daemon is running
if docker info &> /dev/null; then
    print_success "Docker daemon is running"
else
    print_error "Docker daemon is NOT running"
    print_info "Please start Docker Desktop"
    exit 1
fi

# Check if .env file exists
if [ -f ".env" ]; then
    print_success ".env file exists"
    
    # Validate critical env vars
    if grep -q "SECRET_KEY=your-super-secret-key" .env; then
        print_error "SECRET_KEY not updated in .env"
        print_info "Generate new key: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'"
    else
        print_success "SECRET_KEY is configured"
    fi
    
    if grep -q "DB_PASSWORD=strong_password_here" .env; then
        print_error "DB_PASSWORD not updated in .env"
    else
        print_success "DB_PASSWORD is configured"
    fi
else
    print_error ".env file not found"
    print_info "Copy .env.example to .env: cp .env.example .env"
    exit 1
fi

# Check if required files exist
REQUIRED_FILES=(
    "Dockerfile"
    "docker-compose.yml"
    "frontend/Dockerfile"
    "frontend/nginx.conf"
    "requirements.txt"
    "manage.py"
)

print_info "Checking required files..."
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file exists"
    else
        print_error "$file is missing"
        exit 1
    fi
done

# Check available disk space
AVAILABLE_SPACE=$(df -h . | awk 'NR==2 {print $4}')
print_info "Available disk space: $AVAILABLE_SPACE"

# Check available memory
if command -v free &> /dev/null; then
    AVAILABLE_MEM=$(free -h | awk 'NR==2 {print $7}')
    print_info "Available memory: $AVAILABLE_MEM"
fi

echo ""
echo "=================================="
echo "✅ All checks passed!"
echo ""
echo "You can now run:"
echo "  docker compose build"
echo "  docker compose up -d"
echo ""
echo "Access application at:"
echo "  Frontend: http://localhost"
echo "  API: http://localhost/api/"
echo "  Admin: http://localhost/admin/"
echo "=================================="
