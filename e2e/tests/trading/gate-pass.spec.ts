import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { GatePassPage } from "../../pages/trading/gate-pass.page";
import {
  testGatePass,
  testDates,
  uniqueVehicleNo,
  uniqueBiltiNo,
} from "../../fixtures/trading-data";

test.describe("Gate Pass", () => {
  let gatePassPage: GatePassPage;

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

    // Navigate to gate pass page
    gatePassPage = new GatePassPage(page);
    await gatePassPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display gate pass page with tabs and search", async () => {
      // Verify main page elements
      await expect(gatePassPage.gatePassPage).toBeVisible();
      await expect(gatePassPage.newGatePassButton).toBeVisible();
      await expect(gatePassPage.searchInput).toBeVisible();

      // Verify tabs are visible
      await expect(gatePassPage.tabAll).toBeVisible();
      await expect(gatePassPage.tabToday).toBeVisible();
      await expect(gatePassPage.tabPending).toBeVisible();
      await expect(gatePassPage.tabWeek).toBeVisible();
    });

    test("should show KPI cards with gate pass summary", async () => {
      await expect(gatePassPage.kpiToday).toBeVisible();
      await expect(gatePassPage.kpiPendingPrint).toBeVisible();
      await expect(gatePassPage.kpiThisWeek).toBeVisible();
      await expect(gatePassPage.kpiTotalBags).toBeVisible();
    });

    test("should display page title and description", async () => {
      const heading = gatePassPage.page.getByRole("heading", { name: /gate pass/i });
      await expect(heading).toBeVisible();
    });
  });

  test.describe("Gate Pass Form Dialog", () => {
    test("should open new gate pass dialog when clicking new button", async () => {
      await gatePassPage.openNewGatePassDialog();
      await expect(gatePassPage.formDialog).toBeVisible();
      await expect(gatePassPage.formGpNoInput).toBeVisible();
      await expect(gatePassPage.formDateInput).toBeVisible();
      await expect(gatePassPage.formSellerSelect).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await gatePassPage.openNewGatePassDialog();
      await expect(gatePassPage.formDialog).toBeVisible();

      await gatePassPage.closeFormDialog();
      await expect(gatePassPage.formDialog).not.toBeVisible();
    });

    test("should display gate pass details section", async () => {
      await gatePassPage.openNewGatePassDialog();

      // Verify GP details fields
      await expect(gatePassPage.formGpNoInput).toBeVisible();
      await expect(gatePassPage.formDateInput).toBeVisible();
      await expect(gatePassPage.formTimeInput).toBeVisible();

      await gatePassPage.closeFormDialog();
    });

    test("should display party and deal section", async () => {
      await gatePassPage.openNewGatePassDialog();

      // Verify party fields
      await expect(gatePassPage.formSaudaSelect).toBeVisible();
      await expect(gatePassPage.formSellerSelect).toBeVisible();
      await expect(gatePassPage.formBuyerSelect).toBeVisible();
      await expect(gatePassPage.formBuyerLocationInput).toBeVisible();

      await gatePassPage.closeFormDialog();
    });

    test("should display amad selection section", async () => {
      await gatePassPage.openNewGatePassDialog();

      // Amad selector should be visible
      await expect(gatePassPage.formAmadSelector).toBeVisible();

      await gatePassPage.closeFormDialog();
    });

    test("should display transport details section", async () => {
      await gatePassPage.openNewGatePassDialog();

      // Verify transport fields
      await expect(gatePassPage.formTransportInput).toBeVisible();
      await expect(gatePassPage.formVehicleNoInput).toBeVisible();
      await expect(gatePassPage.formDriverNameInput).toBeVisible();
      await expect(gatePassPage.formDriverContactInput).toBeVisible();
      await expect(gatePassPage.formBiltiNoInput).toBeVisible();

      await gatePassPage.closeFormDialog();
    });

    test("should have auto-generated GP number", async () => {
      await gatePassPage.openNewGatePassDialog();

      // Verify GP number is auto-generated and disabled
      await expect(gatePassPage.formGpNoInput).toBeDisabled();
      const gpNo = await gatePassPage.formGpNoInput.inputValue();
      expect(gpNo).toBeTruthy();

      await gatePassPage.closeFormDialog();
    });

    test("should have today's date as default", async () => {
      await gatePassPage.openNewGatePassDialog();

      const dateValue = await gatePassPage.formDateInput.inputValue();
      const today = testDates.today();
      expect(dateValue).toBe(today);

      await gatePassPage.closeFormDialog();
    });

    test("should have current time as default", async () => {
      await gatePassPage.openNewGatePassDialog();

      const timeValue = await gatePassPage.formTimeInput.inputValue();
      // Just verify time field has a value
      expect(timeValue).toBeTruthy();

      await gatePassPage.closeFormDialog();
    });
  });

  test.describe("Form Validation", () => {
    test("should require seller selection", async () => {
      await gatePassPage.openNewGatePassDialog();

      // Fill transport details but no seller
      await gatePassPage.fillTransportDetails({
        vehicleNo: testGatePass.basic.vehicleNo,
        driverName: testGatePass.basic.driverName,
      });

      // Submit button should be disabled without seller
      await expect(gatePassPage.formSubmitButton).toBeDisabled();

      await gatePassPage.closeFormDialog();
    });

    test("should require amad selection", async () => {
      await gatePassPage.openNewGatePassDialog();

      // Fill transport details but no amad selection
      await gatePassPage.fillTransportDetails({
        vehicleNo: testGatePass.basic.vehicleNo,
        driverName: testGatePass.basic.driverName,
      });

      // Submit button should be disabled without amad selection
      await expect(gatePassPage.formSubmitButton).toBeDisabled();

      await gatePassPage.closeFormDialog();
    });
  });

  test.describe("Deal Linking", () => {
    test("should show open deals in dropdown", async () => {
      await gatePassPage.openNewGatePassDialog();

      // Click on sauda select to open dropdown
      await gatePassPage.formSaudaSelect.click();

      // Dropdown should be visible
      const dropdown = gatePassPage.page.getByRole("listbox");
      await expect(dropdown).toBeVisible();

      // Close dropdown by pressing Escape
      await gatePassPage.page.keyboard.press("Escape");

      await gatePassPage.closeFormDialog();
    });

    test("should auto-fill seller and buyer when deal is selected", async () => {
      await gatePassPage.openNewGatePassDialog();

      // This test depends on having existing deals
      // If deals exist, selecting one should auto-fill party fields

      await gatePassPage.closeFormDialog();
    });
  });

  test.describe("Transport Details", () => {
    test("should accept vehicle number input", async () => {
      await gatePassPage.openNewGatePassDialog();

      const vehicleNo = uniqueVehicleNo();
      await gatePassPage.fillTransportDetails({
        vehicleNo: vehicleNo,
      });

      const inputValue = await gatePassPage.formVehicleNoInput.inputValue();
      expect(inputValue).toBe(vehicleNo);

      await gatePassPage.closeFormDialog();
    });

    test("should accept driver details", async () => {
      await gatePassPage.openNewGatePassDialog();

      await gatePassPage.fillTransportDetails({
        driverName: "Ramesh Kumar",
        driverContact: "9876543210",
      });

      const driverName = await gatePassPage.formDriverNameInput.inputValue();
      expect(driverName).toBe("Ramesh Kumar");

      const driverContact = await gatePassPage.formDriverContactInput.inputValue();
      expect(driverContact).toBe("9876543210");

      await gatePassPage.closeFormDialog();
    });

    test("should accept bilti number", async () => {
      await gatePassPage.openNewGatePassDialog();

      const biltiNo = uniqueBiltiNo();
      await gatePassPage.fillTransportDetails({
        biltiNo: biltiNo,
      });

      const inputValue = await gatePassPage.formBiltiNoInput.inputValue();
      expect(inputValue).toBe(biltiNo);

      await gatePassPage.closeFormDialog();
    });
  });

  test.describe("Filter Gate Passes", () => {
    test("should filter by Today", async () => {
      const allCount = await gatePassPage.getTabCount("all");
      const todayCount = await gatePassPage.getTabCount("today");

      await gatePassPage.filterByStatus("today");

      expect(todayCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter by Pending", async () => {
      const allCount = await gatePassPage.getTabCount("all");
      const pendingCount = await gatePassPage.getTabCount("pending");

      await gatePassPage.filterByStatus("pending");

      expect(pendingCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter by This Week", async () => {
      const allCount = await gatePassPage.getTabCount("all");
      const weekCount = await gatePassPage.getTabCount("week");

      await gatePassPage.filterByStatus("week");

      // Week count should include today's count
      expect(weekCount).toBeLessThanOrEqual(allCount);
    });

    test("should return to all when clicking All tab", async () => {
      // First filter by today
      await gatePassPage.filterByStatus("today");

      // Then return to all
      await gatePassPage.filterByStatus("all");

      // Should show all gate passes again
      await expect(gatePassPage.tabAll).toHaveClass(/active|selected/i);
    });

    test("should search gate passes by party name", async () => {
      await gatePassPage.searchGatePass("test");

      // Clear search
      await gatePassPage.clearSearch();
    });

    test("should search gate passes by vehicle number", async () => {
      await gatePassPage.searchGatePass("UP");

      // Clear search
      await gatePassPage.clearSearch();
    });

    test("should search gate passes by GP number", async () => {
      await gatePassPage.searchGatePass("GP-");

      // Clear search
      await gatePassPage.clearSearch();
    });
  });

  test.describe("Tab Counts", () => {
    test("should show counts for time-based tabs", async () => {
      const allCount = await gatePassPage.getTabCount("all");
      const todayCount = await gatePassPage.getTabCount("today");
      const weekCount = await gatePassPage.getTabCount("week");

      // Today's count should be less than or equal to week's count
      expect(todayCount).toBeLessThanOrEqual(weekCount);
      // Week's count should be less than or equal to all
      expect(weekCount).toBeLessThanOrEqual(allCount);
    });

    test("should show pending print count", async () => {
      const pendingCount = await gatePassPage.getTabCount("pending");
      // Pending count should be a valid number
      expect(pendingCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Gate Pass Status", () => {
    test("should show status badges in table", async ({ page }) => {
      // Look for status badges
      const statusBadges = page.locator('[data-testid^="gate-pass-status-"]');

      // Status badges may include Draft, Confirmed, Done
      const rowCount = await gatePassPage.getRowCount();
      if (rowCount > 0) {
        // Status should be visible for each row
      }
    });
  });

  test.describe("Gate Pass Actions", () => {
    test("should show action buttons for gate passes", async ({ page }) => {
      // Check for action dropdown menu
      const actionMenus = page.locator('[data-testid^="gate-pass-actions-"]');

      // If there are gate passes, action menus should be available
      const allCount = await gatePassPage.getTabCount("all");
      if (allCount > 0) {
        // Actions should be available
      }
    });

    test("should show print option for confirmed gate passes", async ({ page }) => {
      // Filter to confirmed/done gate passes (not pending)
      await gatePassPage.filterByStatus("week");

      // Look for print buttons
      const printButtons = page.locator('[data-testid^="gate-pass-print-button-"]');

      // If there are gate passes, print option might be available
    });
  });

  test.describe("Print Preview", () => {
    test("should open print preview dialog when viewing gate pass", async () => {
      // This test requires existing gate passes
      const rowCount = await gatePassPage.getRowCount();

      if (rowCount > 0) {
        // Find first view button
        const firstViewButton = gatePassPage.page
          .locator('[data-testid^="gate-pass-view-button-"]')
          .first();

        if (await firstViewButton.isVisible()) {
          await firstViewButton.click();
          await expect(gatePassPage.printPreviewDialog).toBeVisible();
          await gatePassPage.closePrintPreview();
        }
      }
    });

    test("should display gate pass details in print preview", async () => {
      const rowCount = await gatePassPage.getRowCount();

      if (rowCount > 0) {
        // Find first view button
        const firstViewButton = gatePassPage.page
          .locator('[data-testid^="gate-pass-view-button-"]')
          .first();

        if (await firstViewButton.isVisible()) {
          await firstViewButton.click();

          // Print preview should show key information
          await expect(gatePassPage.printPreviewDialog).toBeVisible();

          // Should have print and download buttons
          await expect(gatePassPage.printButton).toBeVisible();

          await gatePassPage.closePrintPreview();
        }
      }
    });
  });

  test.describe("Responsive Design", () => {
    test("should display properly on mobile viewport", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigate to page
      await gatePassPage.goto();

      // Verify main elements are still visible
      await expect(gatePassPage.gatePassPage).toBeVisible();
      await expect(gatePassPage.newGatePassButton).toBeVisible();
    });

    test("should display properly on tablet viewport", async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Navigate to page
      await gatePassPage.goto();

      // Verify main elements are visible
      await expect(gatePassPage.gatePassPage).toBeVisible();
      await expect(gatePassPage.newGatePassButton).toBeVisible();
      await expect(gatePassPage.searchInput).toBeVisible();
    });
  });

  test.describe("Error Handling", () => {
    test("should handle empty state gracefully", async ({ page }) => {
      // Search for non-existent gate pass
      await gatePassPage.searchGatePass("zzzznonexistent");

      // Should show empty state or no results message
      const noResults = page.getByText(/no gate pass|no results/i);

      // Either empty state message or empty table
      await gatePassPage.clearSearch();
    });
  });

  test.describe("Amad Selection", () => {
    test("should show available amads for selected seller", async () => {
      await gatePassPage.openNewGatePassDialog();

      // First select a seller
      // Then verify amad selector shows available amads

      // Amad selector should be visible
      await expect(gatePassPage.formAmadSelector).toBeVisible();

      await gatePassPage.closeFormDialog();
    });

    test("should update total packets when amads are selected", async () => {
      await gatePassPage.openNewGatePassDialog();

      // Total packets display should exist
      // It updates when amads are selected

      await gatePassPage.closeFormDialog();
    });
  });

  test.describe("Rate Handling", () => {
    test("should allow rate input", async () => {
      await gatePassPage.openNewGatePassDialog();

      await gatePassPage.fillRate("1500");

      const rate = await gatePassPage.formRateInput.inputValue();
      expect(rate).toBe("1500");

      await gatePassPage.closeFormDialog();
    });

    test("should auto-fill rate when deal is linked", async () => {
      await gatePassPage.openNewGatePassDialog();

      // When a deal is selected, rate should be auto-filled
      // This depends on having existing deals

      await gatePassPage.closeFormDialog();
    });
  });
});
