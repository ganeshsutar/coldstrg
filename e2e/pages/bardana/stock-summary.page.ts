import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class StockSummaryPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly stockPage: Locator;

  // KPI Cards
  readonly kpiCards: Locator;
  readonly kpiTotalStock: Locator;
  readonly kpiIssuedToday: Locator;
  readonly kpiOutstanding: Locator;
  readonly kpiReturnsPending: Locator;

  // Navigation Tabs
  readonly tabSummary: Locator;
  readonly tabIssues: Locator;
  readonly tabReceipts: Locator;
  readonly tabOutstanding: Locator;

  // Stock by Type section
  readonly stockTypeCards: Locator;

  // Recent Transactions section
  readonly recentTransactions: Locator;
  readonly recentTransactionsTable: Locator;
  readonly viewAllButton: Locator;
  readonly newIssueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page
    this.stockPage = page.getByTestId("bardana-stock-page");

    // KPI Cards
    this.kpiCards = page.getByTestId("bardana-kpi-cards");
    this.kpiTotalStock = page.getByTestId("bardana-kpi-total-stock");
    this.kpiIssuedToday = page.getByTestId("bardana-kpi-issued-today");
    this.kpiOutstanding = page.getByTestId("bardana-kpi-outstanding");
    this.kpiReturnsPending = page.getByTestId("bardana-kpi-returns-pending");

    // Navigation Tabs
    this.tabSummary = page.getByTestId("bardana-stock-tab-summary");
    this.tabIssues = page.getByTestId("bardana-stock-tab-issues");
    this.tabReceipts = page.getByTestId("bardana-stock-tab-receipts");
    this.tabOutstanding = page.getByTestId("bardana-stock-tab-outstanding");

    // Stock by Type
    this.stockTypeCards = page.getByTestId("bardana-stock-type-cards");

    // Recent Transactions
    this.recentTransactions = page.getByTestId("bardana-recent-transactions");
    this.recentTransactionsTable = page.getByTestId("bardana-recent-transactions-table");
    this.viewAllButton = page.getByTestId("bardana-view-all-button");
    this.newIssueButton = page.getByTestId("bardana-new-issue-button");
  }

  async goto() {
    await super.goto("/bardana");
    await expect(this.stockPage).toBeVisible({ timeout: 15_000 });
  }

  async navigateToIssues() {
    await this.tabIssues.click();
    await this.page.waitForURL(/\/bardana\/issues/);
  }

  async navigateToReceipts() {
    await this.tabReceipts.click();
    await this.page.waitForURL(/\/bardana\/receipts/);
  }

  async navigateToOutstanding() {
    await this.tabOutstanding.click();
    await this.page.waitForURL(/\/bardana\/outstanding/);
  }

  async clickNewIssue() {
    await this.newIssueButton.click();
  }

  async clickViewAll() {
    await this.viewAllButton.click();
  }

  getStockTypeCard(typeId: string): Locator {
    return this.page.getByTestId(`bardana-stock-type-card-${typeId}`);
  }

  getStockTypeIssueButton(typeId: string): Locator {
    return this.page.getByTestId(`bardana-stock-type-issue-button-${typeId}`);
  }

  async issueFromTypeCard(typeId: string) {
    await this.getStockTypeIssueButton(typeId).click();
  }
}
