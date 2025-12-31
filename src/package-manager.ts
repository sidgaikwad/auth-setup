import { execa } from "execa";
import type { AuthConfig } from "./prompts";

const DEPS: Record<string, string[]> = {
  "better-auth": ["better-auth"],
  clerk: ["@clerk/nextjs"],
};

export async function installDependencies(
  pm: string,
  config: AuthConfig
): Promise<void> {
  const deps = DEPS[config.provider];
  const cmd = pm === "npm" ? "install" : "add";
  await execa(pm, [cmd, ...deps], { stdio: "inherit" });
}
