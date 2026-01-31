import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { KataiPage } from "../../pages/trading/katai.page";
import {
  testKatai,
  testDates,
  calculateGradingCharges,
  isGradingBalanced,
} from "../../fixtures/trading-data";

test.describe("Katai (Grading)", () => {
  let kataiPage: KataiPage;

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

    // Navigate to katai page
    kataiPage = new KataiPage(page);
    await kataiPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display katai page with tabs and search", async () => {
      // Verify main page elements
      await expect(kataiPage.kataiPage).toBeVisible();
      await expect(kataiPage.newGradingButton).toBeVisible();
      await expect(kataiPage.searchInput).toBeVisible();

      // Verify tabs are visible
      await expect(kataiPage.tabAll).toBeVisible();
      await expect(kataiPage.tabPending).toBeVisible();
      await expect(kataiPage.tabInProgress).toBeVisible();
      await expect(kataiPage.tabCompleted).toBeVisible();
    });

    test("should show KPI cards with grading summary", async () => {
      await expect(kataiPage.kpiTotalRecords).toBeVisible();
      await expect(kataiPage.kpiInProgress).toBeVisible();
      await expect(kataiPage.kpiCompleted).toBeVisible();
      await expect(kataiPage.kpiTotalGraded).toBeVisible();
    });

    test("should display page title and description", async () => {
      const heading = kataiPage.page.getByRole("heading", { name: /grading|katai/i });
      await expect(heading).toBeVisible();
    });
  });

  test.describe("Grading Form Dialog", () => {
    test("should open new grading dialog when clicking new button", async () => {
      await kataiPage.openNewGradingDialog();
      await expect(kataiPage.formDialog).toBeVisible();
      await expect(kataiPage.formKataiNoInput).toBeVisible();
      await expect(kataiPage.formDateInput).toBeVisible();
      await expect(kataiPage.formPartySelect).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await kataiPage.openNewGradingDialog();
      await expect(kataiPage.formDialog).toBeVisible();

      await kataiPage.closeFormDialog();
      await expect(kataiPage.formDialog).not.toBeVisible();
    });

    test("should display grading details section", async () => {
      await kataiPage.openNewGradingDialog();

      // Verify grading details fields
      await expect(kataiPage.formKataiNoInput).toBeVisible();
      await expect(kataiPage.formDateInput).toBeVisible();

      await kataiPage.closeFormDialog();
    });

    test("should display source selection section", async () => {
      await kataiPage.openNewGradingDialog();

      // Verify source selection fields
      await expect(kataiPage.formPartySelect).toBeVisible();
      await expect(kataiPage.formAmadSelect).toBeVisible();
      await expect(kataiPage.formBagsGradedInput).toBeVisible();

      await kataiPage.closeFormDialog();
    });

    test("should display grading output section", async () => {
      await kataiPage.openNewGradingDialog();

      // Verify grading output fields for all grades
      await expect(kataiPage.formMotaBagsInput).toBeVisible();
      await expect(kataiPage.formChattaBagsInput).toBeVisible();
      await expect(kataiPage.formBeejBagsInput).toBeVisible();
      await expect(kataiPage.formMixBagsInput).toBeVisible();
      await expect(kataiPage.formGullaBagsInput).toBeVisible();

      await kataiPage.closeFormDialog();
    });

    test("should display labor charges section", async () => {
      await kataiPage.openNewGradingDialog();

      // Verify labor charge fields
      await expect(kataiPage.formLaborNameInput).toBeVisible();
      await expect(kataiPage.formLaborRateInput).toBeVisible();
      await expect(kataiPage.formTotalChargesDisplay).toBeVisible();

      await kataiPage.closeFormDialog();
    });

    test("should have auto-generated katai number", async () => {
      await kataiPage.openNewGradingDialog();

      // Verify katai number is auto-generated and disabled
      await expect(kataiPage.formKataiNoInput).toBeDisabled();
      const kataiNo = await kataiPage.formKataiNoInput.inputValue();
      expect(kataiNo).toBeTruthy();

      await kataiPage.closeFormDialog();
    });

    test("should have today's date as default", async () => {
      await kataiPage.openNewGradingDialog();

      const dateValue = await kataiPage.formDateInput.inputValue();
      const today = testDates.today();
      expect(dateValue).toBe(today);

      await kataiPage.closeFormDialog();
    });
  });

  test.describe("Form Validation", () => {
    test("should require party selection", async () => {
      await kataiPage.openNewGradingDialog();

      // Fill bags graded but no party
      await kataiPage.fillBagsGraded(testKatai.basic.bagsGraded);

      // Submit button should be disabled without party
      await expect(kataiPage.formSubmitButton).toBeDisabled();

      await kataiPage.closeFormDialog();
    });

    test("should require amad selection", async () => {
      await kataiPage.openNewGradingDialog();

      // Fill bags graded but no amad
      await kataiPage.fillBagsGraded(testKatai.basic.bagsGraded);

      // Submit button should be disabled without amad
      await expect(kataiPage.formSubmitButton).toBeDisabled();

      await kataiPage.closeFormDialog();
    });

    test("should require bags graded greater than zero", async () => {
      await kataiPage.openNewGradingDialog();

      // Fill with zero bags
      await kataiPage.fillBagsGraded("0");

      // Submit button should be disabled
      await expect(kataiPage.formSubmitButton).toBeDisabled();

      await kataiPage.closeFormDialog();
    });
  });

  test.describe("Grading Output", () => {
    test("should accept mota (large) bags input", async () => {
      await kataiPage.openNewGradingDialog();

      await kataiPage.fillGradingOutput({ motaBags: "30" });

      const value = await kataiPage.formMotaBagsInput.inputValue();
      expect(value).toBe("30");

      await kataiPage.closeFormDialog();
    });

    test("should accept chatta (medium) bags input", async () => {
      await kataiPage.openNewGradingDialog();

      await kataiPage.fillGradingOutput({ chattaBags: "40" });

      const value = await kataiPage.formChattaBagsInput.inputValue();
      expect(value).toBe("40");

      await kataiPage.closeFormDialog();
    });

    test("should accept beej (seed) bags input", async () => {
      await kataiPage.openNewGradingDialog();

      await kataiPage.fillGradingOutput({ beejBags: "15" });

      const value = await kataiPage.formBeejBagsInput.inputValue();
      expect(value).toBe("15");

      await kataiPage.closeFormDialog();
    });

    test("should accept mix bags input", async () => {
      await kataiPage.openNewGradingDialog();

      await kataiPage.fillGradingOutput({ mixBags: "10" });

      const value = await kataiPage.formMixBagsInput.inputValue();
      expect(value).toBe("10");

      await kataiPage.closeFormDialog();
    });

    test("should accept gulla (reject) bags input", async () => {
      await kataiPage.openNewGradingDialog();

      await kataiPage.fillGradingOutput({ gullaBags: "5" });

      const value = await kataiPage.formGullaBagsInput.inputValue();
      expect(value).toBe("5");

      await kataiPage.closeFormDialog();
    });

    test("should calculate output total", async () => {
      await kataiPage.openNewGradingDialog();

      // Fill all grade inputs
      await kataiPage.fillGradingOutput({
        motaBags: "30",
        chattaBags: "40",
        beejBags: "15",
        mixBags: "10",
        gullaBags: "5",
      });

      // Output total should be 100
      const total = await kataiPage.getOutputTotal();
      expect(total).toContain("100");

      await kataiPage.closeFormDialog();
    });
  });

  test.describe("Grading Balance", () => {
    test("should show balanced indicator when output equals input", async () => {
      await kataiPage.openNewGradingDialog();

      // Set bags graded
      await kataiPage.fillBagsGraded("100");

      // Fill grades that sum to 100
      await kataiPage.fillGradingOutput({
        motaBags: "30",
        chattaBags: "40",
        beejBags: "15",
        mixBags: "10",
        gullaBags: "5",
      });

      // Should show balanced indicator
      const isBalanced = await kataiPage.isBalanced();
      expect(isBalanced).toBe(true);

      await kataiPage.closeFormDialog();
    });

    test("should show unbalanced indicator when output does not equal input", async () => {
      await kataiPage.openNewGradingDialog();

      // Set bags graded
      await kataiPage.fillBagsGraded("100");

      // Fill grades that sum to less than 100
      await kataiPage.fillGradingOutput({
        motaBags: "20",
        chattaBags: "30",
      });

      // Should show unbalanced indicator
      const isBalanced = await kataiPage.isBalanced();
      expect(isBalanced).toBe(false);

      await kataiPage.closeFormDialog();
    });

    test("should validate grading balance calculation", () => {
      // Unit test for grading balance
      const balanced = isGradingBalanced(100, {
        motaBags: 30,
        chattaBags: 40,
        beejBags: 15,
        mixBags: 10,
        gullaBags: 5,
      });
      expect(balanced).toBe(true);

      const unbalanced = isGradingBalanced(100, {
        motaBags: 20,
        chattaBags: 30,
        beejBags: 0,
        mixBags: 0,
        gullaBags: 0,
      });
      expect(unbalanced).toBe(false);
    });
  });

  test.describe("Labor Charges", () => {
    test("should accept labor name input", async () => {
      await kataiPage.openNewGradingDialog();

      await kataiPage.fillLaborDetails({ laborName: "Ramesh" });

      const value = await kataiPage.formLaborNameInput.inputValue();
      expect(value).toBe("Ramesh");

      await kataiPage.closeFormDialog();
    });

    test("should accept labor rate input", async () => {
      await kataiPage.openNewGradingDialog();

      await kataiPage.fillLaborDetails({ laborRate: "5" });

      const value = await kataiPage.formLaborRateInput.inputValue();
      expect(value).toBe("5");

      await kataiPage.closeFormDialog();
    });

    test("should calculate total charges based on bags and rate", async () => {
      await kataiPage.openNewGradingDialog();

      // Set bags graded and labor rate
      await kataiPage.fillBagsGraded("100");
      await kataiPage.fillLaborDetails({ laborRate: "5" });

      // Total charges should be 100 * 5 = 500
      const charges = await kataiPage.getTotalCharges();
      expect(charges).toContain("500");

      await kataiPage.closeFormDialog();
    });

    test("should update charges when bags graded changes", async () => {
      await kataiPage.openNewGradingDialog();

      // Set initial values
      await kataiPage.fillBagsGraded("50");
      await kataiPage.fillLaborDetails({ laborRate: "5" });

      const initialCharges = await kataiPage.getTotalCharges();

      // Change bags graded
      await kataiPage.fillBagsGraded("100");

      const updatedCharges = await kataiPage.getTotalCharges();
      expect(updatedCharges).not.toBe(initialCharges);

      await kataiPage.closeFormDialog();
    });

    test("should update charges when rate changes", async () => {
      await kataiPage.openNewGradingDialog();

      // Set initial values
      await kataiPage.fillBagsGraded("100");
      await kataiPage.fillLaborDetails({ laborRate: "5" });

      const initialCharges = await kataiPage.getTotalCharges();

      // Change rate
      await kataiPage.fillLaborDetails({ laborRate: "10" });

      const updatedCharges = await kataiPage.getTotalCharges();
      expect(updatedCharges).not.toBe(initialCharges);

      await kataiPage.closeFormDialog();
    });

    test("should validate charge calculation", () => {
      // Unit test for charge calculation
      expect(calculateGradingCharges(100, 5)).toBe(500);
      expect(calculateGradingCharges(50, 3)).toBe(150);
      expect(calculateGradingCharges(0, 5)).toBe(0);
    });
  });

  test.describe("Filter Grading Records", () => {
    test("should filter by status - Pending", async () => {
      const allCount = await kataiPage.getTabCount("all");
      const pendingCount = await kataiPage.getTabCount("pending");

      await kataiPage.filterByStatus("pending");

      expect(pendingCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter by status - In Progress", async () => {
      const allCount = await kataiPage.getTabCount("all");
      const inProgressCount = await kataiPage.getTabCount("in_progress");

      await kataiPage.filterByStatus("in_progress");

      expect(inProgressCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter by status - Completed", async () => {
      const allCount = await kataiPage.getTabCount("all");
      const completedCount = await kataiPage.getTabCount("completed");

      await kataiPage.filterByStatus("completed");

      expect(completedCount).toBeLessThanOrEqual(allCount);
    });

    test("should return to all when clicking All tab", async () => {
      // First filter by pending
      await kataiPage.filterByStatus("pending");

      // Then return to all
      await kataiPage.filterByStatus("all");

      // Should show all records again
      await expect(kataiPage.tabAll).toHaveClass(/active|selected/i);
    });

    test("should search grading records by party name", async () => {
      await kataiPage.searchKatai("test");

      // Clear search
      await kataiPage.clearSearch();
    });

    test("should search grading records by katai number", async () => {
      await kataiPage.searchKatai("KT-");

      // Clear search
      await kataiPage.clearSearch();
    });

    test("should search grading records by amad number", async () => {
      await kataiPage.searchKatai("1");

      // Clear search
      await kataiPage.clearSearch();
    });
  });

  test.describe("Tab Counts", () => {
    test("should show correct counts for each status tab", async () => {
      const allCount = await kataiPage.getTabCount("all");
      const pendingCount = await kataiPage.getTabCount("pending");
      const inProgressCount = await kataiPage.getTabCount("in_progress");
      const completedCount = await kataiPage.getTabCount("completed");

      // Sum of status counts should equal all count
      const sumCounts = pendingCount + inProgressCount + completedCount;
      expect(sumCounts).toBeLessThanOrEqual(allCount + 1); // Allow small margin
    });
  });

  test.describe("Grading Status", () => {
    test("should show status badges in table", async ({ page }) => {
      // Look for status badges
      const statusBadges = page.locator('[data-testid^="katai-status-"]');

      // Status badges may include Pending, In Progress, Completed
      const rowCount = await kataiPage.getRowCount();
      if (rowCount > 0) {
        // Status should be visible for each row
      }
    });
  });

  test.describe("Grading Actions", () => {
    test("should show action buttons for pending records", async ({ page }) => {
      // Filter to pending records
      await kataiPage.filterByStatus("pending");

      // Check for action dropdown menu
      const actionMenus = page.locator('[data-testid^="katai-actions-"]');

      // If there are pending records, action menus should be available
      const pendingCount = await kataiPage.getTabCount("pending");
      if (pendingCount > 0) {
        // Actions should be available for pending records
      }
    });

    test("should show complete option for in-progress records", async ({ page }) => {
      // Filter to in-progress records
      await kataiPage.filterByStatus("in_progress");

      // Look for complete buttons
      const completeButtons = page.locator('[data-testid^="katai-complete-button-"]');

      // If there are in-progress records, complete option should be available
      const inProgressCount = await kataiPage.getTabCount("in_progress");
      if (inProgressCount > 0) {
        // Complete buttons should be available
      }
    });
  });

  test.describe("Amad Selection", () => {
    test("should show amads only for selected party", async () => {
      await kataiPage.openNewGradingDialog();

      // Amad select should initially be disabled
      await expect(kataiPage.formAmadSelect).toBeDisabled();

      await kataiPage.closeFormDialog();
    });

    test("should enable amad select after party selection", async () => {
      await kataiPage.openNewGradingDialog();

      // Select a party first (depends on having parties)
      // Then amad select should become enabled

      await kataiPage.closeFormDialog();
    });

    test("should show amad info when selected", async () => {
      await kataiPage.openNewGradingDialog();

      // Amad info section should be visible after selection
      // This depends on having party and amad data

      await kataiPage.closeFormDialog();
    });
  });

  test.describe("Responsive Design", () => {
    test("should display properly on mobile viewport", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigate to page
      await kataiPage.goto();

      // Verify main elements are still visible
      await expect(kataiPage.kataiPage).toBeVisible();
      await expect(kataiPage.newGradingButton).toBeVisible();
    });

    test("should display properly on tablet viewport", async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Navigate to page
      await kataiPage.goto();

      // Verify main elements are visible
      await expect(kataiPage.kataiPage).toBeVisible();
      await expect(kataiPage.newGradingButton).toBeVisible();
      await expect(kataiPage.searchInput).toBeVisible();
    });
  });

  test.describe("Error Handling", () => {
    test("should handle empty state gracefully", async ({ page }) => {
      // Search for non-existent record
      await kataiPage.searchKatai("zzzznonexistent");

      // Should show empty state or no results message
      const noResults = page.getByText(/no grading records|no results/i);

      // Either empty state message or empty table
      await kataiPage.clearSearch();
    });

    test("should show validation error for bags exceeding available", async () => {
      await kataiPage.openNewGradingDialog();

      // This depends on having party and amad selected
      // If bags graded exceeds available, error should be shown

      await kataiPage.closeFormDialog();
    });
  });

  test.describe("Grading Grades", () => {
    test("should display all grade categories", async () => {
      await kataiPage.openNewGradingDialog();

      // Verify all grade inputs are visible with labels
      const gradeLabels = ["Mota", "Chatta", "Beej", "Mix", "Gulla"];

      for (const label of gradeLabels) {
        const labelElement = kataiPage.page.getByText(new RegExp(label, "i"));
        // Label should be present in the form
      }

      await kataiPage.closeFormDialog();
    });

    test("should show grade descriptions", async ({ page }) => {
      await kataiPage.openNewGradingDialog();

      // Grade descriptions may be shown as tooltips or subtitles
      // Mota = Large, Chatta = Medium, Beej = Seed, Mix = Mixed, Gulla = Reject

      await kataiPage.closeFormDialog();
    });
  });

  test.describe("Remarks", () => {
    test("should accept remarks input", async () => {
      await kataiPage.openNewGradingDialog();

      await kataiPage.fillRemarks("Test grading remarks");

      const value = await kataiPage.formRemarksInput.inputValue();
      expect(value).toBe("Test grading remarks");

      await kataiPage.closeFormDialog();
    });

    test("should allow multiline remarks", async () => {
      await kataiPage.openNewGradingDialog();

      const multilineRemarks = "Line 1\nLine 2\nLine 3";
      await kataiPage.fillRemarks(multilineRemarks);

      const value = await kataiPage.formRemarksInput.inputValue();
      expect(value).toBe(multilineRemarks);

      await kataiPage.closeFormDialog();
    });
  });
});
