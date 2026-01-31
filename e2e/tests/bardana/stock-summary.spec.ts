import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { StockSummaryPage } from "../../pages/bardana/stock-summary.page";

test.describe("Bardana Stock Summary", () => {
  let stockPage: StockSummaryPage;

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

    // Navigate to bardana stock summary
    stockPage = new StockSummaryPage(page);
    await stockPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display stock summary page with KPI cards", async () => {
      // Verify main page is visible
      await expect(stockPage.stockPage).toBeVisible();

      // Verify KPI cards container is visible
      await expect(stockPage.kpiCards).toBeVisible();
    });

    test("should display all KPI cards", async () => {
      await expect(stockPage.kpiTotalStock).toBeVisible();
      await expect(stockPage.kpiIssuedToday).toBeVisible();
      await expect(stockPage.kpiOutstanding).toBeVisible();
      await expect(stockPage.kpiReturnsPending).toBeVisible();
    });

    test("should display navigation tabs", async () => {
      await expect(stockPage.tabSummary).toBeVisible();
      await expect(stockPage.tabIssues).toBeVisible();
      await expect(stockPage.tabReceipts).toBeVisible();
      await expect(stockPage.tabOutstanding).toBeVisible();
    });

    test("should display stock by type section", async () => {
      // Stock type cards container should be visible (even if empty)
      await expect(stockPage.stockTypeCards).toBeVisible();
    });

    test("should display recent transactions section", async () => {
      await expect(stockPage.recentTransactions).toBeVisible();
    });
  });

  test.describe("Navigation", () => {
    test("should navigate to issues page via tab", async () => {
      await stockPage.navigateToIssues();
      await expect(stockPage.page).toHaveURL(/\/bardana\/issues/);
    });

    test("should navigate to receipts page via tab", async () => {
      await stockPage.navigateToReceipts();
      await expect(stockPage.page).toHaveURL(/\/bardana\/receipts/);
    });

    test("should navigate to outstanding page via tab", async () => {
      await stockPage.navigateToOutstanding();
      await expect(stockPage.page).toHaveURL(/\/bardana\/outstanding/);
    });
  });

  test.describe("Quick Actions", () => {
    test("should display new issue button in recent transactions", async () => {
      await expect(stockPage.newIssueButton).toBeVisible();
    });

    test("should display view all button in recent transactions", async () => {
      await expect(stockPage.viewAllButton).toBeVisible();
    });
  });
});
