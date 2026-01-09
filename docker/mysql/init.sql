-- Initialize database for Cherry Studio SaaS
-- This script runs automatically when MySQL container starts for the first time

-- Create database if not exists (already created by MYSQL_DATABASE env var)
-- CREATE DATABASE IF NOT EXISTS cherry_studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE cherry_studio;

-- Note: Tables will be created automatically by Drizzle migrations
-- Run migrations after container starts:
-- docker exec -it cherry-studio-backend pnpm saas:migrate
