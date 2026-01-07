import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  if (process.env.DEV_AUTH_BYPASS === "true") {
    app.get("/api/auth/user", async (_req: any, res) => {
      res.json({
        id: "dev-user",
        email: "dev@example.com",
        firstName: "Dev",
        lastName: "User",
        profileImageUrl: null,
      });
    });
    return;
  }

  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
