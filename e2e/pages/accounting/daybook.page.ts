import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class DaybookPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly daybookPage: Locator;

  // Date navigator elements
  readonly dateNavigator: Locator;
  readonly navPrev: Locator;
  readonly navNext: Locator;
  readonly dateInput: Locator;
  readonly navToday: Locator;
  readonly dateDisplay: Locator;

  // Summary cards
  readonly summaryCards: Locator;
  readonly cashOpeningCard: Locator;
  readonly cashOpeningValue: Locator;
  readonly cashClosingCard: Locator;
  readonly cashClosingValue: Locator;
  readonly bankOpeningCard: Locator;
  readonly bankOpeningValue: Locator;
  readonly bankClosingCard: Locator;
  readonly bankClosingValue: Locator;

  // Daily summary cards
  readonly cashSummary: Locator;
  readonly bankSummary: Locator;

  // Transactions
  readonly transactions: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.daybookPage = page.getByTestId("daybook-page");

    // Date navigator elements
    this.dateNavigator = page.getByTestId("daybook-date-navigator");
    this.navPrev = page.getByTestId("daybook-nav-prev");
    this.navNext = page.getByTestId("daybook-nav-next");
    this.dateInput = page.getByTestId("daybook-date-input");
    this.navToday = page.getByTestId("daybook-nav-today");
    this.dateDisplay = page.getByTestId("daybook-date-display");

    // Summary cards (from DaybookSummaryCards)
    this.summaryCards = page.getByTestId("daybook-summary-cards");
    this.cashOpeningCard = page.getByTestId("daybook-cash-opening");
    this.cashOpeningValue = page.getByTestId("daybook-cash-opening-value");
    this.cashClosingCard = page.getByTestId("daybook-cash-closing");
    this.cashClosingValue = page.getByTestId("daybook-cash-closing-value");
    this.bankOpeningCard = page.getByTestId("daybook-bank-opening");
    this.bankOpeningValue = page.getByTestId("daybook-bank-opening-value");
    this.bankClosingCard = page.getByTestId("daybook-bank-closing");
    this.bankClosingValue = page.getByTestId("daybook-bank-closing-value");

    // Daily summary cards
    this.cashSummary = page.getByTestId("daybook-cash-summary");
    this.bankSummary = page.getByTestId("daybook-bank-summary");

    // Transactions
    this.transactions = page.getByTestId("daybook-transactions");
    this.emptyState = page.getByTestId("daybook-empty-state");
  }

  async goto() {
    await super.goto("/accounts/daybook");
    await expect(this.daybookPage).toBeVisible({ timeout: 15_000 });
  }

  async navigateToPreviousDay() {
    await this.navPrev.click();
  }

  async navigateToNextDay() {
    await this.navNext.click();
  }

  async navigateToToday() {
    await this.navToday.click();
  }

  async navigateToDate(date: string) {
    await this.dateInput.fill(date);
  }

  async getSelectedDate(): Promise<string> {
    return (await this.dateInput.inputValue()) ?? "";
  }

  async getDisplayDate(): Promise<string> {
    return (await this.dateDisplay.textContent()) ?? "";
  }

  async getCashOpeningValue(): Promise<string> {
    return (await this.cashOpeningValue.textContent()) ?? "";
  }

  async getCashClosingValue(): Promise<string> {
    return (await this.cashClosingValue.textContent()) ?? "";
  }

  async getBankOpeningValue(): Promise<string> {
    return (await this.bankOpeningValue.textContent()) ?? "";
  }

  async getBankClosingValue(): Promise<string> {
    return (await this.bankClosingValue.textContent()) ?? "";
  }

  async hasTransactions(): Promise<boolean> {
    const isEmpty = await this.emptyState.isVisible().catch(() => false);
    return !isEmpty;
  }

  getTransaction(voucherId: string): Locator {
    return this.page.getByTestId(`daybook-transaction-${voucherId}`);
  }

  async isEmptyState(): Promise<boolean> {
    return await this.emptyState.isVisible().catch(() => false);
  }
}
