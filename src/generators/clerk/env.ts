import { writeFileWithDir } from "../../file-writer";
import { getClerkEnvTemplate } from "../templates/clerk/env.template";

export async function generateClerkEnv(outputPath: string): Promise<void> {
  await writeFileWithDir(outputPath, getClerkEnvTemplate());
}
