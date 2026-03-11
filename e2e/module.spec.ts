import { expect, test } from "@playwright/test";

test("React component mounts and renders", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/module.html");

  const container = page.locator("#module-test-instance");
  await expect(container).toBeVisible();
  await expect(container).toContainText("Hubspot module generated with React");

  expect(errors, `Page JS errors: ${errors.join(", ")}`).toHaveLength(0);
});


