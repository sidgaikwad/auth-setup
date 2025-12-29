import { select, confirm, multiselect } from "@clack/prompts";
import type { DetectedSetup } from "./detector";

export interface AuthConfig {
  methods: Array<"email" | "google" | "github">;
  includeUI: boolean;
  includeMiddleware: boolean;
  addToSchema: boolean;
}

export async function promptAuthSetup(
  detected: DetectedSetup
): Promise<AuthConfig> {
  // Warn if Better Auth already exists
  if (detected.hasBetterAuth) {
    const shouldContinue = (await confirm({
      message:
        "Better Auth is already installed. Continue? (may overwrite files)",
      initialValue: false,
    })) as boolean;

    if (!shouldContinue) {
      throw new Error("Setup cancelled by user");
    }
  }

  // Authentication methods
  const methods = (await multiselect({
    message: "Select authentication methods",
    options: [
      {
        value: "email",
        label: "Email + Password",
        hint: "Traditional username/password",
      },
      { value: "google", label: "Google OAuth", hint: "Sign in with Google" },
      { value: "github", label: "GitHub OAuth", hint: "Sign in with GitHub" },
    ],
    required: true,
  })) as Array<"email" | "google" | "github">;

  // UI Components
  const includeUI = (await confirm({
    message: "Generate UI components? (Sign In, Sign Up, User Button)",
    initialValue: true,
  })) as boolean;

  // Middleware
  const includeMiddleware = (await confirm({
    message: "Generate middleware for route protection?",
    initialValue: true,
  })) as boolean;

  // Add to existing schema?
  let addToSchema = false;
  if (detected.hasORM && detected.schemaPath) {
    addToSchema = (await confirm({
      message: `Add auth tables to your ${detected.orm} schema?`,
      initialValue: true,
    })) as boolean;
  }

  return {
    methods,
    includeUI,
    includeMiddleware,
    addToSchema,
  };
}
