#!/bin/bash

# Set variables
BACKUP_DIR="/var/backups/mongo"
BACKUP_FILE="/var/backups/mongo/modelvi_backup_$(date +%Y-%m-%d_%H-%M).archive.gz"

# MongoDB connection credentials
MONGO_HOST="localhost"
MONGO_PORT="27017"  # default port
MONGO_USER="modelvi"
MONGO_PASS="P33j753e!"
AUTH_DB="admin" 
BACKUP_DB="chatbots"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Dump only the chatbots database
mongodump --host "$MONGO_HOST" --port "$MONGO_PORT" \
--username "$MONGO_USER" --password "$MONGO_PASS" \
--authenticationDatabase "$AUTH_DB" \
--db "$BACKUP_DB" \
--archive="$BACKUP_FILE" \
--gzip

# Optional: delete backups older than 7 days
find "/var/backups/mongo" -name "modelvi_backup_*.archive.gz" -type f -mtime +7 -exec rm {} \;