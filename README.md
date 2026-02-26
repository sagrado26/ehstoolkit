# 🛡️ EHS Safety Tool

A comprehensive Environmental, Health, and Safety (EHS) management platform built for industrial facilities, featuring 6 core safety modules and enterprise-grade functionality.

![EHS Safety Tool](https://img.shields.io/badge/Status-Production--Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Codespaces](https://img.shields.io/badge/Codespaces-Supported-purple)

## 🌟 Features

### Core Safety Modules
- **📋 Safety Plans** - Pre-task hazard assessments with approval workflows
- **⚠️ Permit to Work** - Work authorization and safety clearance system
- **🏗️ Crane Inspections** - Equipment safety verification and tracking
- **🧪 Draeger Calibrations** - Gas detection device maintenance records
- **🚨 Incident Management** - Safety incident reporting and investigation
- **📚 Documentation** - Centralized safety document library

### Technical Features
- **Full-Stack Application** - React frontend + Express backend
- **Database** - PostgreSQL with Drizzle ORM
- **Authentication** - User management with role-based access
- **Dashboard** - Real-time analytics and safety metrics
- **Docker Ready** - Containerized for easy deployment
- **Cloud Development** - GitHub Codespaces support
- **TypeScript** - Full type safety throughout

## 🚀 Quick Start

### Option 1: GitHub Codespaces (Recommended - 5 Minutes)
1. Click the **"Code"** button above
2. Select **"Codespaces"** tab
3. Click **"Create codespace on main"**
4. Wait 2-3 minutes for automatic setup
5. Click port **5000** in the Ports tab to access the application

**That's it!** No local setup required.

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/sagrado26/ehstoolkit.git
cd ehs-toolkit

# Install dependencies
npm install

# Set up database (choose one option):

# Option A: Docker PostgreSQL (Recommended)
docker-compose -f docker/docker-compose.dev.yml up -d
export DATABASE_URL="postgresql://postgres:password@localhost:5432/ehs_safety_dev"

# Option B: Local PostgreSQL
# Install PostgreSQL locally and create database
export DATABASE_URL="postgresql://user:pass@localhost:5432/ehs_safety"

# Option C: Neon PostgreSQL (Cloud)
# Create account at neon.tech and get connection string
export DATABASE_URL="your_neon_connection_string"

# Deploy database schema
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:5000` to access the application.

### Option 3: Docker Production
```bash
# Clone and navigate to docker directory
git clone https://github.com/sagrado26/ehstoolkit.git
cd ehs-toolkit/docker

# Configure environment
cp .env.example .env
# Edit .env with your production values

# Start full stack
docker-compose -f docker-compose.prod.yml up -d
```

Visit `http://localhost:5000` to access the application.

## 🏗️ Project Structure

```
ehs-safety-tool/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (shadcn/ui)
│   │   ├── features/       # Feature-specific modules (6 safety tools)
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Express.js backend
│   ├── routes/             # API route handlers (6 modules)
│   ├── db.ts               # Database connection
│   └── index.ts            # Server entry point
├── shared/                 # Shared schemas and types
│   └── schema.ts           # Database schema (10 tables)
├── .devcontainer/          # VS Code dev container config
│   ├── docker-compose.yml  # PostgreSQL + app services
│   └── devcontainer.json   # Development environment
├── docs/                  # Development documentation
└── package.json           # Dependencies and scripts
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Full type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **TanStack Query** - Powerful data fetching
- **React Hook Form + Zod** - Form management and validation
- **Recharts** - Data visualization
- **Wouter** - Lightweight routing

### Backend
- **Node.js 20** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Robust relational database
- **Drizzle ORM** - Type-safe database toolkit
- **Passport.js** - Authentication middleware
- **WebSocket** - Real-time features
- **TypeScript** - Backend type safety

### DevOps & Tools
- **Docker** - Containerization platform
- **GitHub Codespaces** - Cloud development environment
- **ESLint + Prettier** - Code quality and formatting
- **Drizzle Kit** - Database migrations
- **tsx** - TypeScript execution
- **Vite** - Frontend tooling

## 📊 Database Schema

The application uses **10 core tables** with comprehensive relationships:

### Core Safety Tables
- `safety_plans` - Main safety assessments with hazard analysis
- `permits` - Work authorization records
- `crane_inspections` - Equipment safety checks
- `draeger_calibrations` - Gas detector maintenance
- `incidents` - Safety event tracking
- `documents` - Safety document library

### Supporting Tables
- `users` - User authentication and profiles
- `user_preferences` - User settings and preferences
- `report_list` - Generated safety reports
- `audit_logs` - Complete action tracking

### Key Relationships
- Safety plans generate reports and audit logs
- Users have preferences and perform actions
- All safety modules support full CRUD operations

## 🚀 Deployment Options

### 1. Docker (Recommended for Production)
```bash
# Production deployment with Docker Compose
cd docker
cp .env.example .env
# Edit .env with your production values
docker-compose -f docker-compose.prod.yml up -d
```
**Cost**: Variable (infrastructure) | **Setup**: 10 minutes
**Benefits**: Full control, scalable, consistent environments

### 2. Railway (Easiest Full-Stack)
```bash
# Connect GitHub repo to Railway
# Auto-detects Node.js + PostgreSQL
# One-click deployment
```
**Cost**: $5-10/month | **Setup**: 5 minutes

### 3. Render (Managed Services)
```bash
# Web Service + PostgreSQL database
# Auto-deployment from GitHub
# Built-in SSL and scaling
```
**Cost**: $14/month | **Setup**: 10 minutes

### 4. Fly.io (Docker Native)
```bash
# Uses existing Docker configuration
# Global deployment with low latency
# Advanced scaling options
```
**Cost**: $5-15/month | **Setup**: 15 minutes

### 5. DigitalOcean App Platform
```bash
# Flexible infrastructure
# Custom domains and SSL
# Advanced networking
```
**Cost**: $12-25/month | **Setup**: 20 minutes

## 🔧 Development Workflow

### Daily Development (Codespaces)
```bash
# Auto-starts with codespace
npm run dev          # Development server
# PostgreSQL running # Database ready
```

### Database Operations
```bash
npm run db:push      # Deploy schema changes
npm run check        # TypeScript validation
```

### Code Quality
```bash
npm run build        # Production build
npm run start        # Production server
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use shadcn/ui components for consistency
- Maintain modular feature-based structure
- Add proper error handling and validation
- Update documentation for new features

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/safetyplan

# Security
SESSION_SECRET=your-super-secure-random-string-here

# Application
NODE_ENV=development
PORT=5000

# Optional: External Services
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

## 🐛 Troubleshooting

### Codespaces Issues
- **Won't start**: Check `.devcontainer/` folder exists
- **App won't load**: Verify port 5000 is forwarded
- **Database error**: Run `npm run db:push`

### Local Development Issues
- **Port conflict**: Change PORT in `.env`
- **Database connection**: Verify DATABASE_URL
- **Dependencies**: Run `rm -rf node_modules && npm install`

### Build Issues
- **TypeScript errors**: Run `npm run check`
- **Build fails**: Clear cache with `npm run build -- --force`

## 📊 Performance & Monitoring

- **Health Check**: `GET /health` endpoint
- **Error Logging**: Winston-based logging system
- **Database Monitoring**: Connection pooling with Drizzle
- **Caching**: React Query for frontend state
- **Build Optimization**: Vite tree-shaking and code splitting

## 🔒 Security Features

- **Input Validation**: Zod schemas throughout
- **SQL Injection Protection**: Parameterized queries
- **Authentication**: Passport.js with session management
- **Authorization**: Role-based access control
- **HTTPS**: SSL/TLS encryption
- **Security Headers**: Helmet.js middleware

## 📈 Roadmap

- [ ] **Mobile App** - React Native companion
- [ ] **Advanced Analytics** - ML-powered insights
- [ ] **Integration APIs** - Third-party system connections
- [ ] **Multi-tenant Support** - Organization management
- [ ] **Offline Mode** - Progressive Web App features
- [ ] **Advanced Reporting** - Custom dashboard builder

## 📞 Support & Documentation

- **📖 Full Documentation**: See `docs/SKILL.md`
- **🐛 Bug Reports**: Open issues on GitHub
- **💡 Feature Requests**: Use GitHub Discussions
- **📧 Contact**: Open a GitHub issue

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Drizzle ORM** - Excellent database toolkit
- **Railway** - Amazing deployment platform
- **GitHub Codespaces** - Revolutionary development environment

---

**Built for industrial safety management with enterprise-grade features and cloud-native architecture.** 🛡️🏭

*Developed with TypeScript, Docker, and modern web technologies for reliable, scalable safety management.*</content>
<parameter name="filePath">c:\Users\carl\Downloads\EHS Safety Tool\README.md