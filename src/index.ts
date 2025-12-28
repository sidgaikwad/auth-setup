// MVP Implementation Structure for @sidgaikwad/auth-setup

// ============================================
// src/index.ts - Main CLI
// ============================================

import { intro, outro, spinner, log } from "@clack/prompts";
import chalk from "chalk";
import { detectSetup } from "./detector";
import { promptAuthSetup } from "./prompts";
import { generateBetterAuth } from "./generators/better-auth";
import { installDependencies, addEnvVariables } from "./utils";

async function main() {
  console.clear();
  intro(chalk.bold.blue("🔐 Auth Setup CLI v1.0.0"));

  try {
    const s = spinner();
    s.start("Detecting your setup...");

    const detected = await detectSetup();
    s.stop("Setup detected");

    // Show what we found
    if (detected.hasORM) {
      log.info(`${chalk.green("✓")} Found ORM: ${detected.orm}`);
      log.info(`${chalk.green("✓")} Database: ${detected.database}`);
    } else {
      log.warn(`${chalk.yellow("!")} No ORM detected - will setup auth tables`);
    }

    log.info(`${chalk.green("✓")} Framework: ${detected.framework}`);

    // Get user preferences
    const config = await promptAuthSetup(detected);

    // Install dependencies
    s.start("Installing dependencies...");
    await installDependencies(config);
    s.stop("Dependencies installed");

    // Generate auth files
    s.start("Generating auth files...");

    switch (config.provider) {
      case "better-auth":
        await generateBetterAuth(config, detected);
        break;
      // Add more providers in future versions
    }

    s.stop("Files generated");

    // Add environment variables
    s.start("Setting up environment...");
    await addEnvVariables(config);
    s.stop("Environment configured");

    // Success!
    outro(chalk.green.bold("✅ Auth setup complete!"));

    // Show next steps
    console.log();
    log.step("Next steps:");
    console.log(
      `  ${chalk.gray("1.")} Add secrets to .env (check .env.example)`
    );

    if (detected.hasORM) {
      console.log(
        `  ${chalk.gray("2.")} Run: ${chalk.cyan(
          "bun db:generate"
        )} (generate migration)`
      );
      console.log(
        `  ${chalk.gray("3.")} Run: ${chalk.cyan(
          "bun db:migrate"
        )} (apply migration)`
      );
    }

    console.log(
      `  ${chalk.gray("4.")} Import: ${chalk.cyan(
        'import { auth } from "@/lib/auth"'
      )}`
    );
    console.log();
    log.info(`Documentation: ${chalk.cyan("https://better-auth.com/docs")}`);
  } catch (error) {
    if (error instanceof Error) {
      log.error(chalk.red(`Error: ${error.message}`));
    }
    process.exit(1);
  }
}

main();
