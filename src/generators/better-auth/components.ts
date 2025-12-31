import { writeFileWithDir } from '../../file-writer'
import {
  getSignInTemplate,
  getSignUpTemplate,
  getUserButtonTemplate,
} from '../templates/better-auth/components/sign-in.template'

export async function generateComponents(componentsDir: string): Promise<void> {
  await writeFileWithDir(`${componentsDir}/sign-in.tsx`, getSignInTemplate())
  await writeFileWithDir(`${componentsDir}/sign-up.tsx`, getSignUpTemplate())
  await writeFileWithDir(`${componentsDir}/user-button.tsx`, getUserButtonTemplate())
}
