import type { AuthConfig } from "../../../prompts";
import type { DetectedSetup } from "../../../detector";

export function getAuthConfigTemplate(
  config: AuthConfig,
  detected: DetectedSetup
): string {
  let code = `import { betterAuth } from "better-auth"\n`;

  if (detected.orm === "drizzle") {
    code += `import { drizzleAdapter } from "better-auth/adapters/drizzle"\n`;
    code += `import { db } from "./db"\n\n`;
    code += `export const auth = betterAuth({\n`;
    code += `  database: drizzleAdapter(db, {\n`;
    code += `    provider: "${
      detected.database === "postgresql" ? "pg" : detected.database
    }",\n`;
    code += `  }),\n`;
  } else if (detected.orm === "prisma") {
    code += `import { prismaAdapter } from "better-auth/adapters/prisma"\n`;
    code += `import { prisma } from "./prisma"\n\n`;
    code += `export const auth = betterAuth({\n`;
    code += `  database: prismaAdapter(prisma, {\n`;
    code += `    provider: "${detected.database}",\n`;
    code += `  }),\n`;
  } else {
    code += `\nexport const auth = betterAuth({\n`;
  }

  if (config.methods.includes("email")) {
    code += `  emailAndPassword: {\n    enabled: true,\n  },\n`;
  }

  if (config.methods.includes("google") || config.methods.includes("github")) {
    code += `  socialProviders: {\n`;
    if (config.methods.includes("google")) {
      code += `    google: {\n      clientId: process.env.GOOGLE_CLIENT_ID!,\n      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,\n    },\n`;
    }
    if (config.methods.includes("github")) {
      code += `    github: {\n      clientId: process.env.GITHUB_CLIENT_ID!,\n      clientSecret: process.env.GITHUB_CLIENT_SECRET!,\n    },\n`;
    }
    code += `  },\n`;
  }

  code += `})\n\nexport type Session = typeof auth.$Infer.Session\nexport type User = typeof auth.$Infer.User\n`;
  return code;
}
