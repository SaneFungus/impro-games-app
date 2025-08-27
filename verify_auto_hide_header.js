const { test, expect } = require("@playwright/test");
const path = require("path");

// Helper function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test.describe("Auto-hiding Header", () => {
  let page;
  const filePath = `file://${path.join(__dirname, "index.html")}`;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(filePath);
    // Wait for the games to be loaded and rendered, indicating the app is ready
    await page.waitForSelector(".game-card", { timeout: 10000 });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("should show the header initially", async () => {
    const topBar = await page.locator(".top-bar");
    await expect(topBar).toBeVisible();
    await page.screenshot({ path: "auto_hide_header_1_visible.png" });
  });

  test("should hide the header on scroll down", async () => {
    // Scroll down the page by a significant amount
    await page.mouse.wheel(0, 800);

    // Wait for the CSS transition to finish
    await delay(500);

    const topBar = await page.locator(".top-bar");
    // Check if the 'hidden' class is applied
    await expect(topBar).toHaveClass(/hidden/);

    // We can also check the transform property, but checking the class is more robust
    // to implementation details.

    await page.screenshot({ path: "auto_hide_header_2_hidden.png" });
  });

  test("should show the header again on scroll up", async () => {
    // Scroll up the page
    await page.mouse.wheel(0, -400);

    // Wait for the CSS transition to finish
    await delay(500);

    const topBar = await page.locator(".top-bar");
    // The 'hidden' class should be removed
    await expect(topBar).not.toHaveClass(/hidden/);
    await expect(topBar).toBeVisible();

    await page.screenshot({ path: "auto_hide_header_3_visible_again.png" });
  });
});
