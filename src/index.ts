#!/usr/bin/env bun
import { intro, outro, spinner, log } from "@clack/prompts";
import chalk from "chalk";
import { detectSetup } from "./detector";
import { promptAuthSetup } from "./prompts";
import { resolvePaths } from "./paths";
import { generateBetterAuth } from "./generators/better-auth";
import { generateClerk } from "./generators/clerk";
import { installDependencies } from "./package-manager";

async function main() {
  console.clear();
  intro(chalk.bold.blue("🔐 Auth Setup CLI v1.0.0"));

  try {
    const s = spinner();
    s.start("Analyzing your project...");
    const detected = await detectSetup();
    s.stop("Project analyzed");

    log.info(`${chalk.green("✓")} Framework: ${detected.framework}`);
    log.info(`${chalk.green("✓")} Package manager: ${detected.packageManager}`);
    if (detected.hasORM) {
      log.info(
        `${chalk.green("✓")} ORM: ${detected.orm} (${detected.database})`
      );
    }

    const config = await promptAuthSetup(detected);
    const paths = resolvePaths(detected.srcDir);

    s.start("Installing dependencies...");
    await installDependencies(detected.packageManager, config);
    s.stop("Dependencies installed");

    s.start("Generating files...");
    if (config.provider === "better-auth") {
      await generateBetterAuth(config, detected, paths);
    } else if (config.provider === "clerk") {
      await generateClerk(config, detected, paths);
    }
    s.stop("Files generated");

    outro(chalk.green.bold(`✅ ${config.provider} setup complete!`));

    console.log();
    log.step("Next steps:");
    console.log(
      `  ${chalk.gray("1.")} Add secrets to .env (check .env.example)`
    );
    if (detected.hasORM && config.provider === "better-auth") {
      console.log(
        `  ${chalk.gray("2.")} Run: ${chalk.cyan("bun db:generate")}`
      );
      console.log(`  ${chalk.gray("3.")} Run: ${chalk.cyan("bun db:migrate")}`);
      console.log(`  ${chalk.gray("4.")} Run: ${chalk.cyan("bun dev")}`);
    } else {
      console.log(`  ${chalk.gray("2.")} Run: ${chalk.cyan("bun dev")}`);
    }
    console.log();
  } catch (error) {
    if (error instanceof Error) {
      log.error(chalk.red(`Error: ${error.message}`));
    }
    process.exit(1);
  }
}

main();