import { readFile, access } from "node:fs/promises";

export interface DetectedSetup {
  framework: "nextjs" | "remix" | "sveltekit" | "astro" | "express" | "unknown";
  frameworkVersion?: string;
  hasORM: boolean;
  orm: "drizzle" | "prisma" | "kysely" | null;
  database: "postgresql" | "mysql" | "sqlite" | null;
  schemaPath: string | null;
  srcDir: string | null;
  typescript: boolean;
  packageManager: "bun" | "npm" | "pnpm" | "yarn";
  hasBetterAuth: boolean;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function detectSetup(): Promise<DetectedSetup> {
  // Read package.json
  const pkgContent = await readFile("package.json", "utf-8");
  const pkg = JSON.parse(pkgContent);

  // Detect framework
  let framework: DetectedSetup["framework"] = "unknown";
  let frameworkVersion: string | undefined;

  if (pkg.dependencies?.next) {
    framework = "nextjs";
    frameworkVersion = pkg.dependencies.next;
  } else if (pkg.dependencies?.["@remix-run/react"]) {
    framework = "remix";
    frameworkVersion = pkg.dependencies["@remix-run/react"];
  } else if (pkg.dependencies?.["@sveltejs/kit"]) {
    framework = "sveltekit";
    frameworkVersion = pkg.dependencies["@sveltejs/kit"];
  } else if (pkg.dependencies?.astro) {
    framework = "astro";
    frameworkVersion = pkg.dependencies.astro;
  } else if (pkg.dependencies?.express) {
    framework = "express";
  }

  // Check if Better Auth is already installed
  const hasBetterAuth = !!pkg.dependencies?.["better-auth"];

  // Detect ORM
  let hasORM = false;
  let orm: DetectedSetup["orm"] = null;
  let schemaPath: string | null = null;

  if (
    (await fileExists("drizzle.config.ts")) ||
    (await fileExists("drizzle.config.js"))
  ) {
    hasORM = true;
    orm = "drizzle";

    // Try common schema paths
    const possiblePaths = [
      "src/lib/db/schema.ts",
      "lib/db/schema.ts",
      "app/lib/db/schema.ts",
      "src/db/schema.ts",
      "db/schema.ts",
    ];

    for (const path of possiblePaths) {
      if (await fileExists(path)) {
        schemaPath = path;
        break;
      }
    }
  } else if (await fileExists("prisma/schema.prisma")) {
    hasORM = true;
    orm = "prisma";
    schemaPath = "prisma/schema.prisma";
  }

  // Detect database from .env
  let database: DetectedSetup["database"] = null;
  try {
    const envFiles = [".env", ".env.local", ".env.development"];
    for (const file of envFiles) {
      try {
        const env = await readFile(file, "utf-8");
        const match = env.match(/DATABASE_URL=["']?([^"'\n]+)/);
        if (match) {
          const url = match[1];
          if (url.includes("postgres")) database = "postgresql";
          else if (url.includes("mysql")) database = "mysql";
          else if (url.includes("sqlite") || url.includes(".db"))
            database = "sqlite";
          break;
        }
      } catch {}
    }
  } catch {}

  // Detect src directory
  const srcDir = (await fileExists("src"))
    ? "src"
    : (await fileExists("app"))
    ? "app"
    : null;

  // Detect TypeScript
  const typescript = await fileExists("tsconfig.json");

  // Detect package manager
  const packageManager = (await fileExists("bun.lockb"))
    ? "bun"
    : (await fileExists("pnpm-lock.yaml"))
    ? "pnpm"
    : (await fileExists("yarn.lock"))
    ? "yarn"
    : "npm";

  return {
    framework,
    frameworkVersion,
    hasORM,
    orm,
    database,
    schemaPath,
    srcDir,
    typescript,
    packageManager,
    hasBetterAuth,
  };
}
