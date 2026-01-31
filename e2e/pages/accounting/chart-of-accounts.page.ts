import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class ChartOfAccountsPage extends BasePage {
  readonly page: Page;
  readonly chartPage: Locator;
  readonly searchInput: Locator;
  readonly accountTree: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.chartPage = page.getByTestId("chart-of-accounts-page");
    this.searchInput = page.getByTestId("chart-search-input");
    this.accountTree = page.getByTestId("account-tree");
  }

  async goto() {
    await super.goto("/accounts/chart-of-accounts");
    // Wait for the page and tree to load
    await this.chartPage.waitFor({ state: "visible", timeout: 10_000 });
    await this.accountTree.waitFor({ state: "visible", timeout: 10_000 });
  }

  async searchAccounts(searchTerm: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(searchTerm);
    // Wait for filtering to apply
    await this.page.waitForTimeout(300);
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(300);
  }

  async getVisibleAccountsCount(): Promise<number> {
    const accountNodes = this.page.locator('[data-testid^="account-node-"]');
    return await accountNodes.count();
  }

  /**
   * Check if any visible account contains the given text
   */
  async hasAccountContainingText(text: string): Promise<boolean> {
    const accountNodes = this.page.locator('[data-testid^="account-node-"]');
    const count = await accountNodes.count();

    for (let i = 0; i < count; i++) {
      const nodeText = await accountNodes.nth(i).textContent();
      if (nodeText && nodeText.toUpperCase().includes(text.toUpperCase())) {
        return true;
      }
    }
    return false;
  }

  /**
   * Expect at least one account containing the given text to be visible
   */
  async expectAccountContainingText(text: string) {
    const hasAccount = await this.hasAccountContainingText(text);
    expect(hasAccount).toBe(true);
  }

  /**
   * Get all visible account texts that contain the search term
   */
  async getMatchingAccounts(searchTerm: string): Promise<string[]> {
    const accountNodes = this.page.locator('[data-testid^="account-node-"]');
    const count = await accountNodes.count();
    const matches: string[] = [];

    for (let i = 0; i < count; i++) {
      const nodeText = await accountNodes.nth(i).textContent();
      if (nodeText && nodeText.toUpperCase().includes(searchTerm.toUpperCase())) {
        matches.push(nodeText);
      }
    }
    return matches;
  }

  async clickAccountByCode(code: string) {
    await this.page.getByTestId(`account-node-${code}`).click();
  }
}
