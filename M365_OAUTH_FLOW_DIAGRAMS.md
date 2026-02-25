# M365 OAuth Flow Diagram

## OAuth 2.0 Authorization Code Flow (When Enabled)

```
┌─────────────────┐                      ┌──────────────────┐
│   EHS Safety    │                      │  Azure AD / M365 │
│   Tool (Client) │                      │  (Authorization) │
└────────┬────────┘                      └──────────┬───────┘
         │                                          │
         │ 1. User clicks "Login"                  │
         │────────────────────────────────────────>│
         │                                          │
         │                                    (User authenticates)
         │                                          │
         │ 2. Authorization code returned          │
         │<────────────────────────────────────────│
         │                                          │
         │                                    ┌─────────────────┐
         │                                    │ EHS Backend     │
         │                                    │ (Server)        │
         │                                    └────────┬────────┘
         │                                           │
         │ 3. Backend exchanges code for token      │
         │────────────────────────────────────────>│
         │                                           │
         │ 4. Access token + Refresh token         │
         │<────────────────────────────────────────│
         │                                           │
         │ 5. Fetch user profile (Microsoft Graph)  │
         │────────────────────────────────────────>│
         │                                           │
         │ 6. User profile data                     │
         │<────────────────────────────────────────│
         │                                           │
         │ 7. Create session & set secure cookie    │
         │────────────────────────────────────────>│
         │                                           │
         │ 8. Redirect to dashboard                 │
         │<────────────────────────────────────────│
         │                                           │
    (Logged in)                                    (Session created)

```

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    EHS Safety Tool                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Frontend (React)                                                │
│  ┌────────────────────────────────┐                             │
│  │ Login Page                     │                             │
│  │ - "Sign in with Microsoft"     │                             │
│  │ - Redirects to /api/auth/login │                             │
│  └────────────────────────────────┘                             │
│                                                                  │
│  Backend (Express)                                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Authentication Routes                                      │ │
│  │                                                            │ │
│  │ GET  /api/auth/login      → Initiate OAuth flow          │ │
│  │ GET  /api/auth/callback   → Handle OAuth callback        │ │
│  │ GET  /api/auth/user       → Get current user (protected) │ │
│  │ POST /api/auth/logout     → Clear session                │ │
│  │ POST /api/auth/refresh    → Refresh access token         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Configuration & Security                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ M365 Config (m365-auth.config.ts)                         │ │
│  │ - MSAL Client                                             │ │
│  │ - OAuth scopes                                            │ │
│  │ - Graph API endpoints                                     │ │
│  │                                                            │ │
│  │ Session Manager                                           │ │
│  │ - Session storage (Map, Redis, or DB)                    │ │
│  │ - State tokens for CSRF protection                       │ │
│  │ - Token refresh logic                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
         │
         │ OAuth 2.0
         │
         ↓
┌──────────────────────────────────────────────────────────────────┐
│              Microsoft 365 / Azure AD                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Azure AD Login                                                  │
│  ┌────────────────────────────────┐                             │
│  │ User authentication            │                             │
│  │ Multi-factor authentication    │                             │
│  │ Conditional access             │                             │
│  └────────────────────────────────┘                             │
│                                                                  │
│  Microsoft Graph API                                             │
│  ┌────────────────────────────────┐                             │
│  │ /me - User profile data        │                             │
│  │ /me/mailFolders - Email        │                             │
│  │ /me/photo - Profile picture    │                             │
│  │ /me/memberOf - Groups          │                             │
│  └────────────────────────────────┘                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

```

## Current Authentication Flow (Until M365 Enabled)

```
User visits http://localhost:3000
        │
        ↓
Frontend renders login page with "Sign in with Microsoft" button
        │
        ↓
User clicks button (or manually visits /api/auth/user)
        │
        ↓
Backend returns test user:
{
  "id": "test-user-1",
  "email": "test@example.com",
  "name": "Test User",
  "role": "ehs"
}
        │
        ↓
User can access application with basic role-based features
```

## After M365 Enabled

```
User visits http://localhost:3000
        │
        ↓
Frontend renders login page
        │
        ↓
User clicks "Sign in with Microsoft"
        │
        ↓
Redirected to: https://login.microsoftonline.com/...
        │
        ↓
User authenticates with Microsoft credentials
        │
        ↓
Azure AD redirects to: /api/auth/callback?code=xxx&state=yyy
        │
        ↓
Backend exchanges code for access token + refresh token
        │
        ↓
Backend fetches user profile from Microsoft Graph
        │
        ↓
Backend creates session and sets secure cookie
        │
        ↓
User redirected to /dashboard with full access
```

## Security Layers

```
Request Flow:
┌──────────────────┐
│ Browser Request  │
└────────┬─────────┘
         │
         ↓ (Includes sessionId cookie)
┌──────────────────────────────────────┐
│ Route Handler                        │
│ - Check for sessionId cookie         │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│ Verify Session                       │
│ - Session exists?                    │
│ - Token not expired?                 │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│ Access Token Validation              │
│ - Check token expiration             │
│ - Refresh if needed                  │
└────────┬─────────────────────────────┘
         │
         ↓ (If valid)
┌──────────────────────────────────────┐
│ Protected Resource Access            │
│ - Execute handler                    │
│ - Return user data                   │
└──────────────────────────────────────┘

         ↓ (If invalid)
┌──────────────────────────────────────┐
│ Return 401 Unauthorized              │
│ - Redirect to login                  │
└──────────────────────────────────────┘
```

## Data Stored in Session

```
Session {
  userId: "user-uuid-from-azure-ad",
  
  accessToken: "eyJhbGci...",
  refreshToken: "0.AUkA...",
  tokenExpiration: 1708718400000,
  
  profile: {
    id: "user-uuid",
    displayName: "John Doe",
    mail: "john@company.com",
    userPrincipalName: "john@company.onmicrosoft.com",
    jobTitle: "Safety Manager",
    department: "Health & Safety",
    mobilePhone: "+1-555-0123",
    officeLocation: "Building A, Floor 2",
    givenName: "John",
    surname: "Doe"
  },
  
  createdAt: 2024-02-24T10:30:00Z
}
```

## Cookie Security

```
Set-Cookie: sessionId=uuid-value
           ; HttpOnly    ← Can't be accessed by JavaScript (XSS protection)
           ; Secure      ← Only sent over HTTPS (when NODE_ENV=production)
           ; SameSite=Strict ← Only sent with same-origin requests (CSRF protection)
           ; Max-Age=86400  ← 24 hour expiration
```

## Environment Variables

```
BEFORE ENABLING:
├─ DATABASE_URL (required)
└─ NODE_ENV (required)

AFTER ENABLING:
├─ DATABASE_URL (required)
├─ NODE_ENV (required)
├─ M365_CLIENT_ID (required)
├─ M365_CLIENT_SECRET (required)
├─ M365_TENANT_ID (required)
├─ M365_REDIRECT_URI (required)
└─ SESSION_SECRET (recommended)
```

## Files Involved

```
Request path: GET /api/auth/callback?code=xxx&state=yyy

Flow:
1. Browser → Frontend (client/src/pages/LoginCallback.tsx or similar)
2. Frontend → Backend (/api/auth/callback)
3. server/routes/auth.ts - Route handler
4. server/config/m365-auth.config.ts - Configuration
5. MSAL Client → Azure AD
6. Microsoft Graph API → User Profile
7. Session Manager → Store session
8. Response → Browser
```
