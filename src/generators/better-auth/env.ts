import { writeFileWithDir } from "../../file-writer";
import type { AuthConfig } from "../../prompts";

export async function generateEnvExample(
  config: AuthConfig,
  outputPath: string
): Promise<void> {
  let content = `BETTER_AUTH_SECRET=\nBETTER_AUTH_URL=http://localhost:3000\n\n`;

  if (config.methods.includes("google")) {
    content += `GOOGLE_CLIENT_ID=\nGOOGLE_CLIENT_SECRET=\n\n`;
  }
  if (config.methods.includes("github")) {
    content += `GITHUB_CLIENT_ID=\nGITHUB_CLIENT_SECRET=\n\n`;
  }

  content += `DATABASE_URL=postgresql://user:password@localhost:5432/mydb\n`;
  await writeFileWithDir(outputPath, content);
}
