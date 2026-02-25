/**
 * M365 OAuth Authentication Routes
 * 
 * This file contains the routes for Microsoft 365 OAuth authentication.
 * Ready to uncomment when M365 authentication is enabled.
 * 
 * IMPORTANT: To enable M365 OAuth:
 * 1. Uncomment the m365AuthRoutes function below
 * 2. In routes.ts, uncomment the line: app.use("/api/auth", m365AuthRoutes);
 * 3. Run: npm install @azure/msal-node uuid axios
 * 4. Set M365 environment variables in .env file
 * 5. Verify imports and TypeScript compilation
 * 
 * Routes when enabled:
 * - GET /api/auth/login - Initiate M365 login
 * - GET /api/auth/callback - OAuth callback from Azure AD
 * - POST /api/auth/logout - Logout user
 * - GET /api/auth/user - Get current user profile
 * - POST /api/auth/refresh - Refresh access token
 */

import express, { Request, Response } from "express";

const router = express.Router();

// ============================================================================
// UNCOMMENT FUNCTION BELOW TO ENABLE M365 OAUTH
// ============================================================================

// To enable M365 OAuth, uncomment the entire function below and comment out the placeholder routes

// function m365AuthRoutes() {
//   // Uncomment and use this implementation when ready
//   // See M365_OAUTH_IMPLEMENTATION.ts for full commented code
//   return router;
// }

// ============================================================================
// PLACEHOLDER: BASIC ROUTES (ACTIVE UNTIL M365 IS ENABLED)
// ============================================================================

/**
 * Placeholder routes for testing without M365 OAuth
 * These will be replaced with the M365 routes when OAuth is enabled
 */

router.get("/user", (req: Request, res: Response) => {
    // Placeholder: Return a test user
    res.json({
        id: "test-user-1",
        email: "test@example.com",
        name: "Test User",
        role: "ehs",
    });
});

router.post("/logout", (req: Request, res: Response) => {
    // Placeholder: Logout
    res.json({ success: true, message: "Logged out successfully" });
});

// ============================================================================
// PLACEHOLDER: BASIC ROUTES (UNTIL M365 IS ENABLED)
// ============================================================================

/**
 * Placeholder routes for testing without M365 OAuth
 * These will be replaced with the M365 routes above when OAuth is enabled
 */

router.get("/user", (req: Request, res: Response) => {
    // Placeholder: Return a test user
    res.json({
        id: "test-user-1",
        email: "test@example.com",
        name: "Test User",
        role: "ehs",
    });
});


export default router;
