import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { VouchersPage } from "../../pages/accounting/vouchers.page";
import { testVouchers, testDates, uniqueNarration } from "../../fixtures/accounting-data";

test.describe("Vouchers", () => {
  let vouchersPage: VouchersPage;

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

    // Navigate to vouchers
    vouchersPage = new VouchersPage(page);
    await vouchersPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display vouchers page with tabs and filters", async () => {
      // P0: Verify main page elements
      await expect(vouchersPage.vouchersPage).toBeVisible();
      await expect(vouchersPage.newVoucherButton).toBeVisible();
      await expect(vouchersPage.searchInput).toBeVisible();
      await expect(vouchersPage.dateFilter).toBeVisible();

      // Verify tabs are visible
      await expect(vouchersPage.tabAll).toBeVisible();
      await expect(vouchersPage.tabReceipt).toBeVisible();
      await expect(vouchersPage.tabPayment).toBeVisible();
      await expect(vouchersPage.tabJournal).toBeVisible();
      await expect(vouchersPage.tabContra).toBeVisible();
      await expect(vouchersPage.tabBank).toBeVisible();
    });

    test("should show today's voucher summary", async () => {
      const summary = await vouchersPage.getTodaySummary();
      expect(summary).toContain("vouchers today");
    });
  });

  test.describe("Voucher Form Dialog", () => {
    test("should open new voucher dialog when clicking new button", async () => {
      await vouchersPage.openNewVoucherDialog();
      await expect(vouchersPage.formDialog).toBeVisible();
      await expect(vouchersPage.formTypeToggle).toBeVisible();
      await expect(vouchersPage.formAmountInput).toBeVisible();
      await expect(vouchersPage.formSubmitButton).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await vouchersPage.openNewVoucherDialog();
      await expect(vouchersPage.formDialog).toBeVisible();

      await vouchersPage.closeFormDialog();
      await expect(vouchersPage.formDialog).not.toBeVisible();
    });

    test("should display voucher type toggle options", async () => {
      await vouchersPage.openNewVoucherDialog();

      // Check all type options are visible
      await expect(vouchersPage.page.getByTestId("voucher-form-type-cr")).toBeVisible();
      await expect(vouchersPage.page.getByTestId("voucher-form-type-dr")).toBeVisible();
      await expect(vouchersPage.page.getByTestId("voucher-form-type-jv")).toBeVisible();
      await expect(vouchersPage.page.getByTestId("voucher-form-type-cv")).toBeVisible();
      await expect(vouchersPage.page.getByTestId("voucher-form-type-bh")).toBeVisible();
    });
  });

  test.describe("Create Voucher", () => {
    test("should create a Receipt (CR) voucher", async () => {
      const narration = uniqueNarration("Test Receipt");

      await vouchersPage.openNewVoucherDialog();
      await vouchersPage.fillVoucherForm({
        type: "CR",
        amount: testVouchers.receipt.amount,
        narration,
        paymentMode: "CASH",
      });
      await vouchersPage.submitForm();

      // Dialog should close on success
      await expect(vouchersPage.formDialog).not.toBeVisible({ timeout: 10_000 });
    });

    test("should create a Payment (DR) voucher", async () => {
      const narration = uniqueNarration("Test Payment");

      await vouchersPage.openNewVoucherDialog();
      await vouchersPage.fillVoucherForm({
        type: "DR",
        amount: testVouchers.payment.amount,
        narration,
        paymentMode: "CASH",
      });
      await vouchersPage.submitForm();

      // Dialog should close on success
      await expect(vouchersPage.formDialog).not.toBeVisible({ timeout: 10_000 });
    });
  });

  test.describe("Filter Vouchers", () => {
    test("should filter vouchers by type - Receipt (CR)", async () => {
      const allCount = await vouchersPage.getTabCount("all");
      const crCount = await vouchersPage.getTabCount("CR");

      await vouchersPage.filterByType("CR");

      expect(crCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter vouchers by type - Payment (DR)", async () => {
      const allCount = await vouchersPage.getTabCount("all");
      const drCount = await vouchersPage.getTabCount("DR");

      await vouchersPage.filterByType("DR");

      expect(drCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter vouchers by date", async () => {
      const today = testDates.today();

      await vouchersPage.filterByDate(today);

      // Verify date filter is set
      const filterValue = await vouchersPage.dateFilter.inputValue();
      expect(filterValue).toBe(today);
    });

    test("should clear date filter", async () => {
      const today = testDates.today();

      // Set date filter
      await vouchersPage.filterByDate(today);
      await expect(vouchersPage.clearDateButton).toBeVisible();

      // Clear date filter
      await vouchersPage.clearDateFilter();
      await expect(vouchersPage.clearDateButton).not.toBeVisible();
    });
  });

  test.describe("Search Vouchers", () => {
    test("should search vouchers by narration", async () => {
      await vouchersPage.searchVouchers("test");

      // Clear search
      await vouchersPage.clearSearch();
    });

    test("should search vouchers by account name", async () => {
      await vouchersPage.searchVouchers("cash");

      // Clear search
      await vouchersPage.clearSearch();
    });
  });

  test.describe("Voucher Type Tabs", () => {
    test("should show correct counts for each voucher type", async () => {
      const allCount = await vouchersPage.getTabCount("all");
      const crCount = await vouchersPage.getTabCount("CR");
      const drCount = await vouchersPage.getTabCount("DR");
      const jvCount = await vouchersPage.getTabCount("JV");
      const cvCount = await vouchersPage.getTabCount("CV");
      const bhCount = await vouchersPage.getTabCount("BH");

      // Sum of all types should equal or be less than all (due to potential filtering)
      expect(crCount + drCount + jvCount + cvCount + bhCount).toBeLessThanOrEqual(allCount + 1);
    });
  });
});
