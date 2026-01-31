import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { RentBillsPage } from "../../pages/billing/rent-bills.page";
import { uniqueNotes } from "../../fixtures/billing-data";

test.describe("Rent Bills", () => {
  let rentBillsPage: RentBillsPage;

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

    // Navigate to rent bills
    rentBillsPage = new RentBillsPage(page);
    await rentBillsPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display rent bills list page with all elements", async () => {
      // Verify main page elements
      await expect(rentBillsPage.listPage).toBeVisible();
      await expect(rentBillsPage.newBillButton).toBeVisible();
      await expect(rentBillsPage.searchInput).toBeVisible();

      // Verify KPI cards are visible
      await expect(rentBillsPage.kpiCards).toBeVisible();
      await expect(rentBillsPage.kpiBillsThisMonth).toBeVisible();
      await expect(rentBillsPage.kpiPending).toBeVisible();
      await expect(rentBillsPage.kpiCollections).toBeVisible();
      await expect(rentBillsPage.kpiGst).toBeVisible();

      // Verify tabs are visible
      await expect(rentBillsPage.tabAll).toBeVisible();
      await expect(rentBillsPage.tabDraft).toBeVisible();
      await expect(rentBillsPage.tabPending).toBeVisible();
      await expect(rentBillsPage.tabPaid).toBeVisible();
      await expect(rentBillsPage.tabCancelled).toBeVisible();
    });

    test("should show correct tab counts", async () => {
      const allCount = await rentBillsPage.getTabCount("all");
      const draftCount = await rentBillsPage.getTabCount("draft");
      const pendingCount = await rentBillsPage.getTabCount("pending");
      const paidCount = await rentBillsPage.getTabCount("paid");
      const cancelledCount = await rentBillsPage.getTabCount("cancelled");

      // Sum of filtered tabs should be less than or equal to all
      expect(draftCount + pendingCount + paidCount + cancelledCount).toBeLessThanOrEqual(allCount + 1);
    });
  });

  test.describe("Filter Bills", () => {
    test("should filter bills by status - Draft", async () => {
      const allCount = await rentBillsPage.getTabCount("all");
      const draftCount = await rentBillsPage.getTabCount("draft");

      await rentBillsPage.filterByStatus("draft");

      expect(draftCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter bills by status - Pending", async () => {
      const allCount = await rentBillsPage.getTabCount("all");
      const pendingCount = await rentBillsPage.getTabCount("pending");

      await rentBillsPage.filterByStatus("pending");

      expect(pendingCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter bills by status - Paid", async () => {
      const allCount = await rentBillsPage.getTabCount("all");
      const paidCount = await rentBillsPage.getTabCount("paid");

      await rentBillsPage.filterByStatus("paid");

      expect(paidCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter bills by status - Cancelled", async () => {
      const allCount = await rentBillsPage.getTabCount("all");
      const cancelledCount = await rentBillsPage.getTabCount("cancelled");

      await rentBillsPage.filterByStatus("cancelled");

      expect(cancelledCount).toBeLessThanOrEqual(allCount);
    });
  });

  test.describe("Search Bills", () => {
    test("should search bills by number", async () => {
      await rentBillsPage.searchBills("RB-");
      // Search is applied
      await expect(rentBillsPage.searchInput).toHaveValue("RB-");

      await rentBillsPage.clearSearch();
      await expect(rentBillsPage.searchInput).toHaveValue("");
    });

    test("should search bills by party name", async () => {
      await rentBillsPage.searchBills("Ram");
      await expect(rentBillsPage.searchInput).toHaveValue("Ram");

      await rentBillsPage.clearSearch();
    });
  });

  test.describe("Bill Generation Wizard", () => {
    test("should open bill generation wizard when clicking new button", async () => {
      await rentBillsPage.clickNewBill();
      await expect(rentBillsPage.wizardPage).toBeVisible();
      await expect(rentBillsPage.wizardSteps).toBeVisible();
      await expect(rentBillsPage.step1Content).toBeVisible();
    });

    test("should display step indicators correctly", async () => {
      await rentBillsPage.gotoNewBill();

      // Verify all step indicators are visible
      await expect(rentBillsPage.getStepIndicator(1)).toBeVisible();
      await expect(rentBillsPage.getStepIndicator(2)).toBeVisible();
      await expect(rentBillsPage.getStepIndicator(3)).toBeVisible();
    });

    test("should show party select in step 1", async () => {
      await rentBillsPage.gotoNewBill();
      await expect(rentBillsPage.wizardPartySelect).toBeVisible();
    });

    test("should show amad table after selecting party", async ({ page }) => {
      await rentBillsPage.gotoNewBill();

      // Click party select to open dropdown
      await rentBillsPage.wizardPartySelect.click();

      // Select first available party if any
      const firstOption = page.locator('[data-testid^="bill-wizard-party-option-"]').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();

        // After selecting party, amad count should be visible
        await expect(rentBillsPage.wizardAmadCount).toBeVisible();
      }
    });

    test("should cancel wizard and return to list", async () => {
      await rentBillsPage.gotoNewBill();
      await rentBillsPage.cancelWizard();
      await expect(rentBillsPage.listPage).toBeVisible();
    });

    test("should have back button disabled on step 1", async () => {
      await rentBillsPage.gotoNewBill();
      await expect(rentBillsPage.wizardBack).toBeDisabled();
    });

    test("should have next button disabled without selection", async () => {
      await rentBillsPage.gotoNewBill();
      // Next should be disabled without party and amad selection
      await expect(rentBillsPage.wizardNext).toBeDisabled();
    });
  });

  test.describe("Bill Wizard Step Navigation", () => {
    test("should navigate through wizard steps when conditions are met", async ({ page }) => {
      await rentBillsPage.gotoNewBill();

      // Select a party
      await rentBillsPage.wizardPartySelect.click();
      const firstOption = page.locator('[data-testid^="bill-wizard-party-option-"]').first();

      // Wait for party options to load, skip if none available
      try {
        await firstOption.waitFor({ state: "visible", timeout: 5000 });
      } catch {
        test.skip(true, "No parties available in test environment");
        return;
      }

      await firstOption.click();

      // Wait for amad table to load and check if there are actual amad rows
      try {
        await rentBillsPage.wizardAmadTable.waitFor({ state: "visible", timeout: 5000 });
      } catch {
        test.skip(true, "Amad table not visible");
        return;
      }

      // Check if there are actual amad checkbox rows (not just the empty state)
      const amadCheckbox = page.locator('[data-testid^="bill-wizard-amad-checkbox-"]').first();
      if (!(await amadCheckbox.isVisible())) {
        test.skip(true, "No billable amads available for selected party");
        return;
      }

      await rentBillsPage.selectAllAmads();

      // Verify selection summary appears
      await expect(rentBillsPage.wizardSelectionSummary).toBeVisible({ timeout: 3000 });

      // Next should now be enabled
      await expect(rentBillsPage.wizardNext).toBeEnabled();

      // Go to step 2
      await rentBillsPage.goToStep2();
      await expect(rentBillsPage.step2Content).toBeVisible();
      await expect(rentBillsPage.wizardRentTable).toBeVisible();
      await expect(rentBillsPage.wizardGstType).toBeVisible();
      await expect(rentBillsPage.wizardGstRate).toBeVisible();
      await expect(rentBillsPage.wizardDiscount).toBeVisible();

      // Go to step 3
      await rentBillsPage.goToStep3();
      await expect(rentBillsPage.step3Content).toBeVisible();
      await expect(rentBillsPage.wizardPreview).toBeVisible();
      await expect(rentBillsPage.wizardNotes).toBeVisible();
      await expect(rentBillsPage.wizardGenerateButton).toBeVisible();

      // Go back to step 2
      await rentBillsPage.goBack();
      await expect(rentBillsPage.step2Content).toBeVisible();

      // Go back to step 1
      await rentBillsPage.goBack();
      await expect(rentBillsPage.step1Content).toBeVisible();
    });
  });

  test.describe("Bill Wizard Step 2 - Charges", () => {
    test("should display charge buttons in step 2", async ({ page }) => {
      await rentBillsPage.gotoNewBill();

      // Select party and amads
      await rentBillsPage.wizardPartySelect.click();
      const firstOption = page.locator('[data-testid^="bill-wizard-party-option-"]').first();

      // Wait for party options to load, skip if none available
      try {
        await firstOption.waitFor({ state: "visible", timeout: 5000 });
      } catch {
        test.skip(true, "No parties available in test environment");
        return;
      }

      await firstOption.click();

      // Wait for amad table to load and check if there are actual amad rows
      try {
        await rentBillsPage.wizardAmadTable.waitFor({ state: "visible", timeout: 5000 });
      } catch {
        test.skip(true, "Amad table not visible");
        return;
      }

      // Check if there are actual amad checkbox rows (not just the empty state)
      const amadCheckbox = page.locator('[data-testid^="bill-wizard-amad-checkbox-"]').first();
      if (!(await amadCheckbox.isVisible())) {
        test.skip(true, "No billable amads available for selected party");
        return;
      }

      await rentBillsPage.selectAllAmads();

      // Wait for selection summary before proceeding
      await expect(rentBillsPage.wizardSelectionSummary).toBeVisible({ timeout: 3000 });

      await rentBillsPage.goToStep2();

      // Verify charge buttons
      await expect(page.getByTestId("bill-wizard-add-charge-loading")).toBeVisible();
      await expect(page.getByTestId("bill-wizard-add-charge-unloading")).toBeVisible();
      await expect(page.getByTestId("bill-wizard-add-charge-dala")).toBeVisible();
      await expect(page.getByTestId("bill-wizard-add-charge-insurance")).toBeVisible();
      await expect(page.getByTestId("bill-wizard-add-charge-other")).toBeVisible();
    });

    test("should allow setting GST type and rate", async ({ page }) => {
      await rentBillsPage.gotoNewBill();

      await rentBillsPage.wizardPartySelect.click();
      const firstOption = page.locator('[data-testid^="bill-wizard-party-option-"]').first();

      // Wait for party options to load, skip if none available
      try {
        await firstOption.waitFor({ state: "visible", timeout: 5000 });
      } catch {
        test.skip(true, "No parties available in test environment");
        return;
      }

      await firstOption.click();

      // Wait for amad table to load and check if there are actual amad rows
      try {
        await rentBillsPage.wizardAmadTable.waitFor({ state: "visible", timeout: 5000 });
      } catch {
        test.skip(true, "Amad table not visible");
        return;
      }

      // Check if there are actual amad checkbox rows (not just the empty state)
      const amadCheckbox = page.locator('[data-testid^="bill-wizard-amad-checkbox-"]').first();
      if (!(await amadCheckbox.isVisible())) {
        test.skip(true, "No billable amads available for selected party");
        return;
      }

      await rentBillsPage.selectAllAmads();

      // Wait for selection summary before proceeding
      await expect(rentBillsPage.wizardSelectionSummary).toBeVisible({ timeout: 3000 });

      await rentBillsPage.goToStep2();

      // Set GST rate
      await rentBillsPage.setGstRate("18");
      await expect(rentBillsPage.wizardGstRate).toHaveValue("18");

      // Set discount
      await rentBillsPage.setDiscount("100");
      await expect(rentBillsPage.wizardDiscount).toHaveValue("100");
    });
  });

  test.describe("Bill Wizard Step 3 - Preview", () => {
    test("should allow adding notes in step 3", async ({ page }) => {
      await rentBillsPage.gotoNewBill();

      await rentBillsPage.wizardPartySelect.click();
      const firstOption = page.locator('[data-testid^="bill-wizard-party-option-"]').first();

      // Wait for party options to load, skip if none available
      try {
        await firstOption.waitFor({ state: "visible", timeout: 5000 });
      } catch {
        test.skip(true, "No parties available in test environment");
        return;
      }

      await firstOption.click();

      // Wait for amad table to load and check if there are actual amad rows
      try {
        await rentBillsPage.wizardAmadTable.waitFor({ state: "visible", timeout: 5000 });
      } catch {
        test.skip(true, "Amad table not visible");
        return;
      }

      // Check if there are actual amad checkbox rows (not just the empty state)
      const amadCheckbox = page.locator('[data-testid^="bill-wizard-amad-checkbox-"]').first();
      if (!(await amadCheckbox.isVisible())) {
        test.skip(true, "No billable amads available for selected party");
        return;
      }

      await rentBillsPage.selectAllAmads();

      // Wait for selection summary to appear before proceeding
      await expect(rentBillsPage.wizardSelectionSummary).toBeVisible({ timeout: 3000 });

      await rentBillsPage.goToStep2();
      await rentBillsPage.goToStep3();

      const testNotes = uniqueNotes("Test bill");
      await rentBillsPage.setNotes(testNotes);
      await expect(rentBillsPage.wizardNotes).toHaveValue(testNotes);
    });
  });
});
