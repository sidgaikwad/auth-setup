#!/usr/bin/env bun
import { intro, outro, spinner, log, cancel } from "@clack/prompts";
import chalk from "chalk";
import { detectSetup } from "./detector";
import { promptAuthSetup } from "./prompts";
import { resolvePaths } from "./paths";
import { generateBetterAuth } from "./generators/better-auth";
import { installDependencies, addPackageScripts } from "./package-manager";

async function main() {
  console.clear();
  intro(chalk.bold.blue("🔐 Auth Setup CLI v1.0.0"));

  try {
    // Step 1: Detect project setup
    const s = spinner();
    s.start("Analyzing your project...");

    const detected = await detectSetup();
    s.stop("Project analyzed");

    // Display what we found
    log.info(`${chalk.green("✓")} Framework: ${detected.framework}`);
    log.info(`${chalk.green("✓")} Package manager: ${detected.packageManager}`);

    if (detected.hasORM) {
      log.info(
        `${chalk.green("✓")} ORM: ${detected.orm} (${detected.database})`
      );
      log.info(`${chalk.green("✓")} Schema: ${detected.schemaPath}`);
    } else {
      log.warn(
        `${chalk.yellow(
          "!"
        )} No ORM detected - auth tables will be generated separately`
      );
    }

    // Step 2: Get user preferences
    const config = await promptAuthSetup(detected);

    // Step 3: Resolve file paths
    const paths = resolvePaths(detected.srcDir);

    // Step 4: Install dependencies
    s.start("Installing dependencies...");
    await installDependencies(detected.packageManager, config);
    s.stop("Dependencies installed");

    // Step 5: Generate Better Auth files
    s.start("Generating auth files...");
    await generateBetterAuth(config, detected, paths);
    s.stop("Files generated");

    // Step 6: Add scripts to package.json
    s.start("Updating package.json...");
    await addPackageScripts();
    s.stop("package.json updated");

    // Success!
    outro(chalk.green.bold("✅ Better Auth setup complete!"));

    // Show next steps
    console.log();
    log.step("Import your auth:");
    console.log(chalk.cyan(`  import { auth } from "@/lib/auth"`));
    console.log();
    log.step("Next steps:");
    console.log(
      `  ${chalk.gray("1.")} Add secrets to .env (check .env.example)`
    );

    if (config.methods.includes("google")) {
      console.log(
        `  ${chalk.gray("2.")} Get Google OAuth credentials at: ${chalk.cyan(
          "console.cloud.google.com"
        )}`
      );
    }
    if (config.methods.includes("github")) {
      console.log(
        `  ${chalk.gray("3.")} Get GitHub OAuth app at: ${chalk.cyan(
          "github.com/settings/developers"
        )}`
      );
    }

    if (detected.hasORM) {
      console.log(
        `  ${chalk.gray("4.")} Run: ${chalk.cyan(
          "bun db:generate"
        )} (generate migration)`
      );
      console.log(
        `  ${chalk.gray("5.")} Run: ${chalk.cyan(
          "bun db:migrate"
        )} (apply migration)`
      );
    }

    console.log(
      `  ${chalk.gray("6.")} Run: ${chalk.cyan("bun dev")} (start your app)`
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
