#!/usr/bin/env node

// Validate package before publishing
import { readFileSync } from "fs";
import { join } from "path";

console.log("🔍 Validating package before publish...");

// Check dist folder exists
try {
  const distPath = join(process.cwd(), "dist", "index.js");
  readFileSync(distPath);
  console.log("✅ dist/index.js exists");
} catch (error) {
  console.error("❌ dist/index.js not found. Run `bun run build` first.");
  process.exit(1);
}

// Check bin/cli.js exists
try {
  const binPath = join(process.cwd(), "bin", "cli.js");
  readFileSync(binPath);
  console.log("✅ bin/cli.js exists");
} catch (error) {
  console.error("❌ bin/cli.js not found.");
  process.exit(1);
}

// Check package.json has required fields
try {
  const pkg = JSON.parse(readFileSync("package.json", "utf-8"));

  const required = ["name", "version", "description", "main", "bin", "license"];
  for (const field of required) {
    if (!pkg[field]) {
      console.error(`❌ package.json missing required field: ${field}`);
      process.exit(1);
    }
  }
  console.log("✅ package.json is valid");
} catch (error) {
  console.error("❌ package.json is invalid");
  process.exit(1);
}

console.log("✅ Package is ready to publish!");
