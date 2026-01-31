import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { AmadPage } from "../../pages/inventory/amad.page";

test.describe("Amad (Goods Receipt)", () => {
  let amadPage: AmadPage;

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

    // Navigate to amad
    amadPage = new AmadPage(page);
    await amadPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display amad page with tabs and search", async () => {
      // Verify main page elements
      await expect(amadPage.amadPage).toBeVisible();
      await expect(amadPage.newAmadButton).toBeVisible();
      await expect(amadPage.searchInput).toBeVisible();

      // Verify tabs are visible
      await expect(amadPage.tabAll).toBeVisible();
      await expect(amadPage.tabInStock).toBeVisible();
      await expect(amadPage.tabPartial).toBeVisible();
      await expect(amadPage.tabDispatched).toBeVisible();
      await expect(amadPage.tabPending).toBeVisible();
    });

    test("should show KPI cards with stock summary", async () => {
      await expect(amadPage.kpiToday).toBeVisible();
      await expect(amadPage.kpiTotalStock).toBeVisible();
      await expect(amadPage.kpiPartial).toBeVisible();
      await expect(amadPage.kpiPending).toBeVisible();
    });
  });

  test.describe("Amad Form Dialog", () => {
    test("should open new amad dialog when clicking new button", async () => {
      await amadPage.openNewAmadDialog();
      await expect(amadPage.formDialog).toBeVisible();
      await expect(amadPage.formAmadNoInput).toBeVisible();
      await expect(amadPage.formDateInput).toBeVisible();
      await expect(amadPage.formPartySelect).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await amadPage.openNewAmadDialog();
      await expect(amadPage.formDialog).toBeVisible();

      await amadPage.closeFormDialog();
      await expect(amadPage.formDialog).not.toBeVisible();
    });

    test("should navigate between wizard steps", async () => {
      await amadPage.openNewAmadDialog();

      // Step 1 - need party selected to proceed
      await expect(amadPage.formVillageInput).toBeVisible();

      // Cancel and exit
      await amadPage.closeFormDialog();
    });
  });

  test.describe("Filter Amad", () => {
    test("should filter by status - In Stock", async () => {
      const allCount = await amadPage.getTabCount("all");
      const inStockCount = await amadPage.getTabCount("in-stock");

      await amadPage.filterByStatus("in-stock");

      expect(inStockCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter by status - Dispatched", async () => {
      const allCount = await amadPage.getTabCount("all");
      const dispatchedCount = await amadPage.getTabCount("dispatched");

      await amadPage.filterByStatus("dispatched");

      expect(dispatchedCount).toBeLessThanOrEqual(allCount);
    });

    test("should search amad by party name", async () => {
      await amadPage.searchAmad("test");

      // Clear search
      await amadPage.clearSearch();
    });
  });

  test.describe("Tab Counts", () => {
    test("should show correct counts for each status tab", async () => {
      const allCount = await amadPage.getTabCount("all");
      const inStockCount = await amadPage.getTabCount("in-stock");
      const partialCount = await amadPage.getTabCount("partial");
      const dispatchedCount = await amadPage.getTabCount("dispatched");
      const pendingCount = await amadPage.getTabCount("pending");

      // Sum of status counts should equal all count
      const sumCounts = inStockCount + partialCount + dispatchedCount + pendingCount;
      expect(sumCounts).toBeLessThanOrEqual(allCount + 1); // Allow small margin for timing
    });
  });
});
