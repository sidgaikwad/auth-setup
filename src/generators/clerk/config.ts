import { writeFileWithDir } from "../../file-writer";
import { getClerkMiddlewareTemplate } from "../templates/clerk/middleware.template";

export async function generateClerkMiddleware(
  outputPath: string
): Promise<void> {
  await writeFileWithDir(outputPath, getClerkMiddlewareTemplate());
}

// src/generators/clerk/components.ts
import { writeFileWithDir } from "../../file-writer";
import {
  getClerkSignInTemplate,
  getClerkUserButtonTemplate,
} from "../templates/clerk/components.template";

export async function generateClerkComponents(
  componentsDir: string
): Promise<void> {
  await writeFileWithDir(
    `${componentsDir}/sign-in.tsx`,
    getClerkSignInTemplate()
  );
  await writeFileWithDir(
    `${componentsDir}/user-button.tsx`,
    getClerkUserButtonTemplate()
  );
}
