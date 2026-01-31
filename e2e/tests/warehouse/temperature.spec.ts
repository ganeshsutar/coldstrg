import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { TemperaturePage } from "../../pages/warehouse/temperature.page";
import { testTemperature } from "../../fixtures/warehouse-data";

test.describe("Temperature Monitoring", () => {
  let temperaturePage: TemperaturePage;

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

    // Navigate to temperature page
    temperaturePage = new TemperaturePage(page);
    await temperaturePage.goto();
  });

  test.describe("Page Display", () => {
    test("should display temperature page", async () => {
      await expect(temperaturePage.temperaturePage).toBeVisible();
    });

    test("should display chamber filter", async () => {
      await expect(temperaturePage.chamberFilter).toBeVisible();
    });

    test("should display log reading button", async () => {
      await expect(temperaturePage.newTempLogButton).toBeVisible();
    });
  });

  test.describe("Temperature Log Dialog", () => {
    test("should open new temperature log dialog when clicking button", async () => {
      await temperaturePage.openNewTempLogDialog();
      await expect(temperaturePage.formDialog).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await temperaturePage.openNewTempLogDialog();
      await expect(temperaturePage.formDialog).toBeVisible();

      await temperaturePage.closeFormDialog();
      await expect(temperaturePage.formDialog).not.toBeVisible();
    });

    test("should display all form fields in dialog", async () => {
      await temperaturePage.openNewTempLogDialog();

      await expect(temperaturePage.formChamberSelect).toBeVisible();
      await expect(temperaturePage.formDateInput).toBeVisible();
      await expect(temperaturePage.formTimeInput).toBeVisible();
      await expect(temperaturePage.formLowTempInput).toBeVisible();
      await expect(temperaturePage.formHighTempInput).toBeVisible();
      await expect(temperaturePage.formHumidityInput).toBeVisible();
      await expect(temperaturePage.formRecordedByInput).toBeVisible();
      await expect(temperaturePage.formRemarksInput).toBeVisible();

      await expect(temperaturePage.formCancelButton).toBeVisible();
      await expect(temperaturePage.formSubmitButton).toBeVisible();

      await temperaturePage.closeFormDialog();
    });

    test("should require low and high temperature fields", async () => {
      await temperaturePage.openNewTempLogDialog();

      // Low temp should be required
      await expect(temperaturePage.formLowTempInput).toHaveAttribute("required");

      // High temp should be required
      await expect(temperaturePage.formHighTempInput).toHaveAttribute("required");

      await temperaturePage.closeFormDialog();
    });
  });

  test.describe("Fill Temperature Log", () => {
    test("should fill temperature readings", async () => {
      await temperaturePage.openNewTempLogDialog();

      await temperaturePage.fillTemperatureReadings({
        lowTemp: testTemperature.basic.lowTemp,
        highTemp: testTemperature.basic.highTemp,
      });

      await expect(temperaturePage.formLowTempInput).toHaveValue(testTemperature.basic.lowTemp);
      await expect(temperaturePage.formHighTempInput).toHaveValue(testTemperature.basic.highTemp);

      await temperaturePage.closeFormDialog();
    });

    test("should fill humidity field", async () => {
      await temperaturePage.openNewTempLogDialog();

      await temperaturePage.fillHumidity(testTemperature.basic.humidity);

      await expect(temperaturePage.formHumidityInput).toHaveValue(testTemperature.basic.humidity);

      await temperaturePage.closeFormDialog();
    });

    test("should fill recorded by field", async () => {
      await temperaturePage.openNewTempLogDialog();

      await temperaturePage.fillRecordedBy(testTemperature.basic.recordedBy);

      await expect(temperaturePage.formRecordedByInput).toHaveValue(testTemperature.basic.recordedBy);

      await temperaturePage.closeFormDialog();
    });

    test("should fill remarks field", async () => {
      await temperaturePage.openNewTempLogDialog();

      await temperaturePage.fillRemarks(testTemperature.basic.remarks);

      await expect(temperaturePage.formRemarksInput).toHaveValue(testTemperature.basic.remarks);

      await temperaturePage.closeFormDialog();
    });
  });

  test.describe("Chamber Filter", () => {
    test("should filter by chamber when selected", async () => {
      // Try clicking the filter - if chambers exist, they should appear
      await temperaturePage.chamberFilter.click();

      // Check that "All Chambers" option exists
      await expect(temperaturePage.page.getByRole("option", { name: /All Chambers/i })).toBeVisible();

      // Close dropdown by clicking elsewhere
      await temperaturePage.page.keyboard.press("Escape");
    });
  });
});
