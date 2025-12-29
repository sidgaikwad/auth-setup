import { execa } from "execa";
import { readFile, writeFile as fsWriteFile } from "node:fs/promises";
import type { AuthConfig } from "./prompts";

export async function installDependencies(
  pm: "bun" | "npm" | "pnpm" | "yarn",
  config: AuthConfig
): Promise<void> {
  const deps = ["better-auth"];

  const addCmd = pm === "npm" ? "install" : "add";

  await execa(pm, [addCmd, ...deps], { stdio: "inherit" });
}

export async function addPackageScripts(): Promise<void> {
  const pkgPath = "package.json";
  const content = await readFile(pkgPath, "utf-8");
  const pkg = JSON.parse(content);

  // Add any auth-related scripts if needed
  // For Better Auth, most commands are handled by the framework

  await fsWriteFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}
