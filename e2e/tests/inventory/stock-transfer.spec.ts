import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { StockTransferPage } from "../../pages/inventory/stock-transfer.page";
import { testTransfer } from "../../fixtures/inventory-data";

test.describe("Stock Transfer", () => {
  let transferPage: StockTransferPage;

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

    // Navigate to stock transfer
    transferPage = new StockTransferPage(page);
    await transferPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display stock transfer page with search", async () => {
      await expect(transferPage.transferPage).toBeVisible();
      await expect(transferPage.newTransferButton).toBeVisible();
      await expect(transferPage.searchInput).toBeVisible();
    });
  });

  test.describe("Transfer Wizard", () => {
    test("should open new transfer wizard", async () => {
      await transferPage.openNewTransferDialog();
      await expect(transferPage.formDialog).toBeVisible();
      await expect(transferPage.formAmadSelect).toBeVisible();
    });

    test("should close wizard when clicking cancel", async () => {
      await transferPage.openNewTransferDialog();
      await expect(transferPage.formDialog).toBeVisible();

      await transferPage.closeFormDialog();
      await expect(transferPage.formDialog).not.toBeVisible();
    });

    test("should display packet input fields in step 1", async () => {
      await transferPage.openNewTransferDialog();

      await expect(transferPage.formPkt1Input).toBeVisible();
      await expect(transferPage.formPkt2Input).toBeVisible();
      await expect(transferPage.formPkt3Input).toBeVisible();
      await expect(transferPage.formTotalPackets).toBeVisible();

      await transferPage.closeFormDialog();
    });

    test("should auto-calculate total packets", async () => {
      await transferPage.openNewTransferDialog();

      await transferPage.fillStep1({
        pkt1: testTransfer.packets.pkt1,
        pkt2: testTransfer.packets.pkt2,
        pkt3: testTransfer.packets.pkt3,
      });

      const total = await transferPage.getTotalPackets();
      const expectedTotal =
        parseInt(testTransfer.packets.pkt1) +
        parseInt(testTransfer.packets.pkt2) +
        parseInt(testTransfer.packets.pkt3);
      expect(total).toBe(String(expectedTotal));

      await transferPage.closeFormDialog();
    });
  });

  test.describe("Search Transfer", () => {
    test("should search transfer by party name", async () => {
      await transferPage.searchTransfer("test");

      // Clear search
      await transferPage.clearSearch();
    });

    test("should search transfer by transfer number", async () => {
      await transferPage.searchTransfer("1");

      // Clear search
      await transferPage.clearSearch();
    });
  });
});
