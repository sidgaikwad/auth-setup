import { appendToFile } from "../../file-writer";
import {
  getDrizzleSchemaTemplate,
  getPrismaSchemaTemplate,
} from "../templates/better-auth/drizzle-schema.template";
import type { DetectedSetup } from "../../detector";

export async function addAuthTables(detected: DetectedSetup): Promise<void> {
  if (!detected.schemaPath) return;

  const content =
    detected.orm === "drizzle"
      ? getDrizzleSchemaTemplate(detected.database!)
      : getPrismaSchemaTemplate();

  await appendToFile(detected.schemaPath, content);
}
