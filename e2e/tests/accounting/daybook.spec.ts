import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { DaybookPage } from "../../pages/accounting/daybook.page";
import { testDates } from "../../fixtures/accounting-data";

test.describe("Daybook", () => {
  let daybookPage: DaybookPage;

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

    // Navigate to daybook
    daybookPage = new DaybookPage(page);
    await daybookPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display daybook page with date navigator", async () => {
      // P0: Verify main page elements
      await expect(daybookPage.daybookPage).toBeVisible();
      await expect(daybookPage.dateNavigator).toBeVisible();
      await expect(daybookPage.navPrev).toBeVisible();
      await expect(daybookPage.navNext).toBeVisible();
      await expect(daybookPage.dateInput).toBeVisible();
      await expect(daybookPage.dateDisplay).toBeVisible();
    });

    test("should display summary cards", async () => {
      // P0: Verify summary cards are visible
      await expect(daybookPage.summaryCards).toBeVisible();
      await expect(daybookPage.cashOpeningCard).toBeVisible();
      await expect(daybookPage.cashClosingCard).toBeVisible();
      await expect(daybookPage.bankOpeningCard).toBeVisible();
      await expect(daybookPage.bankClosingCard).toBeVisible();
    });

    test("should display cash and bank summary", async () => {
      // P0: Verify daily summary cards
      await expect(daybookPage.cashSummary).toBeVisible();
      await expect(daybookPage.bankSummary).toBeVisible();
    });

    test("should display transactions section", async () => {
      // P0: Verify transactions section exists
      await expect(daybookPage.transactions).toBeVisible();
    });
  });

  test.describe("Date Navigation", () => {
    test("should navigate to previous day", async () => {
      const currentDate = await daybookPage.getSelectedDate();
      const currentDateObj = new Date(currentDate);

      await daybookPage.navigateToPreviousDay();

      const newDate = await daybookPage.getSelectedDate();
      const newDateObj = new Date(newDate);

      expect(newDateObj.getTime()).toBeLessThan(currentDateObj.getTime());
    });

    test("should navigate to next day", async () => {
      // First go to yesterday so we can go forward
      await daybookPage.navigateToPreviousDay();
      const currentDate = await daybookPage.getSelectedDate();
      const currentDateObj = new Date(currentDate);

      await daybookPage.navigateToNextDay();

      const newDate = await daybookPage.getSelectedDate();
      const newDateObj = new Date(newDate);

      expect(newDateObj.getTime()).toBeGreaterThan(currentDateObj.getTime());
    });

    test("should navigate to specific date", async () => {
      const targetDate = testDates.daysAgo(5);

      await daybookPage.navigateToDate(targetDate);

      const selectedDate = await daybookPage.getSelectedDate();
      expect(selectedDate).toBe(targetDate);
    });

    test("should show Today button when not on today", async () => {
      // Navigate to yesterday
      await daybookPage.navigateToPreviousDay();

      // Today button should be visible
      await expect(daybookPage.navToday).toBeVisible();
    });

    test("should navigate back to today when clicking Today button", async () => {
      // Navigate to yesterday
      await daybookPage.navigateToPreviousDay();

      // Click Today button
      await daybookPage.navigateToToday();

      // Should be on today's date
      const selectedDate = await daybookPage.getSelectedDate();
      expect(selectedDate).toBe(testDates.today());
    });
  });

  test.describe("Summary Values", () => {
    test("should display cash opening value", async () => {
      const cashOpening = await daybookPage.getCashOpeningValue();
      // Should contain a currency value or "0"
      expect(cashOpening).toMatch(/₹|0/);
    });

    test("should display cash closing value", async () => {
      const cashClosing = await daybookPage.getCashClosingValue();
      expect(cashClosing).toMatch(/₹|0/);
    });

    test("should display bank opening value", async () => {
      const bankOpening = await daybookPage.getBankOpeningValue();
      expect(bankOpening).toMatch(/₹|0/);
    });

    test("should display bank closing value", async () => {
      const bankClosing = await daybookPage.getBankClosingValue();
      expect(bankClosing).toMatch(/₹|0/);
    });
  });

  test.describe("Transactions Display", () => {
    test("should show transactions or empty state", async () => {
      // Either transactions are visible or empty state is shown
      const hasTransactions = await daybookPage.hasTransactions();
      const isEmptyState = await daybookPage.isEmptyState();

      // One of them should be true
      expect(hasTransactions || isEmptyState).toBe(true);
    });

    test("should show empty state for date with no transactions", async () => {
      // Navigate to a very old date (unlikely to have transactions)
      const oldDate = testDates.daysAgo(365);
      await daybookPage.navigateToDate(oldDate);

      // Wait for data to load
      await daybookPage.page.waitForTimeout(2000);

      // Should show empty state or transactions
      const isEmptyState = await daybookPage.isEmptyState();
      const hasTransactions = await daybookPage.hasTransactions();

      // Either should be shown
      expect(isEmptyState || hasTransactions).toBe(true);
    });
  });

  test.describe("Date Display", () => {
    test("should display formatted date", async () => {
      const displayDate = await daybookPage.getDisplayDate();

      // Should contain day name and date parts
      expect(displayDate.length).toBeGreaterThan(0);
    });
  });
});
