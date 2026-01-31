import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {
  readonly userMenuButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userMenuButton = page.getByTestId("user-menu-button");
    this.logoutButton = page.getByTestId("logout-button");
  }

  async waitForDashboard() {
    await this.waitForUrl(/\/dashboard/);
  }

  async logout() {
    await this.userMenuButton.click();
    await this.logoutButton.click();
  }
}
