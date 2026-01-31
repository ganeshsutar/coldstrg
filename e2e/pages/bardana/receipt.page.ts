import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export type ReceiptFilterTab = "all" | "draft" | "confirmed" | "cancelled";

export class ReceiptPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly receiptPage: Locator;
  readonly newReceiptButton: Locator;
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
  readonly formOutstandingSummary: Locator;
  readonly formAddItemButton: Locator;
  readonly formNarrationInput: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.receiptPage = page.getByTestId("bardana-receipt-page");
    this.newReceiptButton = page.getByTestId("bardana-new-receipt-button");
    this.searchInput = page.getByTestId("bardana-receipt-search-input");

    // Tab filters
    this.tabAll = page.getByTestId("bardana-receipt-tab-all");
    this.tabDraft = page.getByTestId("bardana-receipt-tab-draft");
    this.tabConfirmed = page.getByTestId("bardana-receipt-tab-confirmed");
    this.tabCancelled = page.getByTestId("bardana-receipt-tab-cancelled");

    // Form dialog
    this.formDialog = page.getByTestId("bardana-receipt-form-dialog");
    this.formDateInput = page.getByTestId("bardana-receipt-form-date-input");
    this.formPartySelect = page.getByTestId("bardana-receipt-form-party-select");
    this.formOutstandingSummary = page.getByTestId("bardana-receipt-outstanding-summary");
    this.formAddItemButton = page.getByTestId("bardana-receipt-form-add-item-button");
    this.formNarrationInput = page.getByTestId("bardana-receipt-form-narration-input");
    this.formCancelButton = page.getByTestId("bardana-receipt-form-cancel-button");
    this.formSubmitButton = page.getByTestId("bardana-receipt-form-submit-button");
  }

  async goto() {
    await super.goto("/bardana/receipts");
    await expect(this.receiptPage).toBeVisible({ timeout: 15_000 });
  }

  async openNewReceiptDialog() {
    await this.newReceiptButton.click();
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

  async setReceiptDate(date: string) {
    await this.formDateInput.fill(date);
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

  async searchReceipt(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async filterByStatus(status: ReceiptFilterTab) {
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

  async getTabCount(tab: ReceiptFilterTab): Promise<number> {
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
