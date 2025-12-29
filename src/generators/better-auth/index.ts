import type { AuthConfig } from "../../prompts";
import type { DetectedSetup } from "../../detector";
import type { ResolvedPaths } from "../../paths";
import { generateAuthConfig } from "./config";
import { addAuthTables } from "./schema";
import { generateAPIRoute } from "./routes";
import { generateMiddleware } from "./middleware";
import { generateComponents } from "./components";
import { generateEnvExample } from "./env";

export async function generateBetterAuth(
  config: AuthConfig,
  detected: DetectedSetup,
  paths: ResolvedPaths
): Promise<void> {
  // 1. Generate auth config (lib/auth.ts)
  await generateAuthConfig(config, detected, paths.authConfig);

  // 2. Add auth tables to schema if ORM exists
  if (config.addToSchema && detected.schemaPath) {
    await addAuthTables(detected);
  }

  // 3. Generate API route
  await generateAPIRoute(detected.framework, paths.apiRoute);

  // 4. Generate middleware
  if (config.includeMiddleware) {
    await generateMiddleware(detected.framework, paths.middleware);
  }

  // 5. Generate UI components
  if (config.includeUI) {
    await generateComponents(detected.framework, paths.components);
  }

  // 6. Generate .env.example
  await generateEnvExample(config, paths.envExample);
}
