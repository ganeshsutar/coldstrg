import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export type IssueFilterTab = "all" | "draft" | "confirmed" | "cancelled";

export class IssuePage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly issuePage: Locator;
  readonly newIssueButton: Locator;
  readonly searchInput: Locator;

  // Tab filters
  readonly tabAll: Locator;
  readonly tabDraft: Locator;
  readonly tabConfirmed: Locator;
  readonly tabCancelled: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formDateInput: Locator;
  readonly formPartySelect: Locator;
  readonly formTypeRegular: Locator;
  readonly formTypeAdvance: Locator;
  readonly formAddItemButton: Locator;
  readonly formNarrationInput: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.issuePage = page.getByTestId("bardana-issue-page");
    this.newIssueButton = page.getByTestId("bardana-new-issue-button");
    this.searchInput = page.getByTestId("bardana-issue-search-input");

    // Tab filters
    this.tabAll = page.getByTestId("bardana-issue-tab-all");
    this.tabDraft = page.getByTestId("bardana-issue-tab-draft");
    this.tabConfirmed = page.getByTestId("bardana-issue-tab-confirmed");
    this.tabCancelled = page.getByTestId("bardana-issue-tab-cancelled");

    // Form dialog
    this.formDialog = page.getByTestId("bardana-issue-form-dialog");
    this.formDateInput = page.getByTestId("bardana-issue-form-date-input");
    this.formPartySelect = page.getByTestId("bardana-issue-form-party-select");
    this.formTypeRegular = page.getByTestId("bardana-issue-form-type-regular");
    this.formTypeAdvance = page.getByTestId("bardana-issue-form-type-advance");
    this.formAddItemButton = page.getByTestId("bardana-issue-form-add-item-button");
    this.formNarrationInput = page.getByTestId("bardana-issue-form-narration-input");
    this.formCancelButton = page.getByTestId("bardana-issue-form-cancel-button");
    this.formSubmitButton = page.getByTestId("bardana-issue-form-submit-button");
  }

  async goto() {
    await super.goto("/bardana/issues");
    await expect(this.issuePage).toBeVisible({ timeout: 15_000 });
  }

  async openNewIssueDialog() {
    await this.newIssueButton.click();
    await expect(this.formDialog).toBeVisible();
  }

  async closeFormDialog() {
    await this.formCancelButton.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async selectParty(partyName: string) {
    await this.formPartySelect.click();
    await this.page.getByRole("option", { name: new RegExp(partyName, "i") }).click();
  }

  async setIssueDate(date: string) {
    await this.formDateInput.fill(date);
  }

  async selectIssueType(type: "regular" | "advance") {
    if (type === "regular") {
      await this.formTypeRegular.click();
    } else {
      await this.formTypeAdvance.click();
    }
  }

  async addItem() {
    await this.formAddItemButton.click();
  }

  async setNarration(narration: string) {
    await this.formNarrationInput.fill(narration);
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async searchIssue(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async filterByStatus(status: IssueFilterTab) {
    switch (status) {
      case "all":
        await this.tabAll.click();
        break;
      case "draft":
        await this.tabDraft.click();
        break;
      case "confirmed":
        await this.tabConfirmed.click();
        break;
      case "cancelled":
        await this.tabCancelled.click();
        break;
    }
  }

  async getTabCount(tab: IssueFilterTab): Promise<number> {
    let tabElement: Locator;
    switch (tab) {
      case "all":
        tabElement = this.tabAll;
        break;
      case "draft":
        tabElement = this.tabDraft;
        break;
      case "confirmed":
        tabElement = this.tabConfirmed;
        break;
      case "cancelled":
        tabElement = this.tabCancelled;
        break;
    }
    const text = await tabElement.textContent();
    const match = text?.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
