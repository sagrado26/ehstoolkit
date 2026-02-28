# EHS Safety Tool

A comprehensive Environmental, Health, and Safety (EHS) management platform built for semiconductor manufacturing environments, featuring 7 core safety modules and an ASML-branded design system.

## Features

### Core Safety Modules
- **Safety Plans (ISP)** — Pre-task hazard assessments with 4-step wizard, risk matrix, and approval workflows
- **Safety Review Board** — Escalation workflow for high-risk hazards (risk score >= 8)
- **Permit to Work** — Work authorization for confined space, hot work, electrical, and height operations
- **Crane Inspections** — Equipment safety verification with buddy-inspector system
- **Draeger Calibrations** — Gas detection device maintenance and calibration tracking
- **Incident Management** — Safety incident reporting, investigation, and resolution
- **Documentation** — Centralized safety document library with SharePoint links

### Technical Highlights
- Full-stack TypeScript (React + Express)
- 14 PostgreSQL tables with Drizzle ORM (JSONB for flexible nested data)
- ASML brand design system (Plus Jakarta Sans, IBM Plex Sans, JetBrains Mono)
- A4 print-to-PDF for ISP documents
- Responsive layout with mobile card views
- Docker + GitHub Codespaces ready
- CI/CD via GitHub Actions (type check, lint, Docker build)

## Setup on Laptop

### Prerequisites

| Tool | Version | Check | Install |
|------|---------|-------|---------|
| **Node.js** | 20 or later | `node -v` | [nodejs.org](https://nodejs.org/) |
| **npm** | 9 or later | `npm -v` | Comes with Node.js |
| **Git** | Any | `git --version` | [git-scm.com](https://git-scm.com/) |

> **Database is optional.** The app runs fully in-memory by default with sample data — no PostgreSQL install needed for development. Data resets on server restart.

### Step 1: Clone and install

```bash
git clone https://github.com/sagrado26/ehstoolkit.git
cd ehstoolkit
npm install
```

### Step 2: Start the dev server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. That's it — the app is running with in-memory storage and sample data.

### Step 3: Log in

Enter any username and password (e.g. `carl.murphy` / `password`). Authentication is a client-side mock — all credentials are accepted. This will be replaced with M365 OAuth when connected to Azure AD.

### (Optional) Connect PostgreSQL for persistent data

If you want data to persist across restarts, connect a PostgreSQL database:

```bash
# Option A: Docker (recommended if Docker Desktop is installed)
docker compose -f docker/docker-compose.dev.yml up -d
export DATABASE_URL="postgresql://postgres:password@localhost:5432/ehs_safety_dev"
export USE_DATABASE=true
npm run db:push    # creates tables
npm run dev

# Option B: Local PostgreSQL
export DATABASE_URL="postgresql://user:pass@localhost:5432/ehs_safety"
export USE_DATABASE=true
npm run db:push
npm run dev

# Option C: Neon cloud database (neon.tech)
export DATABASE_URL="your_neon_connection_string"
export USE_DATABASE=true
npm run db:push
npm run dev
```

### Alternative: GitHub Codespaces (zero install)

1. Go to the repository on GitHub
2. Click **"Code"** > **"Codespaces"** > **"Create codespace on main"**
3. Wait 2-3 minutes — everything installs automatically
4. The app opens on the forwarded port with PostgreSQL already connected

### Alternative: Docker Production

```bash
cd docker
cp .env.example .env
# Edit .env with your database password
docker compose -f docker-compose.prod.yml up -d
```

### Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm install` fails | Delete `node_modules` and retry: `rm -rf node_modules && npm install` |
| Port 3000 in use | Set a different port: `PORT=3001 npm run dev` |
| TypeScript errors | Run `npm run check` to see all type issues |
| Database won't connect | Check `DATABASE_URL` is correct and PostgreSQL is running |
| Blank page after login | Clear localStorage: open DevTools > Application > Local Storage > Clear |

## Project Structure

```
ehs-safety-tool/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (shadcn/ui)
│   │   ├── features/       # Feature modules (7 safety tools)
│   │   ├── pages/          # Page components (11 routes)
│   │   ├── hooks/          # Custom React hooks (auth, theme, sidebar)
│   │   └── lib/            # Utilities and configurations
├── server/                 # Express.js backend
│   ├── routes/             # API route handlers (8 modules)
│   ├── storage.ts          # Data access layer
│   ├── db.ts               # Database connection
│   └── index.ts            # Server entry point
├── shared/                 # Shared schemas and types
│   └── schema.ts           # Database schema (14 tables)
├── .devcontainer/          # VS Code dev container config
├── docker/                 # Docker production configs
├── docs/                   # Development documentation
├── screenshots/            # Application screenshots
└── package.json            # Dependencies and scripts
```

## Technology Stack

### Frontend
- **React 18** + **TypeScript** — UI framework
- **Vite** — Build tool and dev server
- **Tailwind CSS 3.4** + **shadcn/ui** — Styling and component library
- **TanStack Query v5** — Server state and caching
- **React Hook Form** + **Zod** — Form management and validation
- **Recharts** — Data visualization (bar, line, donut charts)
- **Framer Motion** — Page transitions and animations
- **Wouter** — Lightweight client-side routing
- **Lucide React** — Icon library

### Backend
- **Node.js 20** + **Express.js 4** — REST API server
- **Drizzle ORM** — Type-safe database queries
- **PostgreSQL 16** — Relational database with JSONB support
- **Passport.js** — Authentication middleware (M365 OAuth ready)
- **WebSocket (ws)** — Real-time features

### DevOps
- **Docker** — Multi-stage production builds (Node 22-alpine)
- **GitHub Actions** — CI pipeline (type check, ESLint, Docker build)
- **GitHub Codespaces** — Cloud development environment

## Database Schema

The application uses **14 tables**:

### Safety Tables
- `safety_plans` — ISP records with JSONB hazards/assessments (30+ fields)
- `permits` — Permit-to-work records (4 permit types)
- `permit_gas_measurements` — O2/CO2/CO/H2S/LEL readings
- `permit_approvals` — Multi-role approval chain
- `permit_sign_offs` — Digital signatures
- `srb_records` — Safety Review Board escalations
- `crane_inspections` — Crane safety checks
- `draeger_calibrations` — Gas detector calibration records
- `incidents` — Safety event tracking
- `documents` — Document library with SharePoint links

### Supporting Tables
- `users` — Authentication (username/password)
- `user_preferences` — User settings (system, group, site, role)
- `report_list` — Versioned JSON reports
- `audit_logs` — Action history with field-level change tracking

## API Endpoints

| Method | Endpoint | Module |
|--------|----------|--------|
| GET | `/api/health` | Health check |
| GET/POST | `/api/safety-plans` | Safety Plans |
| PUT | `/api/safety-plans/:id` | Update plan |
| GET/POST | `/api/permits` | Permits |
| GET/POST | `/api/crane-inspections` | Crane Inspections |
| GET/POST | `/api/draeger-calibrations` | Draeger Calibrations |
| GET/POST | `/api/incidents` | Incidents |
| GET/POST | `/api/documents` | Documents |
| GET/POST | `/api/srb-records` | Safety Review Board |
| GET | `/api/audit-logs` | Audit logs |
| GET/PUT | `/api/user-preferences/:userId` | User preferences |

## Design System

### ASML Brand Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `brand` | `#0F238C` | Primary — headers, buttons, sidebar |
| `brand-dark` | `#0A1A6B` | Sidebar gradient |
| `brand-light` | `#1E3AAF` | Hover/active states |
| `brand-signal` | `#E8590C` | Alerts, high-impact CTAs |
| `brand-teal` | `#288498` | Safety badges, ISP section headers |

### Typography
| Font | Class | Usage |
|------|-------|-------|
| Plus Jakarta Sans | `font-display` | Headings, labels |
| IBM Plex Sans | `font-sans` | Body text (default) |
| JetBrains Mono | `font-mono` | Data, numbers, codes |

## Scripts

```bash
npm run dev        # Start development server (port 3000)
npm run build      # Production build (Vite + esbuild)
npm run start      # Run production server
npm run check      # TypeScript type checking
npm run db:push    # Deploy database schema changes
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/safetyplan

# Security
SESSION_SECRET=your-secure-random-string

# Application
NODE_ENV=development
PORT=3000
```

## Screenshots

See the [screenshots/](screenshots/) directory for captured views of every page, including:
- Dashboard (desktop and mobile)
- Safety Plan list and ISP document view
- 4-step wizard form
- Permit to Work, Incidents, Crane Inspection, Draeger Calibration
- Documentation library
- Mobile responsive layouts

## Roadmap

### Near-term (In Progress)
- [ ] **M365 OAuth Authentication** — Azure AD single sign-on (implementation prepped in `server/config/`, ready to enable)
- [ ] **SharePoint Integration** — Connect document library to live SharePoint site for real-time document sync
- [ ] **Email Notifications** — SMTP-based alerts for permit approvals, SRB escalations, and overdue actions
- [ ] **Unit & E2E Testing** — Vitest for unit tests, Playwright for end-to-end browser testing

### Mid-term
- [ ] **Real-time Notifications** — WebSocket push for live approval status updates and SRB alerts
- [ ] **Advanced Reporting** — Custom dashboard builder with exportable PDF/Excel reports
- [ ] **Audit Dashboard** — Dedicated admin view for compliance audit trail and change history
- [ ] **Role-based Access Control** — Granular permissions per module (viewer, editor, approver, admin)
- [ ] **PostgreSQL Full Deployment** — Migrate from in-memory fallback to persistent PostgreSQL in production

### Long-term
- [ ] **Mobile Companion App** — React Native app for on-site inspections and offline form submission
- [ ] **Offline Mode (PWA)** — Progressive Web App with service worker for areas with poor connectivity
- [ ] **Multi-tenant Support** — Organization-level data isolation for multi-site deployments
- [ ] **Analytics & ML** — Trend prediction for incident rates, risk scoring recommendations
- [ ] **Third-party Integrations** — SAP, ServiceNow, and BMS system connectors

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push and open a Pull Request

### Guidelines
- Follow TypeScript strict mode
- Use shadcn/ui components for consistency
- Maintain modular feature-based structure
- Add Zod validation on API endpoints

## License

This project is licensed under the MIT License.
