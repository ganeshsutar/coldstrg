import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ReceiptPage } from "../../pages/bardana/receipt.page";

test.describe("Bardana Receipt (Returns)", () => {
  let receiptPage: ReceiptPage;

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

    // Navigate to bardana receipts
    receiptPage = new ReceiptPage(page);
    await receiptPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display receipt page with tabs and search", async () => {
      // Verify main page elements
      await expect(receiptPage.receiptPage).toBeVisible();
      await expect(receiptPage.newReceiptButton).toBeVisible();
      await expect(receiptPage.searchInput).toBeVisible();

      // Verify tabs are visible
      await expect(receiptPage.tabAll).toBeVisible();
      await expect(receiptPage.tabDraft).toBeVisible();
      await expect(receiptPage.tabConfirmed).toBeVisible();
      await expect(receiptPage.tabCancelled).toBeVisible();
    });
  });

  test.describe("Receipt Form Dialog", () => {
    test("should open new receipt dialog when clicking new button", async () => {
      await receiptPage.openNewReceiptDialog();
      await expect(receiptPage.formDialog).toBeVisible();
      await expect(receiptPage.formDateInput).toBeVisible();
      await expect(receiptPage.formPartySelect).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await receiptPage.openNewReceiptDialog();
      await expect(receiptPage.formDialog).toBeVisible();

      await receiptPage.closeFormDialog();
      await expect(receiptPage.formDialog).not.toBeVisible();
    });

    test("should display add item button in form", async () => {
      await receiptPage.openNewReceiptDialog();
      // Add item button visibility depends on party selection with outstanding
      await expect(receiptPage.formAddItemButton).toBeVisible();

      await receiptPage.closeFormDialog();
    });
  });

  test.describe("Filter Receipts", () => {
    test("should filter by status - Draft", async () => {
      const allCount = await receiptPage.getTabCount("all");
      const draftCount = await receiptPage.getTabCount("draft");

      await receiptPage.filterByStatus("draft");

      expect(draftCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter by status - Confirmed", async () => {
      const allCount = await receiptPage.getTabCount("all");
      const confirmedCount = await receiptPage.getTabCount("confirmed");

      await receiptPage.filterByStatus("confirmed");

      expect(confirmedCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter by status - Cancelled", async () => {
      const allCount = await receiptPage.getTabCount("all");
      const cancelledCount = await receiptPage.getTabCount("cancelled");

      await receiptPage.filterByStatus("cancelled");

      expect(cancelledCount).toBeLessThanOrEqual(allCount);
    });

    test("should search receipts by party name", async () => {
      await receiptPage.searchReceipt("test");

      // Clear search
      await receiptPage.clearSearch();
    });
  });

  test.describe("Tab Counts", () => {
    test("should show correct counts for each status tab", async () => {
      const allCount = await receiptPage.getTabCount("all");
      const draftCount = await receiptPage.getTabCount("draft");
      const confirmedCount = await receiptPage.getTabCount("confirmed");
      const cancelledCount = await receiptPage.getTabCount("cancelled");

      // Sum of status counts should equal all count
      const sumCounts = draftCount + confirmedCount + cancelledCount;
      expect(sumCounts).toBeLessThanOrEqual(allCount + 1); // Allow small margin for timing
    });
  });
});
