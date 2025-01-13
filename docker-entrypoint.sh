#!/bin/sh
set -e

echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 1
done

echo "Running database migrations..."
pnpm db:push

echo "Starting the application..."
exec "$@"
