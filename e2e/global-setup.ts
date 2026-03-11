import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { chromium } from "@playwright/test";

const ROOT_DIR = process.cwd();
const MODULE_DIR = path.join(ROOT_DIR, "test", "myModule.module");
const MODULE_DIR_REL = "test/myModule.module";

function run(cmd: string, cwd: string = ROOT_DIR): void {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit", shell: true });
}

function runWithTimeout(
  cmd: string,
  cwd: string,
  successPattern: RegExp,
  timeoutMs = 15000
): Promise<void> {
  console.log(`\n> ${cmd} (waiting for output, max ${timeoutMs}ms)`);
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, { cwd, shell: true, stdio: ["ignore", "pipe", "pipe"] });
    proc.unref();

    let settled = false;
    const done = (ok: boolean, err?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      proc.stdout!.destroy();
      proc.stderr!.destroy();
      proc.kill();
      if (ok) resolve();
      else reject(err ?? new Error(`Process did not produce expected output: ${successPattern}`));
    };

    const timer = setTimeout(() => done(true), timeoutMs);

    proc.stdout!.on("data", (data: Buffer) => {
      process.stdout.write(data);
      if (successPattern.test(data.toString())) done(true);
    });

    proc.stderr!.on("data", (data: Buffer) => process.stderr.write(data));

    proc.on("error", (err: Error) => done(false, err));
  });
}

export default async function globalSetup() {
  // 1. Install Playwright browsers if not already present
  console.log("\n=== Step 1: Install Playwright browsers ===");
  if (!fs.existsSync(chromium.executablePath())) {
    run("npx playwright install");
  } else {
    console.log("Browsers already installed, skipping.");
  }

  // 2. Clean up
  console.log("\n=== Step 2: Clean up old test module ===");
  // fs.rmSync(MODULE_DIR, { recursive: true, force: true });
  run(`rm -rf ${MODULE_DIR}`);

  // 3. Scaffold
  console.log("\n=== Step 3: Scaffold module ===");
  run(`npm exec create-hubspot-react-module ${MODULE_DIR_REL} my-module`);

  // 4. Install dependencies
  console.log("\n=== Step 4: Install dependencies ===");
  run("npm install", MODULE_DIR);

  // 5. Run dev mode briefly to verify it compiles
  console.log("\n=== Step 5: Verify dev mode ===");
  await runWithTimeout("npm run dev", MODULE_DIR, /built|watching|done|finished/i);
  console.log("Dev mode verified.");

  // 6. Build
  console.log("\n=== Step 6: Build ===");
  run("npm run build", MODULE_DIR);

  // 7. Patch module.html for browser testing
  console.log("\n=== Step 7: Patch module.html for browser testing ===");
  const htmlPath = path.join(MODULE_DIR, "module.html");
  let html = fs.readFileSync(htmlPath, "utf8");
  // Replace HubSpot HubL instance_id placeholder with a static test value
  html = html.replace(/\{\{\s*module\.instance_id\s*\}\}/g, "test-instance");
  // Prepend the ESM script tag so the bundle is loaded before the inline handler fires
  html = `<script type="module" src="module.js"></script>\n` + html;
  fs.writeFileSync(htmlPath, html, "utf8");
  console.log("module.html patched.");

  console.log("\n=== Setup complete — ready for Playwright tests ===\n");
}
