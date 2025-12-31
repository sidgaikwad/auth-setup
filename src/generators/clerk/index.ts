import type { AuthConfig } from "../../prompts";
import type { DetectedSetup } from "../../detector";
import type { ResolvedPaths } from "../../paths";
import { generateClerkMiddleware } from "./config";
import { generateClerkComponents } from "./components";
import { generateClerkEnv } from "./env";

export async function generateClerk(
  config: AuthConfig,
  detected: DetectedSetup,
  paths: ResolvedPaths
): Promise<void> {
  // 1. Generate middleware
  if (config.includeMiddleware) {
    await generateClerkMiddleware(paths.middleware);
  }

  // 2. Generate UI components
  if (config.includeUI) {
    await generateClerkComponents(paths.components);
  }

  // 3. Generate .env.example
  await generateClerkEnv(paths.envExample);
}
