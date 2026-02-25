/**
 * M365 OAuth Configuration
 * 
 * This file contains the configuration for Microsoft 365 (Azure AD/Entra ID) OAuth integration.
 * Currently commented out - uncomment when ready to enable M365 authentication.
 * 
 * Setup Steps:
 * 1. Register an app in Azure Portal (https://portal.azure.com)
 * 2. Create a new app registration for your EHS Safety Tool
 * 3. Add Redirect URIs: http://localhost:3000/api/auth/callback (dev), https://yourdomain.com/api/auth/callback (prod)
 * 4. Create a client secret and copy the client ID
 * 5. Set environment variables: M365_CLIENT_ID, M365_CLIENT_SECRET, M365_TENANT_ID
 * 6. Uncomment the code below
 */

// ============================================================================
// M365 OAUTH CONFIGURATION (READY TO ENABLE - UNCOMMENT WHEN READY)
// ============================================================================

// NOTE: To enable M365 OAuth, uncomment the following section:
// 1. Uncomment the import statement below
// 2. Uncomment the configuration objects and functions
// 3. Install @azure/msal-node: npm install @azure/msal-node
// 4. Set environment variables in .env file
// 5. Update auth routes in server/routes/auth.ts

// STEP 1: Uncomment this import when ready
// import { ConfidentialClientApplication } from "@azure/msal-node";

// ============================================================================
// M365 CONFIGURATION - READY TO UNCOMMENT
// ============================================================================

// STEP 2: Uncomment the following configuration when ready to enable M365 OAuth

// Environment variables required:
// M365_CLIENT_ID - Azure App Registration Client ID
// M365_CLIENT_SECRET - Azure App Registration Client Secret
// M365_TENANT_ID - Azure Tenant ID (or "common" for multi-tenant)
// M365_REDIRECT_URI - OAuth callback URL (e.g., http://localhost:3000/api/auth/callback)

/*
export interface M365AuthConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  redirectUri: string;
  scopes: string[];
}

export const m365AuthConfig: M365AuthConfig = {
  clientId: process.env.M365_CLIENT_ID || "",
  clientSecret: process.env.M365_CLIENT_SECRET || "",
  tenantId: process.env.M365_TENANT_ID || "common",
  redirectUri: process.env.M365_REDIRECT_URI || "http://localhost:3000/api/auth/callback",
  scopes: [
    "https://graph.microsoft.com/.default", // For Microsoft Graph API
    "offline_access", // For refresh tokens
  ],
};

// Initialize MSAL Confidential Client for server-side OAuth flow
export const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: m365AuthConfig.clientId,
    authority: `https://login.microsoftonline.com/${m365AuthConfig.tenantId}`,
    clientSecret: m365AuthConfig.clientSecret,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel: any, message: any, containsPii: any) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: "Info" as any,
    },
  },
});

// Microsoft Graph API configuration for fetching user profile
export const graphApiConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphPhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value",
  graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages",
};

// User profile interface matching M365 user data
export interface M365UserProfile {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
  mobilePhone?: string;
  officeLocation?: string;
  givenName?: string;
  surname?: string;
  photo?: string; // Base64 encoded photo
}

// Session/Token storage interface
export interface M365Session {
  userId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiration: number;
  profile: M365UserProfile;
  createdAt: Date;
}
*/

// ============================================================================
// PLACEHOLDER: BASIC USER INTERFACE (TEMPORARY - UNTIL M365 IS ENABLED)
// ============================================================================

export interface BasicUserProfile {
    id: string;
    email: string;
    name: string;
    role: "admin" | "ehs" | "manager" | "supervisor" | "attendant";
}
