// ============================================
// src/prompts.ts - Better Auth prompts
// ============================================

import { select, confirm, multiselect } from "@clack/prompts";
import type { DetectedSetup } from "./detector";

export interface AuthConfig {
  provider: "better-auth";
  methods: Array<"email" | "google" | "github" | "magic-link">;
  features: Array<"email-verification" | "password-reset" | "2fa" | "profile">;
  includeUI: boolean;
  includeMiddleware: boolean;
  addToSchema: boolean;
}

export async function promptAuthSetup(
  detected: DetectedSetup
): Promise<AuthConfig> {
  // For MVP, only Better Auth
  const provider = "better-auth";

  // Authentication methods
  const methods = (await multiselect({
    message: "Select authentication methods",
    options: [
      { value: "email", label: "Email + Password", hint: "Traditional auth" },
      { value: "google", label: "Google OAuth", hint: "Sign in with Google" },
      { value: "github", label: "GitHub OAuth", hint: "Sign in with GitHub" },
      {
        value: "magic-link",
        label: "Magic Link",
        hint: "Passwordless email link",
      },
    ],
    required: true,
  })) as Array<"email" | "google" | "github" | "magic-link">;

  // Features
  const features = (await multiselect({
    message: "Select additional features",
    options: [
      {
        value: "email-verification",
        label: "Email Verification",
        hint: "Verify email addresses",
      },
      {
        value: "password-reset",
        label: "Password Reset",
        hint: "Forgot password flow",
      },
      { value: "2fa", label: "Two-Factor Auth (2FA)", hint: "Extra security" },
      { value: "profile", label: "User Profile", hint: "Profile management" },
    ],
    required: false,
  })) as Array<"email-verification" | "password-reset" | "2fa" | "profile">;

  // UI Components
  const includeUI = (await confirm({
    message: "Generate UI components (Sign In, Sign Up)?",
    initialValue: true,
  })) as boolean;

  // Middleware
  const includeMiddleware = (await confirm({
    message: "Generate middleware for route protection?",
    initialValue: true,
  })) as boolean;

  // Add to existing schema?
  let addToSchema = false;
  if (detected.hasORM) {
    addToSchema = (await confirm({
      message: `Add auth tables to your ${detected.orm} schema?`,
      initialValue: true,
    })) as boolean;
  }

  return {
    provider,
    methods,
    features,
    includeUI,
    includeMiddleware,
    addToSchema,
  };
}
