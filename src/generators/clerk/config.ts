import { writeFileWithDir } from "../../file-writer";
import { getClerkMiddlewareTemplate } from "../templates/clerk/middleware.template";

export async function generateClerkMiddleware(
  outputPath: string
): Promise<void> {
  await writeFileWithDir(outputPath, getClerkMiddlewareTemplate());
}
