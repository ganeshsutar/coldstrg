import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class OutstandingPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly outstandingPage: Locator;
  readonly searchInput: Locator;

  // Summary Card
  readonly summaryCard: Locator;
  readonly totalBags: Locator;
  readonly totalValue: Locator;
  readonly partiesCount: Locator;

  // Party List
  readonly partyList: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.outstandingPage = page.getByTestId("bardana-outstanding-page");
    this.searchInput = page.getByTestId("bardana-outstanding-search-input");

    // Summary Card
    this.summaryCard = page.getByTestId("bardana-outstanding-summary-card");
    this.totalBags = page.getByTestId("bardana-outstanding-total-bags");
    this.totalValue = page.getByTestId("bardana-outstanding-total-value");
    this.partiesCount = page.getByTestId("bardana-outstanding-parties-count");

    // Party List
    this.partyList = page.getByTestId("bardana-outstanding-party-list");
  }

  async goto() {
    await super.goto("/bardana/outstanding");
    await expect(this.outstandingPage).toBeVisible({ timeout: 15_000 });
  }

  async searchParty(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  getPartyCard(partyId: string): Locator {
    return this.page.getByTestId(`bardana-outstanding-party-card-${partyId}`);
  }

  getRecordReturnButton(partyId: string): Locator {
    return this.page.getByTestId(`bardana-outstanding-record-return-button-${partyId}`);
  }

  getIssueMoreButton(partyId: string): Locator {
    return this.page.getByTestId(`bardana-outstanding-issue-more-button-${partyId}`);
  }

  async expandParty(partyId: string) {
    await this.getPartyCard(partyId).click();
  }

  async recordReturn(partyId: string) {
    await this.getRecordReturnButton(partyId).click();
    await this.page.waitForURL(/\/bardana\/receipts/);
  }

  async issueMore(partyId: string) {
    await this.getIssueMoreButton(partyId).click();
    await this.page.waitForURL(/\/bardana\/issues/);
  }
}
