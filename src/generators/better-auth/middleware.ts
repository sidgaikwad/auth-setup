import { writeFileWithDir } from "../../file-writer";
import { getMiddlewareTemplate } from "../templates/better-auth/middleware.template";

export async function generateMiddleware(
  framework: string,
  outputPath: string
): Promise<void> {
  const content = getMiddlewareTemplate(framework);
  await writeFileWithDir(outputPath, content);
}
