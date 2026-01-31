import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { NikasiPage } from "../../pages/inventory/nikasi.page";

test.describe("Nikasi (Dispatch)", () => {
  let nikasiPage: NikasiPage;

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

    // Navigate to nikasi
    nikasiPage = new NikasiPage(page);
    await nikasiPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display nikasi page with KPI cards", async () => {
      await expect(nikasiPage.nikasiPage).toBeVisible();
      await expect(nikasiPage.newNikasiButton).toBeVisible();
      await expect(nikasiPage.searchInput).toBeVisible();
      await expect(nikasiPage.kpiTodayDispatch).toBeVisible();
      await expect(nikasiPage.kpiMonthRevenue).toBeVisible();
    });

    test("should show today's dispatch count", async () => {
      const todayDispatch = await nikasiPage.getKpiTodayDispatch();
      expect(todayDispatch).toBeDefined();
    });
  });

  test.describe("Nikasi Form Dialog", () => {
    test("should open new nikasi dialog", async () => {
      await nikasiPage.openNewNikasiDialog();
      await expect(nikasiPage.formDialog).toBeVisible();
      await expect(nikasiPage.formSerialInput).toBeVisible();
      await expect(nikasiPage.formDateInput).toBeVisible();
      await expect(nikasiPage.formAmadSelect).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await nikasiPage.openNewNikasiDialog();
      await expect(nikasiPage.formDialog).toBeVisible();

      await nikasiPage.closeFormDialog();
      await expect(nikasiPage.formDialog).not.toBeVisible();
    });

    test("should navigate between wizard steps", async () => {
      await nikasiPage.openNewNikasiDialog();

      // Step 1 fields should be visible
      await expect(nikasiPage.formPartyInput).toBeVisible();
      await expect(nikasiPage.formReceiverInput).toBeVisible();
      await expect(nikasiPage.formVehicleInput).toBeVisible();

      // Cancel and exit
      await nikasiPage.closeFormDialog();
    });
  });

  test.describe("Search Nikasi", () => {
    test("should search nikasi by party name", async () => {
      await nikasiPage.searchNikasi("test");

      // Clear search
      await nikasiPage.clearSearch();
    });

    test("should search nikasi by receiver name", async () => {
      await nikasiPage.searchNikasi("receiver");

      // Clear search
      await nikasiPage.clearSearch();
    });
  });
});
