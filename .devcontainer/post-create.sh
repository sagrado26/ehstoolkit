#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h db -U postgres -q; do
  sleep 1
done

echo "Pushing database schema..."
npx drizzle-kit push

echo "Setup complete! Run 'npm run dev' to start the app."
