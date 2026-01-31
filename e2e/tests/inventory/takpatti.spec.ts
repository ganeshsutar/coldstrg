import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { TakpattiPage } from "../../pages/inventory/takpatti.page";
import { testTakpatti } from "../../fixtures/inventory-data";

test.describe("Takpatti (Weighment Slip)", () => {
  let takpattiPage: TakpattiPage;

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

    // Navigate to takpatti
    takpattiPage = new TakpattiPage(page);
    await takpattiPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display takpatti page with search", async () => {
      await expect(takpattiPage.takpattiPage).toBeVisible();
      await expect(takpattiPage.newTakpattiButton).toBeVisible();
      await expect(takpattiPage.searchInput).toBeVisible();
    });
  });

  test.describe("Takpatti Form", () => {
    test("should open new takpatti dialog", async () => {
      await takpattiPage.openNewTakpattiDialog();
      await expect(takpattiPage.formDialog).toBeVisible();
      await expect(takpattiPage.formNoInput).toBeVisible();
      await expect(takpattiPage.formDateInput).toBeVisible();
      await expect(takpattiPage.formAmadSelect).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await takpattiPage.openNewTakpattiDialog();
      await expect(takpattiPage.formDialog).toBeVisible();

      await takpattiPage.closeFormDialog();
      await expect(takpattiPage.formDialog).not.toBeVisible();
    });

    test("should display packet input fields", async () => {
      await takpattiPage.openNewTakpattiDialog();

      await expect(takpattiPage.formRoomInput).toBeVisible();
      await expect(takpattiPage.formPkt1Input).toBeVisible();
      await expect(takpattiPage.formPkt2Input).toBeVisible();
      await expect(takpattiPage.formPkt3Input).toBeVisible();
      await expect(takpattiPage.formTotalPackets).toBeVisible();

      await takpattiPage.closeFormDialog();
    });

    test("should auto-calculate total packets", async () => {
      await takpattiPage.openNewTakpattiDialog();

      await takpattiPage.fillForm({
        pkt1: testTakpatti.packets.pkt1,
        pkt2: testTakpatti.packets.pkt2,
        pkt3: testTakpatti.packets.pkt3,
      });

      const total = await takpattiPage.getTotalPackets();
      const expectedTotal =
        parseInt(testTakpatti.packets.pkt1) +
        parseInt(testTakpatti.packets.pkt2) +
        parseInt(testTakpatti.packets.pkt3);
      expect(total).toBe(String(expectedTotal));

      await takpattiPage.closeFormDialog();
    });
  });

  test.describe("Search Takpatti", () => {
    test("should search takpatti by number", async () => {
      await takpattiPage.searchTakpatti("1");

      // Clear search
      await takpattiPage.clearSearch();
    });

    test("should search takpatti by room", async () => {
      await takpattiPage.searchTakpatti("chamber");

      // Clear search
      await takpattiPage.clearSearch();
    });
  });
});
