import { writeFileWithDir } from "../../file-writer";
import { getAuthConfigTemplate } from "../templates/better-auth/auth-config.template";
import type { AuthConfig } from "../../prompts";
import type { DetectedSetup } from "../../detector";

export async function generateAuthConfig(
  config: AuthConfig,
  detected: DetectedSetup,
  outputPath: string
): Promise<void> {
  const content = getAuthConfigTemplate(config, detected);
  await writeFileWithDir(outputPath, content);
}
