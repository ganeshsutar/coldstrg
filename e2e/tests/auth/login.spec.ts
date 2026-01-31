import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { DashboardPage } from "../../pages/dashboard.page";

test.describe("Login Page", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("should display login page correctly", async () => {
    await expect(loginPage.loginForm).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.submitButton).toHaveText("Login");
  });

  test("should show loading state during login", async () => {
    await loginPage.emailInput.fill("test@example.com");
    await loginPage.passwordInput.fill("password123");
    await loginPage.submitButton.click();

    // Button should show loading state
    await expect(loginPage.submitButton).toHaveText("Logging in...");
    await expect(loginPage.submitButton).toBeDisabled();
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!email || !password) {
      test.skip();
      return;
    }

    const dashboardPage = new DashboardPage(page);

    await loginPage.login(email, password);
    await dashboardPage.waitForDashboard();

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("should show error for invalid credentials", async () => {
    await loginPage.login("invalid@example.com", "wrongpassword");

    // Wait for the error message to appear after auth attempt
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 15_000 });
  });

  test("should require email and password fields", async ({ page }) => {
    // Try to submit empty form - HTML5 validation should prevent submission
    await loginPage.submitButton.click();

    // Email input should be invalid (HTML5 required validation)
    const emailValidity = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(emailValidity).toBe(true);

    // Fill email, leave password empty
    await loginPage.emailInput.fill("test@example.com");
    await loginPage.submitButton.click();

    // Password input should be invalid
    const passwordValidity = await loginPage.passwordInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(passwordValidity).toBe(true);
  });

  test("should redirect to login page after logout", async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!email || !password) {
      test.skip();
      return;
    }

    const dashboardPage = new DashboardPage(page);

    // Login first
    await loginPage.login(email, password);
    await dashboardPage.waitForDashboard();
    await expect(page).toHaveURL(/\/dashboard/);

    // Logout
    await dashboardPage.logout();

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
    await expect(loginPage.loginForm).toBeVisible();
  });
});
