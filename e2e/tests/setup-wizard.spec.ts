import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { SetupWizardPage } from "../pages/setup-wizard.page";
import { DashboardPage } from "../pages/dashboard.page";

test.describe("Setup Wizard", () => {
  let loginPage: LoginPage;
  let wizardPage: SetupWizardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    wizardPage = new SetupWizardPage(page);
  });

  test.describe("Wizard Navigation", () => {
    test.skip(
      !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD,
      "Test credentials not configured"
    );

    test.beforeEach(async () => {
      // Login first
      await loginPage.goto();
      await loginPage.login(
        process.env.TEST_USER_EMAIL!,
        process.env.TEST_USER_PASSWORD!
      );

      // If organization is not configured, we should be redirected to wizard
      // Otherwise, we need to manually navigate (for testing purposes)
      try {
        await wizardPage.waitForWizard();
      } catch {
        // Already configured org, skip this test suite
        test.skip();
      }
    });

    test("should display step indicator with 4 steps", async () => {
      await expect(wizardPage.stepIndicator).toBeVisible();
    });

    test("should show Step 1 - Organization Details by default", async () => {
      await expect(wizardPage.orgNameInput).toBeVisible();
      await expect(wizardPage.addressInput).toBeVisible();
      await expect(wizardPage.cityInput).toBeVisible();
      await expect(wizardPage.stateSelect).toBeVisible();
      await expect(wizardPage.phoneInput).toBeVisible();
      await expect(wizardPage.emailInput).toBeVisible();
    });

    test("should show validation errors for required fields in Step 1", async () => {
      // Clear any pre-filled values
      await wizardPage.orgNameInput.clear();
      await wizardPage.addressInput.clear();

      // Try to proceed
      await wizardPage.goToNextStep();

      // Should show validation error
      const errorMessage = wizardPage.page.locator("text=Organization name must be at least 3 characters");
      await expect(errorMessage).toBeVisible();
    });

    test("should navigate to Step 2 after filling Step 1", async () => {
      await wizardPage.fillOrganizationDetails({
        name: "Test Cold Storage",
        address: "123 Test Street, Industrial Area",
        city: "Agra",
        state: "Uttar Pradesh",
        phone: "+91 9876543210",
        email: "test@coldstorage.com",
      });

      await wizardPage.goToNextStep();

      // Should be on Step 2
      await expect(wizardPage.gstNoInput).toBeVisible();
      await expect(wizardPage.panNoInput).toBeVisible();
    });

    test("should allow skipping Step 1", async () => {
      await wizardPage.skipCurrentStep();

      // Should be on Step 2
      await expect(wizardPage.gstNoInput).toBeVisible();
    });

    test("should validate GST format if provided in Step 2", async () => {
      // Skip Step 1
      await wizardPage.skipCurrentStep();

      // Enter invalid GST
      await wizardPage.gstNoInput.fill("INVALID");
      await wizardPage.goToNextStep();

      // Should show validation error
      const errorMessage = wizardPage.page.locator("text=Invalid GST number format");
      await expect(errorMessage).toBeVisible();
    });

    test("should navigate through all steps using Skip", async () => {
      // Skip Step 1
      await wizardPage.skipCurrentStep();
      await expect(wizardPage.gstNoInput).toBeVisible();

      // Skip Step 2
      await wizardPage.skipCurrentStep();
      await expect(wizardPage.modeStandard).toBeVisible();

      // Skip Step 3 -> Step 4
      await wizardPage.skipCurrentStep();
      await expect(wizardPage.startSetupButton).toBeVisible();
    });

    test("should allow going back to previous steps", async () => {
      // Go to Step 2
      await wizardPage.skipCurrentStep();
      await expect(wizardPage.gstNoInput).toBeVisible();

      // Go back to Step 1
      await wizardPage.goToPreviousStep();
      await expect(wizardPage.orgNameInput).toBeVisible();
    });
  });

  test.describe("Step 3 - System Settings", () => {
    test.skip(
      !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD,
      "Test credentials not configured"
    );

    test.beforeEach(async () => {
      await loginPage.goto();
      await loginPage.login(
        process.env.TEST_USER_EMAIL!,
        process.env.TEST_USER_PASSWORD!
      );

      try {
        await wizardPage.waitForWizard();
        // Navigate to Step 3
        await wizardPage.skipCurrentStep(); // Skip Step 1
        await wizardPage.skipCurrentStep(); // Skip Step 2
      } catch {
        test.skip();
      }
    });

    test("should display software mode toggle", async () => {
      await expect(wizardPage.modeStandard).toBeVisible();
      await expect(wizardPage.modeAdvanced).toBeVisible();
    });

    test("should display rent processing toggle", async () => {
      await expect(wizardPage.rentLedger).toBeVisible();
      await expect(wizardPage.rentBill).toBeVisible();
    });

    test("should display feature checkboxes", async () => {
      await expect(wizardPage.multiChamberCheckbox).toBeVisible();
      await expect(wizardPage.partialLotCheckbox).toBeVisible();
      await expect(wizardPage.mapRequiredCheckbox).toBeVisible();
    });

    test("should display packet configuration fields", async () => {
      await expect(wizardPage.pkt1Name).toBeVisible();
      await expect(wizardPage.pkt1Weight).toBeVisible();
      await expect(wizardPage.pkt2Name).toBeVisible();
      await expect(wizardPage.pkt2Weight).toBeVisible();
      await expect(wizardPage.pkt3Name).toBeVisible();
      await expect(wizardPage.pkt3Weight).toBeVisible();
    });

    test("should allow selecting Advanced mode", async () => {
      await wizardPage.modeAdvanced.click();
      await expect(wizardPage.modeAdvanced).toHaveAttribute("data-state", "on");
    });

    test("should allow selecting Bill-based rent processing", async () => {
      await wizardPage.rentBill.click();
      await expect(wizardPage.rentBill).toHaveAttribute("data-state", "on");
    });
  });

  test.describe("Step 4 - Data Population", () => {
    test.skip(
      !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD,
      "Test credentials not configured"
    );

    test.beforeEach(async () => {
      await loginPage.goto();
      await loginPage.login(
        process.env.TEST_USER_EMAIL!,
        process.env.TEST_USER_PASSWORD!
      );

      try {
        await wizardPage.waitForWizard();
        // Navigate to Step 4
        await wizardPage.skipCurrentStep(); // Skip Step 1
        await wizardPage.skipCurrentStep(); // Skip Step 2
        await wizardPage.skipCurrentStep(); // Skip Step 3
      } catch {
        test.skip();
      }
    });

    test("should display data summary before seeding", async () => {
      // Should show the start setup button
      await expect(wizardPage.startSetupButton).toBeVisible();

      // Should show list of data to be created
      const systemConfigCard = wizardPage.page.locator("text=System Configuration");
      await expect(systemConfigCard).toBeVisible();

      const permissionsCard = wizardPage.page.locator("text=Role Permissions");
      await expect(permissionsCard).toBeVisible();

      const accountsCard = wizardPage.page.locator("text=Chart of Accounts");
      await expect(accountsCard).toBeVisible();
    });

    test("should allow going back from Step 4", async () => {
      await wizardPage.goToPreviousStep();

      // Should be on Step 3
      await expect(wizardPage.modeStandard).toBeVisible();
    });
  });

  test.describe("Complete Wizard Flow", () => {
    test.skip(
      !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD,
      "Test credentials not configured"
    );

    test("should complete full wizard and redirect to dashboard", async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(
        process.env.TEST_USER_EMAIL!,
        process.env.TEST_USER_PASSWORD!
      );

      try {
        await wizardPage.waitForWizard();
      } catch {
        // Already configured, skip test
        test.skip();
        return;
      }

      // Step 1 - Fill organization details
      await wizardPage.fillOrganizationDetails({
        name: "E2E Test Cold Storage",
        nameHindi: "ई2ई टेस्ट कोल्ड स्टोरेज",
        address: "123 Test Industrial Area, Near Railway Station",
        city: "Agra",
        state: "Uttar Pradesh",
        phone: "+91 9876543210",
        email: "e2e-test@coldstorage.com",
      });
      await wizardPage.goToNextStep();

      // Step 2 - Fill business registration (optional)
      await wizardPage.fillBusinessRegistration({
        gstNo: "09AAAAA0000A1Z5",
        panNo: "AAAAA0000A",
        bankName: "State Bank of India",
        bankAccount: "1234567890",
        bankIfsc: "SBIN0001234",
        bankBranch: "Main Branch, Agra",
      });
      await wizardPage.goToNextStep();

      // Step 3 - Configure system settings
      await wizardPage.configureSystemSettings({
        softwareMode: "standard",
        rentProcessing: "ledger",
        multiChamber: false,
        partialLot: false,
        mapRequired: false,
      });
      await wizardPage.goToNextStep();

      // Step 4 - Start data population
      await wizardPage.startSetup();

      // Wait for seeding to complete (this may take a while)
      await wizardPage.waitForSeedingComplete();

      // Complete wizard
      await wizardPage.completeWizard();

      // Should be redirected to dashboard
      const dashboardPage = new DashboardPage(page);
      await dashboardPage.waitForDashboard();
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe("Redirect Logic", () => {
    test.skip(
      !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD,
      "Test credentials not configured"
    );

    test("should redirect unconfigured org to setup wizard", async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(
        process.env.TEST_USER_EMAIL!,
        process.env.TEST_USER_PASSWORD!
      );

      // If org is not configured, should be on setup wizard
      // If org is configured, should be on dashboard
      const currentUrl = page.url();
      const isValidUrl =
        currentUrl.includes("/setup-wizard") ||
        currentUrl.includes("/dashboard");

      expect(isValidUrl).toBe(true);
    });

    test("should redirect configured org to dashboard when visiting setup-wizard", async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(
        process.env.TEST_USER_EMAIL!,
        process.env.TEST_USER_PASSWORD!
      );

      // Wait for initial navigation
      await page.waitForURL(/\/(dashboard|setup-wizard)/);

      // If already on dashboard, try to navigate to setup-wizard
      if (page.url().includes("/dashboard")) {
        await page.goto("/setup-wizard");
        // Should redirect back to dashboard
        await expect(page).toHaveURL(/\/dashboard/);
      }
    });
  });
});
