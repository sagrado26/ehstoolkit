# M365 OAuth - Activation Checklist

Use this checklist when you're ready to enable M365 OAuth authentication.

## Pre-Activation (Azure Portal)

- [ ] **Create Azure App Registration**
  - [ ] Sign in to [Azure Portal](https://portal.azure.com)
  - [ ] Navigate to Azure Active Directory > App registrations
  - [ ] Click "+ New registration"
  - [ ] Name: "EHS Safety Tool"
  - [ ] Account types: "Accounts in any organizational directory"
  - [ ] Redirect URI: `http://localhost:3000/api/auth/callback`
  - [ ] Click "Register"

- [ ] **Copy Credentials**
  - [ ] Copy Application (client) ID
  - [ ] Copy Directory (tenant) ID
  - [ ] Go to "Certificates & secrets"
  - [ ] Create "New client secret"
  - [ ] Copy secret value (won't be shown again!)

- [ ] **Configure API Permissions**
  - [ ] Go to "API permissions"
  - [ ] Click "+ Add a permission"
  - [ ] Select "Microsoft Graph"
  - [ ] Choose "Delegated permissions"
  - [ ] Add: `User.Read`
  - [ ] Add: `User.ReadBasic.All`
  - [ ] Add: `email`
  - [ ] Add: `profile`
  - [ ] Add: `offline_access`
  - [ ] Grant admin consent

- [ ] **Configure Authentication**
  - [ ] Go to "Authentication"
  - [ ] Add Redirect URIs:
    - [ ] `http://localhost:3000/api/auth/callback` (dev)
    - [ ] `https://yourdomain.com/api/auth/callback` (prod)

## Code Activation

- [ ] **Update Environment Variables**
  - [ ] Copy `.env.m365-template` to `.env` or create new file
  - [ ] Set `M365_CLIENT_ID` = your client ID
  - [ ] Set `M365_CLIENT_SECRET` = your client secret
  - [ ] Set `M365_TENANT_ID` = your tenant ID
  - [ ] Set `M365_REDIRECT_URI` = callback URL
  - [ ] Set `SESSION_SECRET` = random secure string
  - [ ] Verify variables are loaded in server startup

- [ ] **Install Dependencies**
  - [ ] Run: `npm install @azure/msal-node`
  - [ ] Verify install: `npm list @azure/msal-node`

- [ ] **Uncomment Configuration**
  - [ ] Open `server/config/m365-auth.config.ts`
  - [ ] Uncomment import: `import { ConfidentialClientApplication } from "@azure/msal-node"`
  - [ ] Uncomment interface: `M365AuthConfig`
  - [ ] Uncomment object: `m365AuthConfig`
  - [ ] Uncomment object: `msalClient`
  - [ ] Uncomment object: `graphApiConfig`
  - [ ] Uncomment interfaces: `M365UserProfile`, `M365Session`
  - [ ] Keep `BasicUserProfile` for fallback
  - [ ] Run: `npm run check` (should pass)

- [ ] **Uncomment Routes**
  - [ ] Open `server/routes/auth.ts`
  - [ ] Choose option A or B:
    - [ ] **Option A**: Copy code from `M365_OAUTH_IMPLEMENTATION.md` into auth.ts
    - [ ] **Option B**: Create separate `m365-oauth.ts` file and import handlers
  - [ ] Replace placeholder routes with real OAuth routes:
    - [ ] GET /api/auth/login
    - [ ] GET /api/auth/callback
    - [ ] GET /api/auth/user
    - [ ] POST /api/auth/logout
    - [ ] POST /api/auth/refresh
  - [ ] Run: `npm run check` (should pass)

- [ ] **Register Routes in Main Server File**
  - [ ] Open `server/routes.ts`
  - [ ] Uncomment or add: `app.use("/api/auth", authRoutes)`
  - [ ] Verify import statement points to correct file
  - [ ] Run: `npm run check` (should pass)

- [ ] **Update Frontend (Optional)**
  - [ ] Create login page component (if not exists)
  - [ ] Add "Sign in with Microsoft" button
  - [ ] Redirect to `/api/auth/login` on click
  - [ ] Handle OAuth callback from Azure AD
  - [ ] Store user session info
  - [ ] Update user menu/profile display

## Testing

- [ ] **Local Development Test**
  - [ ] Start server: `npm run dev`
  - [ ] Visit: `http://localhost:3000`
  - [ ] Click "Sign in with Microsoft"
  - [ ] Redirect to Azure AD login page
  - [ ] Sign in with your Microsoft account
  - [ ] Redirect back to app with user data
  - [ ] Verify session created
  - [ ] Test `/api/auth/user` endpoint
  - [ ] Test logout functionality
  - [ ] Verify cookie is secure (HttpOnly, Secure)

- [ ] **Session Management**
  - [ ] Test token refresh flow
  - [ ] Verify expired sessions are cleaned up
  - [ ] Test re-login after logout
  - [ ] Check session persistence across page reload

- [ ] **Error Handling**
  - [ ] Test invalid state token
  - [ ] Test missing authorization code
  - [ ] Test expired authorization code
  - [ ] Verify error messages are user-friendly
  - [ ] Check server logs for errors

## Production Deployment

- [ ] **Azure Portal Updates**
  - [ ] Go to App registration "Authentication"
  - [ ] Update Redirect URI to production domain:
    - [ ] `https://yourdomain.com/api/auth/callback`
  - [ ] Consider adding: `https://yourdomain.com/api/auth/callback` (if different domain)
  - [ ] Review security settings

- [ ] **Environment Configuration**
  - [ ] Update `M365_REDIRECT_URI` to production URL
  - [ ] Update `M365_TENANT_ID` if using single-tenant
  - [ ] Set `NODE_ENV=production`
  - [ ] Ensure `SESSION_SECRET` is strong and secure
  - [ ] Use environment variables (not .env files) for secrets

- [ ] **Code Updates for Production**
  - [ ] Update cookie settings: Secure=true (HTTPS only)
  - [ ] Set appropriate SESSION_SECRET length
  - [ ] Configure CORS if frontend on different domain
  - [ ] Set up session store (Redis or database, not in-memory)
  - [ ] Configure logging and error tracking
  - [ ] Set up session cleanup job (remove expired sessions)

- [ ] **Security Hardening**
  - [ ] Enable HTTPS (required for Secure cookies)
  - [ ] Set strong CSRF tokens
  - [ ] Implement rate limiting on auth endpoints
  - [ ] Monitor login failures
  - [ ] Set up alerts for suspicious activity
  - [ ] Regularly rotate client secrets (every 6-12 months)

- [ ] **Deployment**
  - [ ] Build: `npm run build`
  - [ ] Start: `npm start`
  - [ ] Test all auth flows in production
  - [ ] Monitor error logs
  - [ ] Verify users can login
  - [ ] Check performance metrics

- [ ] **Post-Deployment**
  - [ ] Monitor user login success rate
  - [ ] Track authentication errors
  - [ ] Document configuration for support team
  - [ ] Create runbooks for common issues
  - [ ] Set up monitoring alerts

## Rollback Plan

If issues occur:

- [ ] Keep old auth routes commented
- [ ] Can quickly switch back to placeholder routes
- [ ] Maintain database backups
- [ ] Document rollback steps:
  1. Comment out M365 code in auth.ts
  2. Restart server
  3. Users get test user (basic access)
  4. Investigate and fix issues
  5. Re-enable M365 when ready

## Verification Checklist (Before Going Live)

- [ ] `npm run check` - TypeScript compiles without errors
- [ ] `npm run build` - Production build succeeds
- [ ] Login flow works start-to-end
- [ ] User profile data is retrieved correctly
- [ ] Session is created and persists
- [ ] Logout clears session properly
- [ ] Token refresh works
- [ ] Error handling is user-friendly
- [ ] Session timeout is appropriate
- [ ] Cookies are secure (HttpOnly, Secure, SameSite)
- [ ] No sensitive data in logs
- [ ] No hardcoded secrets in code

## Support Resources

- 📚 `M365_OAUTH_SETUP_GUIDE.md` - Detailed setup instructions
- 📚 `M365_OAUTH_FLOW_DIAGRAMS.md` - Visual flow diagrams
- 📚 `M365_OAUTH_IMPLEMENTATION.md` - Full code ready to use
- 🔗 [Azure AD OAuth Docs](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- 🔗 [MSAL Node Docs](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- 🔗 [Microsoft Graph API](https://graph.microsoft.com)

## Questions?

Refer to:
1. `M365_OAUTH_SETUP_GUIDE.md` - Troubleshooting section
2. Azure documentation
3. MSAL Node GitHub repository
4. Microsoft Graph API reference

**Good luck with activation! 🚀**
