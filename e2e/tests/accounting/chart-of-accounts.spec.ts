import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ChartOfAccountsPage } from "../../pages/accounting/chart-of-accounts.page";

test.describe("Chart of Accounts", () => {
  let chartPage: ChartOfAccountsPage;

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

    // Navigate to chart of accounts
    chartPage = new ChartOfAccountsPage(page);
    await chartPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display chart of accounts page with search and tree", async () => {
      await expect(chartPage.chartPage).toBeVisible();
      await expect(chartPage.searchInput).toBeVisible();
      await expect(chartPage.accountTree).toBeVisible();
    });
  });

  test.describe("Search Accounts", () => {
    test("should search and find parent account - CURRENT ASSETS", async () => {
      // Get initial count of visible accounts
      const initialCount = await chartPage.getVisibleAccountsCount();
      expect(initialCount).toBeGreaterThan(0);

      // Search for parent account "CURRENT ASSETS"
      await chartPage.searchAccounts("CURRENT ASSETS");

      // Verify at least one account containing "CURRENT ASSETS" is visible
      await chartPage.expectAccountContainingText("CURRENT ASSETS");

      // The filtered count should be less than or equal to the initial count
      const filteredCount = await chartPage.getVisibleAccountsCount();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
      expect(filteredCount).toBeGreaterThan(0);
    });

    test("should search and find child account - FARMER", async () => {
      // Get initial count of visible accounts
      const initialCount = await chartPage.getVisibleAccountsCount();
      expect(initialCount).toBeGreaterThan(0);

      // Search for child account "FARMER"
      await chartPage.searchAccounts("FARMER");

      // Verify at least one account containing "FARMER" is visible
      await chartPage.expectAccountContainingText("FARMER");

      // The filtered count should be less than or equal to the initial count
      // (includes FARMER and its parent chain)
      const filteredCount = await chartPage.getVisibleAccountsCount();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
      expect(filteredCount).toBeGreaterThan(0);
    });

    test("should clear search and show all accounts", async () => {
      // Get initial count
      const initialCount = await chartPage.getVisibleAccountsCount();

      // Search for something
      await chartPage.searchAccounts("FARMER");
      const filteredCount = await chartPage.getVisibleAccountsCount();

      // Clear search
      await chartPage.clearSearch();

      // Should show all accounts again
      const clearedCount = await chartPage.getVisibleAccountsCount();
      expect(clearedCount).toBe(initialCount);
      expect(clearedCount).toBeGreaterThanOrEqual(filteredCount);
    });

    test("should show no results for non-existent account", async () => {
      // Search for something that doesn't exist
      await chartPage.searchAccounts("XYZNONEXISTENT123");

      // Should show zero results
      const filteredCount = await chartPage.getVisibleAccountsCount();
      expect(filteredCount).toBe(0);
    });
  });
});
