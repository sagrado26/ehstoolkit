# Docker Configuration for EHS Safety Tool

This directory contains Docker configurations for running the EHS Safety Tool in different environments.

## Files Overview

- `Dockerfile` - Multi-stage production build for the application
- `docker-compose.yml` - Full production stack with PostgreSQL and app
- `docker-compose.dev.yml` - Development setup with database only
- `docker-compose.prod.yml` - Production deployment configuration
- `init.sql` - Database initialization script
- `.env.example` - Sample environment variables for production

## Quick Start

### Development with Docker Database

1. Start the PostgreSQL database:
   ```bash
   docker-compose -f docker/docker-compose.dev.yml up -d
   ```

2. Set your database URL in your local environment:
   ```bash
   export DATABASE_URL="postgresql://postgres:password@localhost:5432/ehs_safety_dev"
   ```

3. Run the application locally:
   ```bash
   npm run dev
   ```

### Full Production Deployment

1. Copy the environment file:
   ```bash
   cp docker/.env.example .env
   ```

2. Edit `.env` with your production values

3. Start the full stack:
   ```bash
   docker-compose -f docker/docker-compose.prod.yml up -d
   ```

### Using with GitHub Codespaces

The application is configured to work with GitHub Codespaces. The dev container will automatically set up the development environment.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | `ehs_safety` |
| `POSTGRES_USER` | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Database password | (required) |
| `DB_PORT` | Database port | `5432` |
| `APP_PORT` | Application port | `5000` |
| `NODE_ENV` | Node environment | `production` |

## Health Checks

The application includes health check endpoints:
- `/api/health` - Application health status

## Database Migration

After starting the containers, run database migrations:

```bash
npm run db:push
```

## Troubleshooting

### Database Connection Issues
- Ensure the database container is healthy: `docker-compose ps`
- Check logs: `docker-compose logs db`
- Verify DATABASE_URL environment variable

### Application Won't Start
- Check application logs: `docker-compose logs app`
- Verify all environment variables are set
- Ensure database is accessible from the app container

### Port Conflicts
- Change ports in docker-compose files if needed
- Use `docker-compose -f docker/docker-compose.dev.yml up -d` for development