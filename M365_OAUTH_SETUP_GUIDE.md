# M365 OAuth Setup Guide

## Overview
This guide explains how to enable Microsoft 365 (Azure AD/Entra ID) OAuth authentication in the EHS Safety Tool. Currently, all M365 OAuth code is commented out and ready to be enabled when needed.

## Current Status
- ✅ M365 OAuth configuration files created
- ✅ All code ready but commented out
- ✅ Environment variable templates provided
- ✅ TypeScript types defined
- ⏳ **Waiting to be activated** when you're ready

## Files Created
1. **`server/config/m365-auth.config.ts`** - M365 configuration and type definitions
2. **`server/routes/auth.ts`** - Authentication route handlers (with placeholders)
3. **`server/config/M365_OAUTH_IMPLEMENTATION.md`** - Full implementation code ready to copy
4. **`.env.m365-template`** - Environment variables template
5. **`M365_OAUTH_SETUP_GUIDE.md`** - This file

## Prerequisites
- Azure subscription (Microsoft 365 tenant)
- Access to Azure Portal: https://portal.azure.com
- npm packages installed (when ready): `@azure/msal-node`, `uuid`

## Step-by-Step Setup (When Ready)

### 1. Azure Portal Configuration

#### Create App Registration
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **+ New registration**
4. Fill in the details:
   - **Name**: EHS Safety Tool
   - **Supported account types**: Choose based on your organization:
     - "Accounts in this organizational directory only" (single-tenant)
     - "Accounts in any organizational directory" (multi-tenant)
5. **Redirect URI**: Select "Web" and enter: `http://localhost:3000/api/auth/callback`
6. Click **Register**

#### Copy Credentials
After registration, you'll see the app overview page:
1. Copy **Application (client) ID** → Set as `M365_CLIENT_ID` in `.env`
2. Copy **Directory (tenant) ID** → Set as `M365_TENANT_ID` in `.env`

#### Create Client Secret
1. Go to **Certificates & secrets** (left sidebar)
2. Click **+ New client secret**
3. Enter description: "EHS Safety Tool Development"
4. Set expiry: "24 months" or as per your policy
5. Click **Add**
6. **Copy the secret value immediately** (you won't see it again)
7. Set as `M365_CLIENT_SECRET` in `.env`

#### Configure API Permissions
1. Go to **API permissions** (left sidebar)
2. Click **+ Add a permission**
3. Select **Microsoft Graph**
4. Choose **Delegated permissions**
5. Search and add:
   - `User.Read` (Read the signed-in user's profile)
   - `User.ReadBasic.All` (Read basic properties of all users)
   - `email` (Access email addresses)
   - `profile` (View users' basic profile data)
   - `offline_access` (Maintain access to data you have granted access to)
6. Click **Grant admin consent** (required for production)

#### Add Redirect URIs for Production
1. Go to **Authentication** (left sidebar)
2. Under **Redirect URIs**, add:
   - `https://yourdomain.com/api/auth/callback` (production)
   - `http://localhost:5000/api/auth/callback` (if using different port)

### 2. Environment Configuration

Copy the template and fill in your values:

```bash
cp .env.m365-template .env.m365
```

Edit `.env` or `.env.m365` with your Azure credentials:

```env
M365_ENABLED=true
M365_CLIENT_ID=your-client-id-here
M365_CLIENT_SECRET=your-client-secret-here
M365_TENANT_ID=your-tenant-id-here
M365_REDIRECT_URI=http://localhost:3000/api/auth/callback
SESSION_SECRET=your-secure-random-secret
```

### 3. Install Dependencies

When ready to enable M365 OAuth:

```bash
npm install @azure/msal-node uuid
```

### 4. Uncomment Code

#### In `server/config/m365-auth.config.ts`
1. Uncomment the import statement at the top
2. Uncomment the configuration objects (m365AuthConfig, msalClient, etc.)
3. Keep type definitions uncommented

#### In `server/routes/auth.ts`
1. Replace the placeholder routes with the actual M365 routes
2. Or import handlers from the implementation file

#### In `server/routes.ts`
Find where routes are registered and uncomment:
```typescript
// app.use("/api/auth", authRoutes);
```

### 5. Update Type Definitions

Update the `BasicUserProfile` interface to match M365 user data if needed.

### 6. Test OAuth Flow

1. Start the dev server: `npm run dev`
2. Visit: `http://localhost:3000/api/auth/login`
3. You should be redirected to Microsoft login
4. After login, you'll be redirected to the callback URL
5. Session will be created and stored

## API Endpoints (When Enabled)

### POST /api/auth/login
Initiates M365 OAuth flow
- **Response**: `{ loginUrl: string }`

### GET /api/auth/callback
OAuth callback handler (Azure redirects here)
- **Query params**: `code`, `state`
- **Response**: User profile + redirect URL

### GET /api/auth/user
Get current authenticated user
- **Headers**: Cookie with `sessionId`
- **Response**: User profile

### POST /api/auth/logout
Logout user and clear session
- **Response**: `{ success: true }`

### POST /api/auth/refresh
Refresh access token
- **Headers**: Cookie with `sessionId`
- **Response**: `{ success: true }`

## Security Features Implemented

1. **CSRF Protection** - State tokens generated and validated
2. **Secure Cookies** - HttpOnly, Secure, SameSite flags
3. **Token Management** - Access token and refresh token handling
4. **Session Expiry** - Automatic cleanup of expired sessions
5. **Error Handling** - Proper error responses and logging

## Troubleshooting

### Invalid Redirect URI
- **Error**: "The provided value for the parameter 'redirect_uri' does not match any of the configured redirect URIs"
- **Solution**: Ensure the redirect URI in code matches exactly with Azure Portal

### Authentication Failed
- **Error**: "Code was empty"
- **Solution**: Check that OAuth flow parameters are correct

### Token Expired
- **Error**: "Session expired"
- **Solution**: Implement token refresh logic or ask user to re-login

### Missing Permissions
- **Error**: "Insufficient privileges"
- **Solution**: Add required permissions in Azure Portal and grant admin consent

## Next Steps

1. Set up Azure app registration when you're ready
2. Fill in environment variables
3. Uncomment M365 code
4. Install required npm packages
5. Test the OAuth flow
6. Deploy to production with production redirect URI

## Support

For more information:
- [Microsoft Azure AD OAuth 2.0](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [MSAL Node Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Microsoft Graph API Reference](https://graph.microsoft.com)
