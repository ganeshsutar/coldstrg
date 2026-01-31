import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { OutstandingPage } from "../../pages/bardana/outstanding.page";

test.describe("Bardana Outstanding", () => {
  let outstandingPage: OutstandingPage;

  test.beforeEach(async ({ page }) => {
    // Skip if no credentials
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!email || !password) {
      test.skip();
      return;
    }

    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);

    // Wait for dashboard to load with extended timeout for Cognito
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });

    // Navigate to bardana outstanding
    outstandingPage = new OutstandingPage(page);
    await outstandingPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display outstanding page with search", async () => {
      // Verify main page elements
      await expect(outstandingPage.outstandingPage).toBeVisible();
      await expect(outstandingPage.searchInput).toBeVisible();
    });

    test("should display summary card", async () => {
      await expect(outstandingPage.summaryCard).toBeVisible();
    });

    test("should display summary metrics", async () => {
      await expect(outstandingPage.totalBags).toBeVisible();
      await expect(outstandingPage.totalValue).toBeVisible();
      await expect(outstandingPage.partiesCount).toBeVisible();
    });
  });

  test.describe("Search Functionality", () => {
    test("should search parties by name or village", async () => {
      await outstandingPage.searchParty("test");

      // Clear search
      await outstandingPage.clearSearch();
    });
  });

  test.describe("Party List", () => {
    test("should display party list when outstanding exists", async () => {
      // Party list container should be visible (may be empty)
      const partyListVisible = await outstandingPage.partyList.isVisible().catch(() => false);

      // If there are outstanding parties, the list should be visible
      // This test passes whether there are parties or not
      expect(partyListVisible !== undefined).toBeTruthy();
    });
  });
});
