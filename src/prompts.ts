import { select, confirm, multiselect } from "@clack/prompts";
import type { DetectedSetup } from "./detector";

export interface AuthConfig {
  provider: "better-auth" | "clerk";
  methods: Array<"email" | "google" | "github">;
  includeUI: boolean;
  includeMiddleware: boolean;
  addToSchema: boolean;
}

export async function promptAuthSetup(
  detected: DetectedSetup
): Promise<AuthConfig> {
  const provider = (await select({
    message: "Select your auth provider",
    options: [
      {
        value: "better-auth",
        label: "Better Auth",
        hint: "Type-safe, modern, self-hosted",
      },
      { value: "clerk", label: "Clerk", hint: "Managed service, beautiful UI" },
    ],
  })) as AuthConfig["provider"];

  const methods = (await multiselect({
    message: "Select authentication methods",
    options: [
      { value: "email", label: "Email + Password" },
      { value: "google", label: "Google OAuth" },
      { value: "github", label: "GitHub OAuth" },
    ],
    required: true,
  })) as Array<"email" | "google" | "github">;

  const includeUI = (await confirm({
    message: "Generate UI components?",
    initialValue: true,
  })) as boolean;

  const includeMiddleware = (await confirm({
    message: "Generate middleware for route protection?",
    initialValue: true,
  })) as boolean;

  const addToSchema =
    detected.hasORM && detected.schemaPath && provider === "better-auth"
      ? ((await confirm({
          message: `Add auth tables to ${detected.orm} schema?`,
          initialValue: true,
        })) as boolean)
      : false;

  return { provider, methods, includeUI, includeMiddleware, addToSchema };
}
