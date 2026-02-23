-- Database initialization for EHS Safety Tool
-- This file runs when the PostgreSQL container starts for the first time

-- Create the database (if not exists)
-- Note: The database is already created via POSTGRES_DB environment variable

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance (these will be created by Drizzle, but we can pre-create them)
-- The actual schema will be managed by Drizzle ORM migrations