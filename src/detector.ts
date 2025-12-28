// ============================================
// src/detector.ts - Detect existing setup
// ============================================

import { readFile, access } from "node:fs/promises";

interface DetectedSetup {
  framework: "nextjs" | "remix" | "sveltekit" | "astro" | "express" | "unknown";
  hasORM: boolean;
  orm: "drizzle" | "prisma" | "kysely" | null;
  database: "postgresql" | "mysql" | "sqlite" | null;
  schemaPath: string | null;
  srcDir: string | null;
  typescript: boolean;
  packageManager: "bun" | "npm" | "pnpm" | "yarn";
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
  // Detect framework
  const pkgContent = await readFile("package.json", "utf-8");
  const pkg = JSON.parse(pkgContent);

  let framework: DetectedSetup["framework"] = "unknown";
  if (pkg.dependencies?.next) framework = "nextjs";
  else if (pkg.dependencies?.["@remix-run/react"]) framework = "remix";
  else if (pkg.dependencies?.["@sveltejs/kit"]) framework = "sveltekit";
  else if (pkg.dependencies?.astro) framework = "astro";
  else if (pkg.dependencies?.express) framework = "express";

  // Detect ORM
  let hasORM = false;
  let orm: DetectedSetup["orm"] = null;
  let schemaPath: string | null = null;

  if (await fileExists("drizzle.config.ts")) {
    hasORM = true;
    orm = "drizzle";
    // Try common paths
    if (await fileExists("src/lib/db/schema.ts"))
      schemaPath = "src/lib/db/schema.ts";
    else if (await fileExists("lib/db/schema.ts"))
      schemaPath = "lib/db/schema.ts";
    else if (await fileExists("app/lib/db/schema.ts"))
      schemaPath = "app/lib/db/schema.ts";
  } else if (await fileExists("prisma/schema.prisma")) {
    hasORM = true;
    orm = "prisma";
    schemaPath = "prisma/schema.prisma";
  }

  // Detect database from .env
  let database: DetectedSetup["database"] = null;
  try {
    const env = await readFile(".env", "utf-8");
    const match = env.match(/DATABASE_URL=["']?([^"'\n]+)/);
    if (match) {
      const url = match[1];
      if (url.includes("postgres")) database = "postgresql";
      else if (url.includes("mysql")) database = "mysql";
      else if (url.includes("sqlite")) database = "sqlite";
    }
  } catch {}

  // Detect src directory
  const srcDir = (await fileExists("src"))
    ? "src"
    : (await fileExists("app"))
    ? "app"
    : null;

  // Other detections
  const typescript = await fileExists("tsconfig.json");
  const packageManager = (await fileExists("bun.lockb"))
    ? "bun"
    : (await fileExists("pnpm-lock.yaml"))
    ? "pnpm"
    : (await fileExists("yarn.lock"))
    ? "yarn"
    : "npm";

  return {
    framework,
    hasORM,
    orm,
    database,
    schemaPath,
    srcDir,
    typescript,
    packageManager,
  };
}
