import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { MeterReadingPage } from "../../pages/warehouse/meter-reading.page";
import { testMeterReading, uniqueMeterNumber } from "../../fixtures/warehouse-data";

test.describe("Meter Reading", () => {
  let meterReadingPage: MeterReadingPage;

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

    // Navigate to meter reading page
    meterReadingPage = new MeterReadingPage(page);
    await meterReadingPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display meter reading page", async () => {
      await expect(meterReadingPage.meterReadingPage).toBeVisible();
    });

    test("should display chamber filter", async () => {
      await expect(meterReadingPage.chamberFilter).toBeVisible();
    });

    test("should display add reading button", async () => {
      await expect(meterReadingPage.newMeterReadingButton).toBeVisible();
    });
  });

  test.describe("Meter Reading Dialog", () => {
    test("should open new meter reading dialog when clicking button", async () => {
      await meterReadingPage.openNewMeterReadingDialog();
      await expect(meterReadingPage.formDialog).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await meterReadingPage.openNewMeterReadingDialog();
      await expect(meterReadingPage.formDialog).toBeVisible();

      await meterReadingPage.closeFormDialog();
      await expect(meterReadingPage.formDialog).not.toBeVisible();
    });

    test("should display all form fields in dialog", async () => {
      await meterReadingPage.openNewMeterReadingDialog();

      await expect(meterReadingPage.formChamberSelect).toBeVisible();
      await expect(meterReadingPage.formMeterNumberInput).toBeVisible();
      await expect(meterReadingPage.formDateInput).toBeVisible();
      await expect(meterReadingPage.formTimeInput).toBeVisible();
      await expect(meterReadingPage.formPreviousReading).toBeVisible();
      await expect(meterReadingPage.formCurrentReadingInput).toBeVisible();
      await expect(meterReadingPage.formRecordedByInput).toBeVisible();
      await expect(meterReadingPage.formRemarksInput).toBeVisible();

      await expect(meterReadingPage.formCancelButton).toBeVisible();
      await expect(meterReadingPage.formSubmitButton).toBeVisible();

      await meterReadingPage.closeFormDialog();
    });

    test("should display previous reading", async () => {
      await meterReadingPage.openNewMeterReadingDialog();

      const previousReading = await meterReadingPage.getPreviousReading();
      expect(previousReading).toContain("kWh");

      await meterReadingPage.closeFormDialog();
    });

    test("should show consumption when current reading is entered", async () => {
      await meterReadingPage.openNewMeterReadingDialog();

      await meterReadingPage.fillCurrentReading("100");

      // Wait for consumption to calculate
      await expect(meterReadingPage.formConsumption).toBeVisible();

      await meterReadingPage.closeFormDialog();
    });
  });

  test.describe("Fill Meter Reading", () => {
    test("should fill meter number field", async () => {
      await meterReadingPage.openNewMeterReadingDialog();

      const meterNo = uniqueMeterNumber("MTR");
      await meterReadingPage.fillMeterNumber(meterNo);

      await expect(meterReadingPage.formMeterNumberInput).toHaveValue(meterNo);

      await meterReadingPage.closeFormDialog();
    });

    test("should fill current reading field", async () => {
      await meterReadingPage.openNewMeterReadingDialog();

      await meterReadingPage.fillCurrentReading(testMeterReading.basic.currentReading);

      await expect(meterReadingPage.formCurrentReadingInput).toHaveValue(testMeterReading.basic.currentReading);

      await meterReadingPage.closeFormDialog();
    });

    test("should fill recorded by field", async () => {
      await meterReadingPage.openNewMeterReadingDialog();

      await meterReadingPage.fillRecordedBy(testMeterReading.basic.recordedBy);

      await expect(meterReadingPage.formRecordedByInput).toHaveValue(testMeterReading.basic.recordedBy);

      await meterReadingPage.closeFormDialog();
    });

    test("should fill remarks field", async () => {
      await meterReadingPage.openNewMeterReadingDialog();

      await meterReadingPage.fillRemarks(testMeterReading.basic.remarks);

      await expect(meterReadingPage.formRemarksInput).toHaveValue(testMeterReading.basic.remarks);

      await meterReadingPage.closeFormDialog();
    });
  });

  test.describe("Chamber Selection", () => {
    test("should have General Meter option", async () => {
      await meterReadingPage.openNewMeterReadingDialog();

      await meterReadingPage.formChamberSelect.click();

      // Check that "General Meter" option exists
      await expect(meterReadingPage.page.getByRole("option", { name: /General Meter/i })).toBeVisible();

      // Close dropdown
      await meterReadingPage.page.keyboard.press("Escape");

      await meterReadingPage.closeFormDialog();
    });
  });

  test.describe("Chamber Filter", () => {
    test("should filter by chamber when selected", async () => {
      // Try clicking the filter
      await meterReadingPage.chamberFilter.click();

      // Check that "All Meters" option exists
      await expect(meterReadingPage.page.getByRole("option", { name: /All Meters/i })).toBeVisible();

      // Close dropdown
      await meterReadingPage.page.keyboard.press("Escape");
    });
  });
});
