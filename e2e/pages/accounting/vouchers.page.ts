import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export type VoucherType = "CR" | "DR" | "JV" | "CV" | "BH";
export type PaymentMode = "CASH" | "CHEQUE" | "BANK" | "UPI";

export class VouchersPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly vouchersPage: Locator;
  readonly newVoucherButton: Locator;
  readonly searchInput: Locator;
  readonly dateFilter: Locator;
  readonly clearDateButton: Locator;
  readonly todaySummary: Locator;

  // Tab filters
  readonly tabAll: Locator;
  readonly tabReceipt: Locator;
  readonly tabPayment: Locator;
  readonly tabJournal: Locator;
  readonly tabContra: Locator;
  readonly tabBank: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formTypeToggle: Locator;
  readonly formNumberInput: Locator;
  readonly formDateInput: Locator;
  readonly formDrAccountSelect: Locator;
  readonly formCrAccountSelect: Locator;
  readonly formAmountInput: Locator;
  readonly formPaymentModeToggle: Locator;
  readonly formNarrationInput: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.vouchersPage = page.getByTestId("vouchers-page");
    this.newVoucherButton = page.getByTestId("new-voucher-button");
    this.searchInput = page.getByTestId("voucher-search-input");
    this.dateFilter = page.getByTestId("voucher-date-filter");
    this.clearDateButton = page.getByTestId("voucher-clear-date-button");
    this.todaySummary = page.getByTestId("voucher-today-summary");

    // Tab filters
    this.tabAll = page.getByTestId("voucher-tab-all");
    this.tabReceipt = page.getByTestId("voucher-tab-cr");
    this.tabPayment = page.getByTestId("voucher-tab-dr");
    this.tabJournal = page.getByTestId("voucher-tab-jv");
    this.tabContra = page.getByTestId("voucher-tab-cv");
    this.tabBank = page.getByTestId("voucher-tab-bh");

    // Form dialog elements
    this.formDialog = page.getByTestId("voucher-form-dialog");
    this.formTypeToggle = page.getByTestId("voucher-form-type-toggle");
    this.formNumberInput = page.getByTestId("voucher-form-number-input");
    this.formDateInput = page.getByTestId("voucher-form-date-input");
    this.formDrAccountSelect = page.getByTestId("voucher-form-dr-account-select");
    this.formCrAccountSelect = page.getByTestId("voucher-form-cr-account-select");
    this.formAmountInput = page.getByTestId("voucher-form-amount-input");
    this.formPaymentModeToggle = page.getByTestId("voucher-form-payment-mode-toggle");
    this.formNarrationInput = page.getByTestId("voucher-form-narration-input");
    this.formCancelButton = page.getByTestId("voucher-form-cancel-button");
    this.formSubmitButton = page.getByTestId("voucher-form-submit-button");
  }

  async goto() {
    await super.goto("/accounts/vouchers");
    await expect(this.vouchersPage).toBeVisible({ timeout: 15_000 });
  }

  async openNewVoucherDialog() {
    await this.newVoucherButton.click();
    await expect(this.formDialog).toBeVisible();
  }

  async closeFormDialog() {
    await this.formCancelButton.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async selectVoucherType(type: VoucherType) {
    await this.page.getByTestId(`voucher-form-type-${type.toLowerCase()}`).click();
  }

  async selectPaymentMode(mode: PaymentMode) {
    await this.page.getByTestId(`voucher-form-payment-${mode.toLowerCase()}`).click();
  }

  async fillVoucherForm(data: {
    type?: VoucherType;
    amount: string;
    narration?: string;
    paymentMode?: PaymentMode;
  }) {
    if (data.type) {
      await this.selectVoucherType(data.type);
    }
    await this.formAmountInput.fill(data.amount);
    if (data.narration) {
      await this.formNarrationInput.fill(data.narration);
    }
    if (data.paymentMode) {
      await this.selectPaymentMode(data.paymentMode);
    }
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async createVoucher(data: {
    type?: VoucherType;
    amount: string;
    narration?: string;
    paymentMode?: PaymentMode;
  }) {
    await this.openNewVoucherDialog();
    await this.fillVoucherForm(data);
    await this.submitForm();
    // Wait for dialog to close
    await expect(this.formDialog).not.toBeVisible({ timeout: 10_000 });
  }

  async searchVouchers(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async filterByDate(date: string) {
    await this.dateFilter.fill(date);
  }

  async clearDateFilter() {
    await this.clearDateButton.click();
  }

  async filterByType(type: "all" | VoucherType) {
    switch (type) {
      case "all":
        await this.tabAll.click();
        break;
      case "CR":
        await this.tabReceipt.click();
        break;
      case "DR":
        await this.tabPayment.click();
        break;
      case "JV":
        await this.tabJournal.click();
        break;
      case "CV":
        await this.tabContra.click();
        break;
      case "BH":
        await this.tabBank.click();
        break;
    }
  }

  async getTabCount(type: "all" | VoucherType): Promise<number> {
    let tabElement: Locator;
    switch (type) {
      case "all":
        tabElement = this.tabAll;
        break;
      case "CR":
        tabElement = this.tabReceipt;
        break;
      case "DR":
        tabElement = this.tabPayment;
        break;
      case "JV":
        tabElement = this.tabJournal;
        break;
      case "CV":
        tabElement = this.tabContra;
        break;
      case "BH":
        tabElement = this.tabBank;
        break;
    }
    const text = await tabElement.textContent();
    const match = text?.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  getEditButton(voucherId: string): Locator {
    return this.page.getByTestId(`voucher-edit-button-${voucherId}`);
  }

  getDeleteButton(voucherId: string): Locator {
    return this.page.getByTestId(`voucher-delete-button-${voucherId}`);
  }

  getViewButton(voucherId: string): Locator {
    return this.page.getByTestId(`voucher-view-button-${voucherId}`);
  }

  async editVoucher(voucherId: string) {
    await this.getEditButton(voucherId).click();
    await expect(this.formDialog).toBeVisible();
  }

  async deleteVoucher(voucherId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getDeleteButton(voucherId).click();
  }

  async getTodaySummary(): Promise<string> {
    return (await this.todaySummary.textContent()) ?? "";
  }
}
