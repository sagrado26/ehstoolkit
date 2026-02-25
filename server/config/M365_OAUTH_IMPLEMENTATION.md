/**
 * M365 OAuth Implementation Guide
 * 
 * Complete implementation ready to copy into auth.ts when M365 is enabled.
 * This file shows the full code with proper TypeScript and error handling.
 * 
 * INSTRUCTIONS:
 * 1. First, install dependencies: npm install @azure/msal-node uuid
 * 2. Replace the placeholder routes in server/routes/auth.ts with the code from this file
 * 3. Update server/routes.ts to use the new auth routes
 * 4. Add M365 environment variables to .env
 * 5. Test the OAuth flow
 */

// ============================================================================
// IMPORTS (UNCOMMENT WHEN READY)
// ============================================================================

// import { v4 as uuid } from "uuid";
// import axios from "axios";
// import { ConfidentialClientApplication } from "@azure/msal-node";
// import { Request, Response } from "express";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// export interface M365UserProfile {
//   id: string;
//   displayName: string;
//   mail: string;
//   userPrincipalName: string;
//   jobTitle?: string;
//   department?: string;
//   mobilePhone?: string;
//   officeLocation?: string;
//   givenName?: string;
//   surname?: string;
// }

// export interface M365Session {
//   userId: string;
//   accessToken: string;
//   refreshToken?: string;
//   tokenExpiration: number;
//   profile: M365UserProfile;
//   createdAt: Date;
// }

// ============================================================================
// CONFIGURATION
// ============================================================================

// const M365_CONFIG = {
//   clientId: process.env.M365_CLIENT_ID || "",
//   clientSecret: process.env.M365_CLIENT_SECRET || "",
//   tenantId: process.env.M365_TENANT_ID || "common",
//   redirectUri: process.env.M365_REDIRECT_URI || "http://localhost:3000/api/auth/callback",
//   scopes: ["https://graph.microsoft.com/.default", "offline_access"],
// };

// const GRAPH_API = {
//   me: "https://graph.microsoft.com/v1.0/me",
//   photo: "https://graph.microsoft.com/v1.0/me/photo/$value",
// };

// ============================================================================
// MSAL CLIENT INITIALIZATION
// ============================================================================

// const msalClient = new ConfidentialClientApplication({
//   auth: {
//     clientId: M365_CONFIG.clientId,
//     authority: `https://login.microsoftonline.com/${M365_CONFIG.tenantId}`,
//     clientSecret: M365_CONFIG.clientSecret,
//   },
//   system: {
//     loggerOptions: {
//       loggerCallback(loglevel: any, message: any) {
//         console.log(`[MSAL] ${message}`);
//       },
//       piiLoggingEnabled: false,
//       logLevel: "Info" as any,
//     },
//   },
// });

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

// // In production, use Redis or database
// const sessions = new Map<string, M365Session>();
// const stateTokens = new Map<string, number>();
// const STATE_TOKEN_EXPIRY = 10 * 60 * 1000; // 10 minutes

// function createSession(profile: M365UserProfile, accessToken: string, refreshToken?: string): string {
//   const sessionId = uuid();
//   sessions.set(sessionId, {
//     userId: profile.id,
//     accessToken,
//     refreshToken,
//     tokenExpiration: Date.now() + 3600000, // 1 hour
//     profile,
//     createdAt: new Date(),
//   });
//   return sessionId;
// }

// function getSession(sessionId?: string): M365Session | null {
//   if (!sessionId) return null;
//   return sessions.get(sessionId) || null;
// }

// function deleteSession(sessionId?: string): void {
//   if (sessionId) sessions.delete(sessionId);
// }

// function cleanupExpiredTokens(): void {
//   const now = Date.now();
//   for (const [token, timestamp] of stateTokens.entries()) {
//     if (now - timestamp > STATE_TOKEN_EXPIRY) {
//       stateTokens.delete(token);
//     }
//   }
// }

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

// /**
//  * GET /api/auth/login
//  * Initiates M365 OAuth flow
//  */
// export function handleLogin(req: Request, res: Response) {
//   try {
//     const state = uuid();
//     stateTokens.set(state, Date.now());
//     cleanupExpiredTokens();

//     const authUrlParams = new URLSearchParams({
//       client_id: M365_CONFIG.clientId,
//       response_type: "code",
//       redirect_uri: M365_CONFIG.redirectUri,
//       response_mode: "query",
//       scope: M365_CONFIG.scopes.join(" "),
//       state,
//       prompt: "select_account",
//     });

//     const loginUrl = `https://login.microsoftonline.com/${M365_CONFIG.tenantId}/oauth2/v2.0/authorize?${authUrlParams.toString()}`;

//     res.json({ loginUrl, message: "Redirect to this URL to login with Microsoft" });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ error: "Failed to initiate login" });
//   }
// }

// /**
//  * GET /api/auth/callback
//  * OAuth callback from Azure AD
//  */
// export async function handleCallback(req: Request, res: Response) {
//   try {
//     const { code, state, error } = req.query as {
//       code?: string;
//       state?: string;
//       error?: string;
//     };

//     if (error) {
//       return res.status(400).json({ error: `Azure AD error: ${error}` });
//     }

//     if (!code || !state) {
//       return res.status(400).json({ error: "Missing code or state parameter" });
//     }

//     if (!stateTokens.has(state)) {
//       return res.status(400).json({ error: "Invalid or expired state token" });
//     }
//     stateTokens.delete(state);

//     // Exchange authorization code for token
//     const tokenResponse = await msalClient.acquireTokenByCode({
//       code,
//       scopes: M365_CONFIG.scopes,
//       redirectUri: M365_CONFIG.redirectUri,
//     });

//     if (!tokenResponse?.accessToken) {
//       return res.status(500).json({ error: "Failed to acquire access token" });
//     }

//     // Fetch user profile
//     const profileResponse = await axios.get<M365UserProfile>(GRAPH_API.me, {
//       headers: {
//         Authorization: `Bearer ${tokenResponse.accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const userProfile = profileResponse.data;

//     // Create session
//     const sessionId = createSession(
//       userProfile,
//       tokenResponse.accessToken,
//       tokenResponse.refreshToken
//     );

//     // Set secure session cookie
//     res.cookie("sessionId", sessionId, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     });

//     // Return user data and redirect info
//     res.json({
//       success: true,
//       user: userProfile,
//       redirectUrl: "/dashboard",
//     });
//   } catch (error) {
//     console.error("OAuth callback error:", error);
//     res.status(500).json({ error: "Authentication failed" });
//   }
// }

// /**
//  * GET /api/auth/user
//  * Get current authenticated user
//  */
// export function handleGetUser(req: Request, res: Response) {
//   try {
//     const sessionId = req.cookies.sessionId;
//     const session = getSession(sessionId);

//     if (!session) {
//       return res.status(401).json({ error: "Not authenticated" });
//     }

//     // Check token expiration
//     if (session.tokenExpiration < Date.now()) {
//       deleteSession(sessionId);
//       return res.status(401).json({ error: "Session expired" });
//     }

//     res.json(session.profile);
//   } catch (error) {
//     console.error("Get user error:", error);
//     res.status(500).json({ error: "Failed to get user profile" });
//   }
// }

// /**
//  * POST /api/auth/logout
//  * Logout user and destroy session
//  */
// export function handleLogout(req: Request, res: Response) {
//   try {
//     const sessionId = req.cookies.sessionId;
//     deleteSession(sessionId);
//     res.clearCookie("sessionId");
//     res.json({ success: true, message: "Logged out successfully" });
//   } catch (error) {
//     console.error("Logout error:", error);
//     res.status(500).json({ error: "Failed to logout" });
//   }
// }

// /**
//  * POST /api/auth/refresh
//  * Refresh access token using refresh token
//  */
// export async function handleRefreshToken(req: Request, res: Response) {
//   try {
//     const sessionId = req.cookies.sessionId;
//     const session = getSession(sessionId);

//     if (!session?.refreshToken) {
//       return res.status(401).json({ error: "No refresh token available" });
//     }

//     const tokenResponse = await msalClient.acquireTokenByRefreshToken({
//       refreshToken: session.refreshToken,
//       scopes: M365_CONFIG.scopes,
//     });

//     if (!tokenResponse?.accessToken) {
//       return res.status(500).json({ error: "Failed to refresh token" });
//     }

//     // Update session
//     session.accessToken = tokenResponse.accessToken;
//     session.tokenExpiration = Date.now() + 3600000;
//     if (tokenResponse.refreshToken) {
//       session.refreshToken = tokenResponse.refreshToken;
//     }

//     res.json({ success: true, message: "Token refreshed" });
//   } catch (error) {
//     console.error("Token refresh error:", error);
//     res.status(500).json({ error: "Failed to refresh token" });
//   }
// }

// ============================================================================
// MIDDLEWARE: Verify Session
// ============================================================================

// /**
//  * Middleware to verify user is authenticated
//  * Use this on protected routes
//  */
// export function verifySession(req: Request, res: Response, next: any) {
//   try {
//     const sessionId = req.cookies.sessionId;
//     const session = getSession(sessionId);

//     if (!session) {
//       return res.status(401).json({ error: "Not authenticated" });
//     }

//     // Check if token is expired
//     if (session.tokenExpiration < Date.now()) {
//       deleteSession(sessionId);
//       return res.status(401).json({ error: "Session expired" });
//     }

//     // Attach user to request for downstream handlers
//     (req as any).user = session.profile;
//     (req as any).session = session;

//     next();
//   } catch (error) {
//     console.error("Session verification error:", error);
//     res.status(500).json({ error: "Session verification failed" });
//   }
// }

// ============================================================================
// USAGE IN auth.ts
// ============================================================================

// /**
//  * To use these handlers in auth.ts, replace the placeholder routes with:
//  *
//  * import { 
//  *   handleLogin,
//  *   handleCallback,
//  *   handleGetUser,
//  *   handleLogout,
//  *   handleRefreshToken,
//  *   verifySession
//  * } from "./m365-oauth.implementation";
//  *
//  * const router = express.Router();
//  *
//  * router.get("/login", handleLogin);
//  * router.get("/callback", handleCallback);
//  * router.get("/user", handleGetUser);
//  * router.post("/logout", handleLogout);
//  * router.post("/refresh", handleRefreshToken);
//  *
//  * export default router;
//  */

export {};
