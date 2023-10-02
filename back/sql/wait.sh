#!/bin/bash
set -e

max_retries=30
retry_interval=2

for ((i=0; i<max_retries; i++)); do
  if mysql -hdb -uyoussef -proot -e "SELECT 1" >/dev/null 2>&1; then
    echo "MySQL is ready. Starting Django application."
    exit 0
  else
    echo "Waiting for MySQL to become available... (Retry $((i+1)))"
    sleep $retry_interval
 fi
done


