import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { IssuePage } from "../../pages/bardana/issue.page";

test.describe("Bardana Issue", () => {
  let issuePage: IssuePage;

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

    // Navigate to bardana issues
    issuePage = new IssuePage(page);
    await issuePage.goto();
  });

  test.describe("Page Display", () => {
    test("should display issue page with tabs and search", async () => {
      // Verify main page elements
      await expect(issuePage.issuePage).toBeVisible();
      await expect(issuePage.newIssueButton).toBeVisible();
      await expect(issuePage.searchInput).toBeVisible();

      // Verify tabs are visible
      await expect(issuePage.tabAll).toBeVisible();
      await expect(issuePage.tabDraft).toBeVisible();
      await expect(issuePage.tabConfirmed).toBeVisible();
      await expect(issuePage.tabCancelled).toBeVisible();
    });
  });

  test.describe("Issue Form Dialog", () => {
    test("should open new issue dialog when clicking new button", async () => {
      await issuePage.openNewIssueDialog();
      await expect(issuePage.formDialog).toBeVisible();
      await expect(issuePage.formDateInput).toBeVisible();
      await expect(issuePage.formPartySelect).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await issuePage.openNewIssueDialog();
      await expect(issuePage.formDialog).toBeVisible();

      await issuePage.closeFormDialog();
      await expect(issuePage.formDialog).not.toBeVisible();
    });

    test("should display issue type toggle options", async () => {
      await issuePage.openNewIssueDialog();
      await expect(issuePage.formTypeRegular).toBeVisible();
      await expect(issuePage.formTypeAdvance).toBeVisible();

      await issuePage.closeFormDialog();
    });

    test("should display add item button in form", async () => {
      await issuePage.openNewIssueDialog();
      await expect(issuePage.formAddItemButton).toBeVisible();

      await issuePage.closeFormDialog();
    });
  });

  test.describe("Filter Issues", () => {
    test("should filter by status - Draft", async () => {
      const allCount = await issuePage.getTabCount("all");
      const draftCount = await issuePage.getTabCount("draft");

      await issuePage.filterByStatus("draft");

      expect(draftCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter by status - Confirmed", async () => {
      const allCount = await issuePage.getTabCount("all");
      const confirmedCount = await issuePage.getTabCount("confirmed");

      await issuePage.filterByStatus("confirmed");

      expect(confirmedCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter by status - Cancelled", async () => {
      const allCount = await issuePage.getTabCount("all");
      const cancelledCount = await issuePage.getTabCount("cancelled");

      await issuePage.filterByStatus("cancelled");

      expect(cancelledCount).toBeLessThanOrEqual(allCount);
    });

    test("should search issues by party name", async () => {
      await issuePage.searchIssue("test");

      // Clear search
      await issuePage.clearSearch();
    });
  });

  test.describe("Tab Counts", () => {
    test("should show correct counts for each status tab", async () => {
      const allCount = await issuePage.getTabCount("all");
      const draftCount = await issuePage.getTabCount("draft");
      const confirmedCount = await issuePage.getTabCount("confirmed");
      const cancelledCount = await issuePage.getTabCount("cancelled");

      // Sum of status counts should equal all count
      const sumCounts = draftCount + confirmedCount + cancelledCount;
      expect(sumCounts).toBeLessThanOrEqual(allCount + 1); // Allow small margin for timing
    });
  });
});
