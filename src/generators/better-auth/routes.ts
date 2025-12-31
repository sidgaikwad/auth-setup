import { writeFileWithDir } from "../../file-writer";
import { getAPIRouteTemplate } from "../templates/better-auth/api-route.template";

export async function generateAPIRoute(
  framework: string,
  outputPath: string
): Promise<void> {
  const content = getAPIRouteTemplate(framework);
  await writeFileWithDir(outputPath, content);
}
