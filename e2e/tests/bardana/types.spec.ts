import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { TypesPage } from "../../pages/bardana/types.page";
import { uniqueCode, uniqueName } from "../../fixtures/bardana-data";

test.describe("Bardana Types", () => {
  let typesPage: TypesPage;

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

    // Navigate to bardana types
    typesPage = new TypesPage(page);
    await typesPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display types page with add button and search", async () => {
      // Verify main page elements
      await expect(typesPage.typesPage).toBeVisible();
      await expect(typesPage.addTypeButton).toBeVisible();
      await expect(typesPage.searchInput).toBeVisible();
    });
  });

  test.describe("Type Form Dialog", () => {
    test("should open add type dialog when clicking add button", async () => {
      await typesPage.openAddTypeDialog();
      await expect(typesPage.formDialog).toBeVisible();
      await expect(typesPage.formCodeInput).toBeVisible();
      await expect(typesPage.formNameInput).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await typesPage.openAddTypeDialog();
      await expect(typesPage.formDialog).toBeVisible();

      await typesPage.closeFormDialog();
      await expect(typesPage.formDialog).not.toBeVisible();
    });

    test("should display all form fields", async () => {
      await typesPage.openAddTypeDialog();

      await expect(typesPage.formCodeInput).toBeVisible();
      await expect(typesPage.formNameInput).toBeVisible();
      await expect(typesPage.formNameHindiInput).toBeVisible();
      await expect(typesPage.formRateInput).toBeVisible();
      await expect(typesPage.formUnitInput).toBeVisible();
      await expect(typesPage.formOpeningStockInput).toBeVisible();
      await expect(typesPage.formSubmitButton).toBeVisible();

      await typesPage.closeFormDialog();
    });
  });

  test.describe("Create Type", () => {
    test("should create a new bardana type", async () => {
      const testCode = uniqueCode("TEST");
      const testName = uniqueName("Test Bags");

      await typesPage.openAddTypeDialog();
      await typesPage.fillTypeForm({
        code: testCode,
        name: testName,
        rate: "20",
        unit: "bags",
        openingStock: "100",
      });

      await typesPage.submitForm();

      // Dialog should close on success
      await expect(typesPage.formDialog).not.toBeVisible({ timeout: 10_000 });
    });
  });

  test.describe("Search Types", () => {
    test("should search types by code or name", async () => {
      await typesPage.searchType("test");

      // Clear search
      await typesPage.clearSearch();
    });
  });
});
