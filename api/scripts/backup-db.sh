#!/bin/bash

# Database backup script for production
# Run this via cron job daily

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgresql"
DB_NAME="${DATABASE_NAME:-scheduler_prod}"
DB_HOST="${DATABASE_HOST:-localhost}"
DB_USER="${DATABASE_USERNAME:-postgres}"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
echo "Starting database backup at $(date)"
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -b -v -f "$BACKUP_DIR/scheduler_backup_$DATE.sql"

if [ $? -eq 0 ]; then
    echo "Database backup completed successfully"
    
    # Compress backup
    gzip "$BACKUP_DIR/scheduler_backup_$DATE.sql"
    
    # Remove old backups (older than retention period)
    find $BACKUP_DIR -name "scheduler_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    
    echo "Backup cleanup completed"
else
    echo "Database backup failed"
    exit 1
fi

# Optional: Upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
# aws s3 cp "$BACKUP_DIR/scheduler_backup_$DATE.sql.gz" s3://your-backup-bucket/postgresql/

echo "Backup process completed at $(date)"