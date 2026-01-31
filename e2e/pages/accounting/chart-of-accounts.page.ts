import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base.page";

export class ChartOfAccountsPage extends BasePage {
  readonly page: Page;
  readonly chartPage: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Note: Chart of accounts components don't have data-testid yet
    // This is a placeholder for future implementation
    this.chartPage = page.locator('[data-testid="chart-of-accounts-page"]');
  }

  async goto() {
    await super.goto("/accounts/chart-of-accounts");
    // Wait for content to load
    await this.page.waitForTimeout(1000);
  }
}
