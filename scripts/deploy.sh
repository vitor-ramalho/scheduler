#!/bin/bash

# ===========================================
# Scheduler - Deploy Script
# ===========================================
# This script deploys the Scheduler application
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    log_error "Please do not run this script as root"
    exit 1
fi

# Default environment
ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"

log_info "Starting deployment for environment: ${ENVIRONMENT}"

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    log_error "Docker compose file not found: ${COMPOSE_FILE}"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    log_error ".env file not found. Copy .env.${ENVIRONMENT}.example to .env and configure it."
    exit 1
fi

# Load environment variables
set -a
source .env
set +a

log_info "Environment variables loaded"

# Pull latest code (if using git)
if [ -d ".git" ]; then
    log_info "Pulling latest code from git..."
    git pull origin main || log_warning "Git pull failed, continuing anyway..."
fi

# Backup database before deployment
log_info "Creating database backup..."
BACKUP_DIR="./backups"
BACKUP_FILE="${BACKUP_DIR}/backup_$(date +%Y%m%d_%H%M%S).sql"

mkdir -p ${BACKUP_DIR}

if docker compose -f ${COMPOSE_FILE} ps postgres | grep -q "Up"; then
    docker compose -f ${COMPOSE_FILE} exec -T postgres pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > ${BACKUP_FILE}
    log_success "Database backup created: ${BACKUP_FILE}"
else
    log_warning "PostgreSQL container not running, skipping backup"
fi

# Stop old containers (gracefully)
log_info "Stopping old containers..."
docker compose -f ${COMPOSE_FILE} down --remove-orphans

# Clean old images (optional, commented out for safety)
# log_info "Cleaning old Docker images..."
# docker image prune -f

# Build new images
log_info "Building Docker images..."
docker compose -f ${COMPOSE_FILE} build --no-cache

# Start PostgreSQL first
log_info "Starting PostgreSQL..."
docker compose -f ${COMPOSE_FILE} up -d postgres

# Wait for PostgreSQL to be ready
log_info "Waiting for PostgreSQL to be ready..."
until docker compose -f ${COMPOSE_FILE} exec -T postgres pg_isready -U ${POSTGRES_USER} > /dev/null 2>&1; do
    echo -n "."
    sleep 2
done
log_success "PostgreSQL is ready"

# Run migrations
log_info "Running database migrations..."
docker compose -f ${COMPOSE_FILE} run --rm api npm run migration:run || {
    log_error "Migrations failed!"
    log_info "Restoring from backup: ${BACKUP_FILE}"
    docker compose -f ${COMPOSE_FILE} exec -T postgres psql -U ${POSTGRES_USER} ${POSTGRES_DB} < ${BACKUP_FILE}
    exit 1
}
log_success "Migrations completed successfully"

# Start all services
log_info "Starting all services..."
docker compose -f ${COMPOSE_FILE} up -d

# Wait for API to be ready
log_info "Waiting for API to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=0

until curl -f http://localhost:3000/health > /dev/null 2>&1; do
    ATTEMPT=$((ATTEMPT+1))
    if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
        log_error "API failed to start after ${MAX_ATTEMPTS} attempts"
        docker compose -f ${COMPOSE_FILE} logs api
        exit 1
    fi
    echo -n "."
    sleep 2
done
log_success "API is ready"

# Wait for Client to be ready
log_info "Waiting for Client to be ready..."
ATTEMPT=0

until curl -f http://localhost:3001 > /dev/null 2>&1; do
    ATTEMPT=$((ATTEMPT+1))
    if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
        log_error "Client failed to start after ${MAX_ATTEMPTS} attempts"
        docker compose -f ${COMPOSE_FILE} logs client
        exit 1
    fi
    echo -n "."
    sleep 2
done
log_success "Client is ready"

# Show status
log_info "Deployment status:"
docker compose -f ${COMPOSE_FILE} ps

# Show logs (last 20 lines)
log_info "Recent logs (API):"
docker compose -f ${COMPOSE_FILE} logs --tail=20 api

log_info "Recent logs (Client):"
docker compose -f ${COMPOSE_FILE} logs --tail=20 client

# Cleanup old backups (keep last 7 days)
log_info "Cleaning old backups (keeping last 7 days)..."
find ${BACKUP_DIR} -name "backup_*.sql" -mtime +7 -delete

log_success "================================"
log_success "Deployment completed successfully!"
log_success "================================"
log_info "API: http://localhost:3000"
log_info "Client: http://localhost:3001"
log_info "PostgreSQL: localhost:5432"
echo ""
log_info "To view logs:"
echo "  docker compose -f ${COMPOSE_FILE} logs -f"
echo ""
log_info "To stop:"
echo "  docker compose -f ${COMPOSE_FILE} down"
echo ""
log_info "To restart a service:"
echo "  docker compose -f ${COMPOSE_FILE} restart [api|client|postgres]"
