import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import MySQLStoreFactory from "express-mysql-session";
import { authStorage } from "./storage";
import { pool } from "../../db";

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60; // 1 week in seconds
  const isProduction = process.env.NODE_ENV === "production";
  const MySQLStore = MySQLStoreFactory(session as any);
  const basePool = (pool as any).pool ?? pool;
  const sessionStore = new MySQLStore(
    {
      expiration: sessionTtl,
      createDatabaseTable: false,
      schema: {
        tableName: "sessions",
        columnNames: {
          session_id: "sid",
          expires: "expire",
          data: "sess",
        },
      },
    },
    basePool,
  );
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // In local dev we serve over http, so the cookie must be non-secure
      secure: isProduction,
      maxAge: sessionTtl,
      sameSite: isProduction ? "lax" : "lax",
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  // Fast path for local development without external OIDC.
  if (process.env.DEV_AUTH_BYPASS === "true") {
    app.use((req, _res, next) => {
      (req as any).user = (req as any).user ?? {};
      (req as any).user.claims = (req as any).user.claims ?? {
        sub: "dev-user",
        email: "dev@example.com",
      };
      (req as any).isAuthenticated = () => true;
      next();
    });

    // Provide minimal login/logout endpoints to avoid 404s in dev bypass
    app.get("/api/login", (_req, res) => {
      res.redirect("/app");
    });

    app.get("/api/logout", (req, res) => {
      req.logout?.(() => res.redirect("/"));
      if (!req.logout) res.redirect("/");
    });

    return;
  }

  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Keep track of registered strategies
  const registeredStrategies = new Set<string>();

  // Helper function to ensure strategy exists for a domain
  const ensureStrategy = (domain: string) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/app",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    const returnTo = typeof req.query.returnTo === "string" ? req.query.returnTo : "/";

    // In dev bypass we just redirect without hitting OIDC
    if (process.env.DEV_AUTH_BYPASS === "true") {
      req.logout?.(() => res.redirect(returnTo));
      return;
    }

    req.logout(() => {
      const postLogoutUrl = `${req.protocol}://${req.hostname}${returnTo}`;
      const endSessionUrl = client.buildEndSessionUrl(config, {
        client_id: process.env.REPL_ID!,
        post_logout_redirect_uri: postLogoutUrl,
      }).href;
      res.redirect(endSessionUrl);
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (process.env.DEV_AUTH_BYPASS === "true") {
    req.user = req.user ?? {} as any;
    (req.user as any).claims = (req.user as any).claims ?? {
      sub: "dev-user",
      email: "dev@example.com",
    };
    return next();
  }

  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
