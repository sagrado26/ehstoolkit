
# EHS Safety Tool Development Skill

## Overview
This skill provides comprehensive guidance for developing, maintaining, and extending the EHS Safety Tool, a full-stack web application for Environmental, Health, and Safety (EHS) management. It includes technical architecture details, best practices, and step-by-step instructions for common development tasks.

## Technical Architecture
The EHS Safety Tool is a full-stack web application designed for EHS management in industrial settings. It provides a platform for managing safety plans, permits to work, crane inspections, Draeger calibrations, incident reporting, and documentation.

### Architecture Components
- **Frontend (Client)**: React 18 SPA with TypeScript, hosted in `client/` directory
- **Backend (Server)**: Node.js/Express API server in `server/` directory
- **Shared**: Common schemas and types in `shared/` directory
- **Database**: PostgreSQL with Drizzle ORM, using Neon Database

### Tech Stack
**Frontend:**
- React 18 + TypeScript
- Wouter for routing
- Tailwind CSS + shadcn/ui components
- TanStack React Query for state management
- React Hook Form + Zod for forms
- Recharts for data visualization

**Backend:**
- Node.js + TypeScript
- Express.js framework
- Passport.js for authentication
- Drizzle ORM for database operations
- WebSockets for real-time features

## Development Setup
1. Install dependencies: `npm install`
2. Set up database: Configure Neon PostgreSQL connection
3. Run development server: `npm run dev`
4. Build for production: `npm run build`
5. Push database schema: `npm run db:push`

## Adding New Features
### Frontend Components
1. Create component in appropriate `client/src/components/` subdirectory
2. Use shadcn/ui components for consistency
3. Implement with TypeScript and proper typing
4. Add to relevant page in `client/src/pages/`

### Backend Routes
1. Create route file in `server/routes/`
2. Define CRUD operations using Express
3. Add database operations with Drizzle ORM
4. Register routes in `server/routes.ts`

### Database Schema
1. Define tables in `shared/schema.ts` using Drizzle
2. Generate Zod schemas with `createInsertSchema`
3. Run `npm run db:push` to apply changes

## Best Practices
### Code Organization
- Maintain modular structure with feature-based directories
- Use TypeScript strictly for type safety
- Follow React best practices with hooks and functional components
- Implement proper error handling and validation

### Security
- Validate all inputs with Zod schemas
- Use parameterized queries through Drizzle ORM
- Implement role-based access control
- Store sensitive data securely

### Performance
- Use lazy loading for route components
- Implement proper caching with React Query
- Optimize database queries
- Minimize bundle size with tree shaking

### UI/UX
- Use consistent design with shadcn/ui components
- Implement responsive design with Tailwind CSS
- Provide loading states and error handling
- Ensure accessibility compliance

## Form Architecture Patterns

### Safety Plan Form (4-Step Wizard)
The primary safety plan form follows a specific 4-step wizard pattern:

#### Step 1: Job Details (Modal Entry Point)
- **Modal Design**: Attention-grabbing popup for initial data entry
- **Includes**: Social distancing compliance question
- **Purpose**: Quick job overview before detailed safety assessment

#### Step 2: Safety Check (Boolean Questions)
- **Layout**: Toggle rows with tooltips (no collapsible sections)
- **Questions**: 11 boolean safety questions (q1-q11)
- **Pattern**: Yes/No responses for specialized training, chemicals, impact on others, falls, barricades, LOTO, lifting, ergonomics, other concerns, head injury, other PPE

#### Step 3: Hazard ID (Risk Assessment)
- **Matrix**: Severity (1-4) × Likelihood (1-4) risk assessment
- **Storage**: JSON format for hazard assessments with mitigation plans
- **UI**: Interactive hazard selection with assessment cards

#### Step 4: Sign Off (Approval Workflow)
- **Fields**: Lead name, approver name, engineer list, comments
- **Status**: Final submission with approval workflow
- **Validation**: Required fields for completion

### Key Form Patterns
- **Visual Stepper**: Icon-based progress bar with connecting lines
- **Clickable Steps**: Completed steps remain accessible for editing
- **WorkDetailsSummary**: Reusable component showing compact job details
- **Modal vs Inline**: Step 1 uses modal, steps 2-4 are inline forms
- **Form Validation**: `react-hook-form` with `zodResolver`
- **Button Types**: All edit buttons inside `<form>` must have `type="button"`

### Navigation Link Management
When modifying form routes, update ALL references:
- `client/src/App.tsx` (route definition)
- `client/src/components/DashboardSidebar.tsx` (navigation items)
- `client/src/components/CurrentToolsCard.tsx` (tools list)
- `client/src/components/SafetyOverviewCard.tsx` (link components)
- `client/src/components/RecentPlansTable.tsx` (edit navigation)

### Styling Conventions (Enhanced)
- **shadcn/ui Components**: `Card`, `Button`, `Badge`, `Dialog` - never customize hover/active states
- **Elevation Classes**: Use `hover-elevate` and `active-elevate-2` for custom elements
- **Themes**: Blue (default), Green, Violet + dark/light mode support
- **Spacing**: Consistent small/medium/large levels throughout
- **Border Radius**: `rounded-md` only (never partial borders on rounded elements)
- **Icons**: `lucide-react` for all iconography

### Component Reusability
- **WorkDetailsSummary**: Compact job details display with edit functionality
- **HazardCard**: Individual hazard assessment components
- **StepperBar**: Visual progress indication
- **PreviewModal**: Form preview before submission
- **JobDetailsModal**: Initial data entry modal

## Common Development Tasks
### Adding a New Safety Module
1. Create database table in `shared/schema.ts`
2. Add backend routes in `server/routes/`
3. Create frontend page in `client/src/pages/`
4. Add navigation in `client/src/App.tsx`
5. Update dashboard if needed

### Implementing Authentication
- Use Passport.js local strategy
- Store sessions in PostgreSQL
- Implement role-based permissions
- Add login/logout UI components

### Real-time Features
- Use WebSocket connections for live updates
- Implement proper connection handling
- Update React Query cache when receiving WS messages

## Testing and Validation
- Run TypeScript checks: `npm run check`
- Test database operations manually
- Validate forms with Zod schemas
- Check UI responsiveness across devices

## Deployment
- Build with `npm run build`
- Deploy to production environment
- Configure environment variables
- Set up database migrations

### Deployment via GitHub Codespaces
GitHub Codespaces provides instant cloud development environments. **This project already includes complete Docker configuration** - no additional setup needed!

## 🚀 **Streamlined Codespaces Migration (5 Minutes)**

### **Step 1: Repository Setup**
1. Create GitHub repository: `ehs-safety-tool`
2. Upload all project files (including `.devcontainer/` directory)
3. Push to main branch

### **Step 2: Launch Codespace**
1. Go to repository → "Code" → "Codespaces" tab
2. Click "Create codespace on main"
3. **Wait 2-3 minutes** - automatic setup happens:
   - ✅ Docker containers build
   - ✅ PostgreSQL database starts  
   - ✅ Dependencies install
   - ✅ Database schema deploys
   - ✅ Development server starts

### **Step 3: Start Developing**
- **App URL**: Click port 5000 in "Ports" tab
- **Database**: PostgreSQL ready at `db:5432`
- **Terminal**: Full Docker environment available

## 🐳 **Existing Docker Configuration**

The project includes production-ready Docker setup:

### **Dev Container Features**
- **Node.js 20** + TypeScript environment
- **PostgreSQL 16** with persistent data
- **Auto-setup scripts** in `.devcontainer/post-create.sh`
- **VS Code extensions** pre-configured
- **Port forwarding** (5000 app, 5432 database)

### **Database Options**
**Option A: Docker PostgreSQL (Recommended for Codespaces)**
```bash
# Already configured in docker-compose.yml
DATABASE_URL=postgresql://postgres:postgres@db:5432/safetyplan
```

**Option B: Neon PostgreSQL (For production)**
```bash
# Set in Codespaces environment variables
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname
```

## 📋 **Migration Checklist**

### **Pre-Migration**
- [ ] GitHub repository created
- [ ] All project files uploaded (including `.devcontainer/`)
- [ ] Repository set to public/private as needed

### **Migration Steps**
- [ ] Create codespace from main branch
- [ ] Wait for automatic setup (2-3 minutes)
- [ ] Verify app loads on port 5000
- [ ] Test database connection
- [ ] Confirm all 6 tools accessible

### **Post-Migration**
- [ ] Test all CRUD operations
- [ ] Verify form submissions work
- [ ] Check dashboard analytics
- [ ] Confirm user authentication

## 🔧 **Codespaces Development Workflow**

### **Daily Development**
```bash
# Codespace auto-starts with:
npm run dev          # Development server
# PostgreSQL running # Database ready
```

### **Database Operations**
```bash
# Schema changes
npm run db:push

# Connect to database
psql -h db -U postgres -d safetyplan
```

### **File Management**
- **Hot Reload**: Automatic on file changes
- **Git Operations**: Direct commit/push from Codespaces
- **Extensions**: Pre-installed VS Code extensions

## 🌟 **Codespaces Advantages for EHS Tool**

### **Zero Local Setup**
- No Docker installation needed
- No PostgreSQL configuration
- No Node.js version conflicts
- Works on any device/browser

### **Team Collaboration**
- Share running environment URLs
- Real-time collaboration possible
- Consistent development experience
- Automatic resource scaling

### **Production Parity**
- Same Docker environment as production
- PostgreSQL database included
- Environment variables managed
- Build/test/deploy pipeline ready

## 🚨 **Troubleshooting**

### **Codespace Won't Start**
- Check repository has `.devcontainer/` folder
- Verify `docker-compose.yml` exists
- Check GitHub account has Codespaces access

### **App Won't Load**
- Check port 5000 is forwarded
- Verify `npm run dev` is running
- Check browser console for errors

### **Database Issues**
- Run `npm run db:push` to deploy schema
- Check `docker-compose.yml` for correct credentials
- Verify PostgreSQL container is running

### **Performance Issues**
- Codespaces provides 2-32 CPU cores
- Monitor usage in GitHub settings
- Close unused codespaces to free resources

## 💰 **Cost Optimization**

- **Free Tier**: 120 core-hours/month for public repos
- **Paid Plans**: $0.18/hour for private repos
- **Auto-Sleep**: Codespaces sleep after inactivity
- **Prebuilds**: Reduce startup time (paid feature)

This revised plan leverages the **existing Docker configuration** for instant, reliable cloud development environments. The EHS Safety Tool is **Codespaces-ready** out of the box!

## Full Deployment Plan: GitHub + Docker

This comprehensive plan outlines the complete setup for deploying the EHS Safety Tool using GitHub for source control and CI/CD, combined with Docker for containerization and cloud deployment.

### Phase 1: Repository & Source Control Setup

#### 1.1 Create GitHub Repository
```bash
# Create new repository on GitHub
# Name: ehs-safety-tool
# Visibility: Private (for production) or Public (for open-source)
# Initialize with: README.md, .gitignore (Node.js template)
```

#### 1.2 Repository Structure
```
ehs-safety-tool/
├── .github/
│   ├── workflows/          # GitHub Actions CI/CD
│   └── ISSUE_TEMPLATE/     # Issue templates
├── .devcontainer/          # VS Code dev container
├── client/                 # React frontend
├── server/                 # Express backend
├── shared/                 # Shared schemas
├── docker/                 # Docker configurations
│   ├── Dockerfile          # Multi-stage build
│   ├── docker-compose.yml  # Local development
│   └── nginx.conf          # Production web server
├── docs/                   # Documentation
├── .env.example            # Environment template
├── docker-compose.prod.yml # Production compose
└── package.json
```

#### 1.3 Initial Commit
```bash
git init
git add .
git commit -m "Initial commit: EHS Safety Tool v1.0.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ehs-safety-tool.git
git push -u origin main
```

### Phase 2: Docker Configuration

#### 2.1 Production Dockerfile
Create `docker/Dockerfile`:
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "start"]
```

#### 2.2 Docker Compose for Production
Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - SESSION_SECRET=${SESSION_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=safetyplan
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 2.3 Nginx Configuration
Create `docker/nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:5000;
    }

    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
}
```

### Phase 3: CI/CD Pipeline Setup

#### 3.1 GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: TypeScript check
      run: npm run check

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        file: ./docker/Dockerfile
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production server..."
        # Add your deployment commands here
        # Examples: SSH to server, pull image, restart services
```

#### 3.2 Environment Secrets Setup
In GitHub repository settings → Secrets and variables → Actions:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SESSION_SECRET=your-secure-session-secret
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password
```

### Phase 4: Cloud Deployment Options

#### Option A: Railway (Recommended)
1. **Connect Repository**: Link GitHub repo to Railway
2. **Auto-deploy**: Railway detects Node.js and PostgreSQL
3. **Environment Variables**: Set in Railway dashboard
4. **Domain**: Get `your-app.railway.app` URL
5. **Cost**: $5-10/month

#### Option B: Render
1. **Web Service**: Deploy from GitHub
2. **PostgreSQL**: Add managed database
3. **Auto-deploy**: On every push to main
4. **SSL**: Automatic HTTPS
5. **Cost**: $7/month for web + $7/month for DB

#### Option C: Fly.io
1. **Install Fly CLI**: `fly launch`
2. **Use Docker**: Fly.io works great with Docker
3. **Global Deployment**: Deploy to multiple regions
4. **PostgreSQL**: Built-in or external
5. **Cost**: $5-15/month

#### Option D: DigitalOcean App Platform
1. **App Spec**: Define services in YAML
2. **Database**: Managed PostgreSQL
3. **Domains**: Custom domain support
4. **Scaling**: Automatic scaling
5. **Cost**: $12-25/month

### Phase 5: Database & Environment Setup

#### 5.1 Production Database
```bash
# For Railway/Render (managed PostgreSQL)
# Database is auto-provisioned

# For self-hosted PostgreSQL
createdb safetyplan
createuser ehs_user
psql -c "ALTER USER ehs_user PASSWORD 'secure_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE safetyplan TO ehs_user;"
```

#### 5.2 Environment Configuration
Create `.env.example`:
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/safetyplan

# Security
SESSION_SECRET=your-super-secure-random-string-here

# Application
NODE_ENV=production
PORT=5000

# Optional: External Services
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

#### 5.3 SSL/TLS Setup
```bash
# For Let's Encrypt (free SSL)
certbot --nginx -d your-domain.com

# Or use cloud provider's SSL certificates
# Railway, Render, Fly.io provide automatic SSL
```

### Phase 6: Monitoring & Maintenance

#### 6.1 Health Checks
Add to `server/index.ts`:
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

#### 6.2 Logging
```typescript
// Use Winston or similar for production logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

#### 6.3 Backup Strategy
```bash
# Database backup script
pg_dump safetyplan > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backups with cron
# 0 2 * * * pg_dump safetyplan | gzip > /backups/backup_$(date +\%Y\%m\%d).sql.gz
```

### Phase 7: Security & Performance

#### 7.1 Security Headers
```typescript
// In Express app
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

#### 7.2 Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

#### 7.3 Performance Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Database query optimization
- Image optimization

### Phase 8: Deployment Checklist

#### Pre-Deployment
- [ ] Code review completed
- [ ] Tests passing
- [ ] Security audit done
- [ ] Performance benchmarks met
- [ ] Documentation updated

#### Deployment Steps
- [ ] Merge to main branch
- [ ] CI/CD pipeline triggered
- [ ] Docker image built and pushed
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] SSL certificates configured
- [ ] DNS records updated
- [ ] Health checks passing

#### Post-Deployment
- [ ] Application accessible
- [ ] Database connections working
- [ ] User authentication functional
- [ ] Monitoring alerts configured
- [ ] Backup systems operational
- [ ] Team notified of deployment

### Phase 9: Rollback Plan

#### Automated Rollback
```yaml
# In GitHub Actions
- name: Rollback on failure
  if: failure()
  run: |
    # Rollback to previous deployment
    # Notify team
    # Log incident
```

#### Manual Rollback
1. **Database**: Restore from backup
2. **Application**: Deploy previous version
3. **Infrastructure**: Revert infrastructure changes
4. **DNS**: Update DNS if needed

### Cost Estimation

| Service | Monthly Cost | Notes |
|---------|-------------|--------|
| GitHub | $0-45 | Free for public repos, Teams for private |
| Railway | $5-10 | Web service + PostgreSQL |
| Render | $14 | Web service + PostgreSQL |
| Fly.io | $5-15 | Global deployment |
| Domain | $10-20 | Annual cost |
| SSL | $0 | Free with Let's Encrypt |
| **Total** | **$20-60/month** | For production deployment |

### Success Metrics
- **Uptime**: 99.9% availability
- **Performance**: <2s response time
- **Security**: Zero vulnerabilities
- **User Satisfaction**: Positive feedback
- **Maintenance**: <1 hour/month downtime

This deployment plan provides a production-ready, scalable, and maintainable infrastructure for the EHS Safety Tool. The combination of GitHub for source control, Docker for containerization, and cloud platforms for hosting ensures reliability, security, and ease of maintenance.

This skill ensures consistent development practices and helps maintain the application's quality and scalability.