// ============================================
// src/generators/better-auth/index.ts
// ============================================

import { writeFile, appendFile } from "node:fs/promises";
import type { AuthConfig } from "../../prompts";
import type { DetectedSetup } from "../../detector";

export async function generateBetterAuth(
  config: AuthConfig,
  detected: DetectedSetup
): Promise<void> {
  // Generate auth config
  await generateAuthConfig(config, detected);

  // Generate API route
  await generateAPIRoute(detected.framework);

  // Add auth tables to schema if needed
  if (config.addToSchema && detected.schemaPath) {
    await addAuthTables(detected);
  }

  // Generate UI components
  if (config.includeUI) {
    await generateUIComponents(detected);
  }

  // Generate middleware
  if (config.includeMiddleware) {
    await generateMiddleware(detected);
  }
}

async function generateAuthConfig(
  config: AuthConfig,
  detected: DetectedSetup
): Promise<void> {
  const basePath = detected.srcDir || ".";

  let authConfig = `import { betterAuth } from "better-auth"\n`;

  if (detected.hasORM && detected.orm === "drizzle") {
    authConfig += `import { drizzleAdapter } from "better-auth/adapters/drizzle"\n`;
    authConfig += `import { db } from "@/lib/db"\n\n`;
  }

  authConfig += `export const auth = betterAuth({\n`;

  // Database adapter
  if (detected.hasORM && detected.orm === "drizzle") {
    authConfig += `  database: drizzleAdapter(db, {\n`;
    authConfig += `    provider: "${
      detected.database === "postgresql" ? "pg" : detected.database
    }",\n`;
    authConfig += `  }),\n\n`;
  }

  // Email and password
  if (config.methods.includes("email")) {
    authConfig += `  emailAndPassword: {\n`;
    authConfig += `    enabled: true,\n`;
    if (config.features.includes("email-verification")) {
      authConfig += `    requireEmailVerification: true,\n`;
    }
    if (config.features.includes("password-reset")) {
      authConfig += `    sendResetPassword: async ({ user, url }) => {\n`;
      authConfig += `      // TODO: Send email with reset link\n`;
      authConfig += `      console.log('Reset password for', user.email, 'at', url)\n`;
      authConfig += `    },\n`;
    }
    authConfig += `  },\n\n`;
  }

  // Social providers
  if (config.methods.includes("google") || config.methods.includes("github")) {
    authConfig += `  socialProviders: {\n`;

    if (config.methods.includes("google")) {
      authConfig += `    google: {\n`;
      authConfig += `      clientId: process.env.GOOGLE_CLIENT_ID!,\n`;
      authConfig += `      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,\n`;
      authConfig += `    },\n`;
    }

    if (config.methods.includes("github")) {
      authConfig += `    github: {\n`;
      authConfig += `      clientId: process.env.GITHUB_CLIENT_ID!,\n`;
      authConfig += `      clientSecret: process.env.GITHUB_CLIENT_SECRET!,\n`;
      authConfig += `    },\n`;
    }

    authConfig += `  },\n\n`;
  }

  authConfig += `})\n\n`;
  authConfig += `export type Session = typeof auth.$Infer.Session\n`;
  authConfig += `export type User = typeof auth.$Infer.User\n`;

  await writeFile(`${basePath}/lib/auth.ts`, authConfig);
}

async function generateAPIRoute(framework: string): Promise<void> {
  // Different route structures for different frameworks
  if (framework === "nextjs") {
    const route = `import { auth } from "@/lib/auth"

export const { GET, POST } = auth.handler
`;
    await writeFile("app/api/auth/[...all]/route.ts", route);
  }
  // Add other frameworks as needed
}

async function addAuthTables(detected: DetectedSetup): Promise<void> {
  if (!detected.schemaPath) return;

  const authTables = `
// Auth tables added by @sidgaikwad/auth-setup
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
})

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
})
`;

  await appendFile(detected.schemaPath, authTables);
}

async function generateUIComponents(detected: DetectedSetup): Promise<void> {
  // Generate sign-in, sign-up components
  // This would be framework-specific
}

async function generateMiddleware(detected: DetectedSetup): Promise<void> {
  const middleware = `import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
}
`;

  await writeFile("middleware.ts", middleware);
}
