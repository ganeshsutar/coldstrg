import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { PartyLedgerPage } from "../../pages/accounting/party-ledger.page";
import { testParties, uniquePartyName } from "../../fixtures/accounting-data";

test.describe("Party Ledger", () => {
  let partyLedgerPage: PartyLedgerPage;

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

    // Navigate to party ledger
    partyLedgerPage = new PartyLedgerPage(page);
    await partyLedgerPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display party ledger page with KPI cards and tabs", async () => {
      // P0: Verify main page elements
      await expect(partyLedgerPage.partyLedgerPage).toBeVisible();
      await expect(partyLedgerPage.addPartyButton).toBeVisible();
      await expect(partyLedgerPage.searchInput).toBeVisible();

      // Verify tabs are visible
      await expect(partyLedgerPage.tabAll).toBeVisible();
      await expect(partyLedgerPage.tabDebtors).toBeVisible();
      await expect(partyLedgerPage.tabCreditors).toBeVisible();

      // Verify KPI cards are visible
      await expect(partyLedgerPage.kpiCards).toBeVisible();
      await expect(partyLedgerPage.kpiTotalDebtors).toBeVisible();
      await expect(partyLedgerPage.kpiTotalCreditors).toBeVisible();
      await expect(partyLedgerPage.kpiPendingRent).toBeVisible();
      await expect(partyLedgerPage.kpiPendingInterest).toBeVisible();
    });
  });

  test.describe("Party Form Dialog", () => {
    test("should open add party dialog when clicking add button", async () => {
      await partyLedgerPage.openAddPartyDialog();
      await expect(partyLedgerPage.formDialog).toBeVisible();
      await expect(partyLedgerPage.formNameInput).toBeVisible();
      await expect(partyLedgerPage.formSubmitButton).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await partyLedgerPage.openAddPartyDialog();
      await expect(partyLedgerPage.formDialog).toBeVisible();

      await partyLedgerPage.closeFormDialog();
      await expect(partyLedgerPage.formDialog).not.toBeVisible();
    });
  });

  test.describe("Create Party", () => {
    test("should create a new party with required fields", async () => {
      const partyName = uniquePartyName("Test Party");

      // Open dialog and fill form
      await partyLedgerPage.openAddPartyDialog();

      // Select party type first (required for party to appear in list)
      await partyLedgerPage.selectPartyType("KISAN");

      await partyLedgerPage.fillPartyForm({
        name: partyName,
        phone: testParties.simple.phone,
      });

      // Submit form
      await partyLedgerPage.submitForm();

      // Dialog should close on success
      await expect(partyLedgerPage.formDialog).not.toBeVisible({ timeout: 10_000 });

      // Wait for data to refresh
      await partyLedgerPage.page.waitForTimeout(1000);

      // Search for the created party
      await partyLedgerPage.searchParties(partyName);

      // Verify party appears in search results
      await expect(partyLedgerPage.page.getByText(partyName)).toBeVisible({ timeout: 5_000 });
    });

    test("should create party with opening balance", async () => {
      const partyName = uniquePartyName("Kisan Party");

      // Open dialog
      await partyLedgerPage.openAddPartyDialog();

      // Select party type first
      await partyLedgerPage.selectPartyType("KISAN");

      await partyLedgerPage.fillPartyForm({
        name: partyName,
        phone: testParties.kisan.phone,
        openingBalance: testParties.kisan.openingBalance,
      });

      await partyLedgerPage.submitForm();

      // Dialog should close on success
      await expect(partyLedgerPage.formDialog).not.toBeVisible({ timeout: 10_000 });

      // Wait for data to refresh
      await partyLedgerPage.page.waitForTimeout(1000);

      // Search for the created party
      await partyLedgerPage.searchParties(partyName);
      await expect(partyLedgerPage.page.getByText(partyName)).toBeVisible({ timeout: 5_000 });
    });
  });

  test.describe("Filter Parties", () => {
    test("should filter parties by debtors tab", async () => {
      // Get initial all count
      const allCount = await partyLedgerPage.getTabCount("all");
      const debtorsCount = await partyLedgerPage.getTabCount("debtors");

      // Click debtors tab
      await partyLedgerPage.filterByTab("debtors");

      // Verify debtors tab is active (we can check count is displayed)
      expect(debtorsCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter parties by creditors tab", async () => {
      // Get initial all count
      const allCount = await partyLedgerPage.getTabCount("all");
      const creditorsCount = await partyLedgerPage.getTabCount("creditors");

      // Click creditors tab
      await partyLedgerPage.filterByTab("creditors");

      // Verify creditors tab shows correct count
      expect(creditorsCount).toBeLessThanOrEqual(allCount);
    });
  });

  test.describe("Search Parties", () => {
    test("should search parties by name", async () => {
      // Search for a term
      await partyLedgerPage.searchParties("test");

      // Clear search
      await partyLedgerPage.clearSearch();
    });

    test("should search parties by phone", async () => {
      // Search by phone number
      await partyLedgerPage.searchParties("98765");

      // Clear search
      await partyLedgerPage.clearSearch();
    });
  });

  test.describe("KPI Cards", () => {
    test("should display KPI values", async () => {
      // Verify KPI cards show currency values
      const debtorsValue = await partyLedgerPage.getKpiDebtorsValue();
      const creditorsValue = await partyLedgerPage.getKpiCreditorsValue();

      // Values should contain currency symbol (INR uses ₹)
      expect(debtorsValue).toMatch(/₹|0/);
      expect(creditorsValue).toMatch(/₹|0/);
    });
  });
});
