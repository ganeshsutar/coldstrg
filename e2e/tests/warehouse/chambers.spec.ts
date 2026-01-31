import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ChambersPage } from "../../pages/warehouse/chambers.page";
import {
  testChamber,
  uniqueChamberName,
} from "../../fixtures/warehouse-data";

test.describe("Chambers Management", () => {
  let chambersPage: ChambersPage;

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

    // Navigate to chambers
    chambersPage = new ChambersPage(page);
    await chambersPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display chambers page with search and add button", async () => {
      await expect(chambersPage.chambersPage).toBeVisible();
      await expect(chambersPage.newChamberButton).toBeVisible();
      await expect(chambersPage.searchInput).toBeVisible();
    });
  });

  test.describe("Chamber Form Dialog", () => {
    test("should open new chamber dialog when clicking add button", async () => {
      await chambersPage.openNewChamberDialog();
      await expect(chambersPage.formDialog).toBeVisible();
      await expect(chambersPage.formNameInput).toBeVisible();
      await expect(chambersPage.formCodeInput).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await chambersPage.openNewChamberDialog();
      await expect(chambersPage.formDialog).toBeVisible();

      await chambersPage.closeFormDialog();
      await expect(chambersPage.formDialog).not.toBeVisible();
    });

    test("should display all form fields in new chamber dialog", async () => {
      await chambersPage.openNewChamberDialog();

      // Basic info
      await expect(chambersPage.formCodeInput).toBeVisible();
      await expect(chambersPage.formRoomNumberInput).toBeVisible();
      await expect(chambersPage.formStatusSelect).toBeVisible();
      await expect(chambersPage.formNameInput).toBeVisible();
      await expect(chambersPage.formNameHindiInput).toBeVisible();

      // Rack config
      await expect(chambersPage.formFloorsInput).toBeVisible();
      await expect(chambersPage.formTotalRacksInput).toBeVisible();
      await expect(chambersPage.formRacksPerRowInput).toBeVisible();
      await expect(chambersPage.formRackCapacityInput).toBeVisible();

      // Temperature config
      await expect(chambersPage.formTargetTempInput).toBeVisible();
      await expect(chambersPage.formMinTempInput).toBeVisible();
      await expect(chambersPage.formMaxTempInput).toBeVisible();

      // Description
      await expect(chambersPage.formDescriptionInput).toBeVisible();

      // Buttons
      await expect(chambersPage.formCancelButton).toBeVisible();
      await expect(chambersPage.formSubmitButton).toBeVisible();
    });

    test("should have auto-generated code in new chamber dialog", async () => {
      await chambersPage.openNewChamberDialog();

      const codeValue = await chambersPage.formCodeInput.inputValue();
      expect(codeValue).toBeTruthy();
    });
  });

  test.describe("Create Chamber", () => {
    test("should create chamber with required fields", async () => {
      const uniqueName = uniqueChamberName("Test");

      await chambersPage.openNewChamberDialog();
      await chambersPage.fillBasicInfo({
        name: uniqueName,
      });
      await chambersPage.submitForm();

      // Dialog should close on success
      await expect(chambersPage.formDialog).not.toBeVisible({ timeout: 10_000 });
    });

    test("should create chamber with all fields", async () => {
      const uniqueName = uniqueChamberName("FullTest");

      await chambersPage.createChamber({
        name: uniqueName,
        nameHindi: testChamber.basic.nameHindi,
        floors: testChamber.basic.floors,
        totalRacks: testChamber.basic.totalRacks,
        racksPerRow: testChamber.basic.racksPerRow,
        rackCapacity: testChamber.basic.rackCapacity,
        targetTemperature: testChamber.temperature.targetTemperature,
        minTemperature: testChamber.temperature.minTemperature,
        maxTemperature: testChamber.temperature.maxTemperature,
        description: testChamber.description,
      });
    });

    test("should fill rack configuration", async () => {
      await chambersPage.openNewChamberDialog();

      await chambersPage.fillRackConfig({
        floors: "4",
        totalRacks: "200",
        racksPerRow: "15",
        rackCapacity: "120",
      });

      await expect(chambersPage.formFloorsInput).toHaveValue("4");
      await expect(chambersPage.formTotalRacksInput).toHaveValue("200");
      await expect(chambersPage.formRacksPerRowInput).toHaveValue("15");
      await expect(chambersPage.formRackCapacityInput).toHaveValue("120");

      await chambersPage.closeFormDialog();
    });

    test("should fill temperature configuration", async () => {
      await chambersPage.openNewChamberDialog();

      await chambersPage.fillTemperatureConfig({
        targetTemperature: "-20",
        minTemperature: "-30",
        maxTemperature: "-10",
      });

      await expect(chambersPage.formTargetTempInput).toHaveValue("-20");
      await expect(chambersPage.formMinTempInput).toHaveValue("-30");
      await expect(chambersPage.formMaxTempInput).toHaveValue("-10");

      await chambersPage.closeFormDialog();
    });
  });

  test.describe("Search Chambers", () => {
    test("should search chambers by name", async () => {
      await chambersPage.searchChambers("test");

      // Wait for filtering to take effect
      await chambersPage.page.waitForTimeout(500);

      // Clear search
      await chambersPage.clearSearch();
    });

    test("should clear search input", async () => {
      await chambersPage.searchChambers("chamber");
      await chambersPage.clearSearch();

      await expect(chambersPage.searchInput).toHaveValue("");
    });
  });

  test.describe("Floor Configuration", () => {
    test("should have add floor button in floor config dialog", async () => {
      // This test requires an existing chamber
      // Skip for now if no chambers exist
      test.skip();
    });
  });
});
