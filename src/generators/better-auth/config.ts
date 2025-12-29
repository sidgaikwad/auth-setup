import { writeFileWithDir } from "../../file-writer";
import type { AuthConfig } from "../../prompts";
import type { DetectedSetup } from "../../detector";

export async function generateAuthConfig(
  config: AuthConfig,
  detected: DetectedSetup,
  outputPath: string
): Promise<void> {
  let code = `import { betterAuth } from "better-auth"\n`;

  // Add adapter import if ORM exists
  if (detected.hasORM && detected.orm === "drizzle") {
    code += `import { drizzleAdapter } from "better-auth/adapters/drizzle"\n`;
    code += `import { db } from "./db"\n`;
  } else if (detected.hasORM && detected.orm === "prisma") {
    code += `import { prismaAdapter } from "better-auth/adapters/prisma"\n`;
    code += `import { prisma } from "./prisma"\n`;
  }

  code += `\n`;
  code += `export const auth = betterAuth({\n`;

  // Database adapter
  if (detected.hasORM) {
    if (detected.orm === "drizzle") {
      code += `  database: drizzleAdapter(db, {\n`;
      code += `    provider: "${
        detected.database === "postgresql" ? "pg" : detected.database
      }",\n`;
      code += `  }),\n\n`;
    } else if (detected.orm === "prisma") {
      code += `  database: prismaAdapter(prisma, {\n`;
      code += `    provider: "${detected.database}",\n`;
      code += `  }),\n\n`;
    }
  }

  // Email and password
  if (config.methods.includes("email")) {
    code += `  emailAndPassword: {\n`;
    code += `    enabled: true,\n`;
    code += `  },\n\n`;
  }

  // Social providers
  const hasSocial =
    config.methods.includes("google") || config.methods.includes("github");
  if (hasSocial) {
    code += `  socialProviders: {\n`;

    if (config.methods.includes("google")) {
      code += `    google: {\n`;
      code += `      clientId: process.env.GOOGLE_CLIENT_ID!,\n`;
      code += `      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,\n`;
      code += `    },\n`;
    }

    if (config.methods.includes("github")) {
      code += `    github: {\n`;
      code += `      clientId: process.env.GITHUB_CLIENT_ID!,\n`;
      code += `      clientSecret: process.env.GITHUB_CLIENT_SECRET!,\n`;
      code += `    },\n`;
    }

    code += `  },\n`;
  }

  code += `})\n\n`;

  // Export types
  code += `export type Session = typeof auth.$Infer.Session\n`;
  code += `export type User = typeof auth.$Infer.User\n`;

  await writeFileWithDir(outputPath, code);
}
