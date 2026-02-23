FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Install PostgreSQL client tools (for psql, pg_dump, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Install global dev tools
RUN npm install -g tsx drizzle-kit
