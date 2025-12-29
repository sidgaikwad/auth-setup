import { writeFileWithDir } from '../../file-writer'
import type { AuthConfig } from '../../prompts'

export async function generateEnvExample(
  config: AuthConfig,
  outputPath: string
): Promise<void> {
  let envContent = `# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-here # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000

`

  if (config.methods.includes('google')) {
    envContent += `# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

`
  }

  if (config.methods.includes('github')) {
    envContent += `# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

`
  }

  envContent += `# Database (if not already set)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
`

  await writeFileWithDir(outputPath, envContent)
}