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
