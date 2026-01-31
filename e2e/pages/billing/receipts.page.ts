import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export type ReceiptStatus = "all" | "draft" | "confirmed" | "cancelled";
export type PaymentMode = "CASH" | "CHEQUE" | "BANK" | "UPI";

export interface CashReceiptData {
  partyId: string;
  amount: string;
  narration?: string;
}

export interface ChequeReceiptData extends CashReceiptData {
  chequeNumber: string;
  chequeDate: string;
  bank: string;
  branch?: string;
  isPdc?: boolean;
}

export interface UpiReceiptData extends CashReceiptData {
  upiRef: string;
}

export interface BankReceiptData extends CashReceiptData {
  bankRef: string;
}

export class ReceiptsPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly listPage: Locator;
  readonly searchInput: Locator;
  readonly newReceiptButton: Locator;

  // Tab filters
  readonly tabAll: Locator;
  readonly tabDraft: Locator;
  readonly tabConfirmed: Locator;
  readonly tabCancelled: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formParty: Locator;
  readonly formDate: Locator;
  readonly formOutstanding: Locator;
  readonly formOutstandingAmount: Locator;
  readonly formAmount: Locator;
  readonly formAmountWords: Locator;
  readonly formNarration: Locator;
  readonly formSubmit: Locator;
  readonly formCancel: Locator;

  // Payment mode toggles
  readonly modeCash: Locator;
  readonly modeCheque: Locator;
  readonly modeBank: Locator;
  readonly modeUpi: Locator;

  // Cheque fields
  readonly chequeSection: Locator;
  readonly chequeNumber: Locator;
  readonly chequeDate: Locator;
  readonly chequeBank: Locator;
  readonly chequeBranch: Locator;
  readonly chequePdc: Locator;

  // UPI/Bank fields
  readonly upiRef: Locator;
  readonly bankRef: Locator;

  // Bill adjustment
  readonly billAdjustmentSection: Locator;
  readonly autoAdjust: Locator;
  readonly billTable: Locator;

  // Receipt preview
  readonly previewPage: Locator;
  readonly previewBack: Locator;
  readonly previewNumber: Locator;
  readonly previewStatus: Locator;
  readonly previewPrint: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.listPage = page.getByTestId("receipt-list-page");
    this.searchInput = page.getByTestId("receipt-search");
    this.newReceiptButton = page.getByTestId("receipt-new-button");

    // Tab filters
    this.tabAll = page.getByTestId("receipt-tab-all");
    this.tabDraft = page.getByTestId("receipt-tab-draft");
    this.tabConfirmed = page.getByTestId("receipt-tab-confirmed");
    this.tabCancelled = page.getByTestId("receipt-tab-cancelled");

    // Form dialog elements
    this.formDialog = page.getByTestId("receipt-form-dialog");
    this.formParty = page.getByTestId("receipt-form-party");
    this.formDate = page.getByTestId("receipt-form-date");
    this.formOutstanding = page.getByTestId("receipt-form-outstanding");
    this.formOutstandingAmount = page.getByTestId("receipt-form-outstanding-amount");
    this.formAmount = page.getByTestId("receipt-form-amount");
    this.formAmountWords = page.getByTestId("receipt-form-amount-words");
    this.formNarration = page.getByTestId("receipt-form-narration");
    this.formSubmit = page.getByTestId("receipt-form-submit");
    this.formCancel = page.getByTestId("receipt-form-cancel");

    // Payment mode toggles
    this.modeCash = page.getByTestId("receipt-form-mode-cash");
    this.modeCheque = page.getByTestId("receipt-form-mode-cheque");
    this.modeBank = page.getByTestId("receipt-form-mode-bank");
    this.modeUpi = page.getByTestId("receipt-form-mode-upi");

    // Cheque fields
    this.chequeSection = page.getByTestId("receipt-form-cheque-section");
    this.chequeNumber = page.getByTestId("receipt-form-cheque-number");
    this.chequeDate = page.getByTestId("receipt-form-cheque-date");
    this.chequeBank = page.getByTestId("receipt-form-cheque-bank");
    this.chequeBranch = page.getByTestId("receipt-form-cheque-branch");
    this.chequePdc = page.getByTestId("receipt-form-pdc");

    // UPI/Bank fields
    this.upiRef = page.getByTestId("receipt-form-upi-ref");
    this.bankRef = page.getByTestId("receipt-form-bank-ref");

    // Bill adjustment
    this.billAdjustmentSection = page.getByTestId("receipt-form-bill-adjustment-section");
    this.autoAdjust = page.getByTestId("receipt-form-auto-adjust");
    this.billTable = page.getByTestId("receipt-form-bill-table");

    // Receipt preview
    this.previewPage = page.getByTestId("receipt-preview-page");
    this.previewBack = page.getByTestId("receipt-preview-back");
    this.previewNumber = page.getByTestId("receipt-preview-number");
    this.previewStatus = page.getByTestId("receipt-preview-status");
    this.previewPrint = page.getByTestId("receipt-preview-print");
  }

  // Navigation
  async goto() {
    await super.goto("/billing/receipts");
    await expect(this.listPage).toBeVisible({ timeout: 15_000 });
  }

  // List page methods
  async openNewReceiptDialog() {
    await this.newReceiptButton.click();
    await expect(this.formDialog).toBeVisible();
  }

  async closeDialog() {
    await this.formCancel.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async searchReceipts(term: string) {
    await this.searchInput.fill(term);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async filterByStatus(status: ReceiptStatus) {
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

  async getTabCount(tab: ReceiptStatus): Promise<number> {
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

  // Form methods
  async selectParty(partyId: string) {
    await this.formParty.click();
    await this.page.getByTestId(`receipt-form-party-option-${partyId}`).click();
  }

  async selectPaymentMode(mode: PaymentMode) {
    switch (mode) {
      case "CASH":
        await this.modeCash.click();
        break;
      case "CHEQUE":
        await this.modeCheque.click();
        break;
      case "BANK":
        await this.modeBank.click();
        break;
      case "UPI":
        await this.modeUpi.click();
        break;
    }
  }

  async fillAmount(amount: string) {
    await this.formAmount.fill(amount);
  }

  async fillDate(date: string) {
    await this.formDate.fill(date);
  }

  async fillNarration(narration: string) {
    await this.formNarration.fill(narration);
  }

  async fillChequeDetails(data: {
    number: string;
    date: string;
    bank: string;
    branch?: string;
    isPdc?: boolean;
  }) {
    await this.chequeNumber.fill(data.number);
    await this.chequeDate.fill(data.date);
    await this.chequeBank.fill(data.bank);
    if (data.branch) {
      await this.chequeBranch.fill(data.branch);
    }
    if (data.isPdc) {
      await this.chequePdc.click();
    }
  }

  async fillUpiRef(ref: string) {
    await this.upiRef.fill(ref);
  }

  async fillBankRef(ref: string) {
    await this.bankRef.fill(ref);
  }

  async toggleAutoAdjust() {
    await this.autoAdjust.click();
  }

  async submitReceipt() {
    await this.formSubmit.click();
    // Wait for dialog to close on success
    await expect(this.formDialog).not.toBeVisible({ timeout: 10_000 });
  }

  // Full flow helpers
  async createCashReceipt(data: CashReceiptData) {
    await this.openNewReceiptDialog();
    await this.selectParty(data.partyId);
    await this.selectPaymentMode("CASH");
    await this.fillAmount(data.amount);
    if (data.narration) {
      await this.fillNarration(data.narration);
    }
    await this.submitReceipt();
  }

  async createChequeReceipt(data: ChequeReceiptData) {
    await this.openNewReceiptDialog();
    await this.selectParty(data.partyId);
    await this.selectPaymentMode("CHEQUE");
    await this.fillAmount(data.amount);
    await this.fillChequeDetails({
      number: data.chequeNumber,
      date: data.chequeDate,
      bank: data.bank,
      branch: data.branch,
      isPdc: data.isPdc,
    });
    if (data.narration) {
      await this.fillNarration(data.narration);
    }
    await this.submitReceipt();
  }

  async createUpiReceipt(data: UpiReceiptData) {
    await this.openNewReceiptDialog();
    await this.selectParty(data.partyId);
    await this.selectPaymentMode("UPI");
    await this.fillAmount(data.amount);
    await this.fillUpiRef(data.upiRef);
    if (data.narration) {
      await this.fillNarration(data.narration);
    }
    await this.submitReceipt();
  }

  async createBankReceipt(data: BankReceiptData) {
    await this.openNewReceiptDialog();
    await this.selectParty(data.partyId);
    await this.selectPaymentMode("BANK");
    await this.fillAmount(data.amount);
    await this.fillBankRef(data.bankRef);
    if (data.narration) {
      await this.fillNarration(data.narration);
    }
    await this.submitReceipt();
  }

  // Utility methods
  async getOutstandingBalance(): Promise<string> {
    return (await this.formOutstandingAmount.textContent()) ?? "";
  }

  async getAmountInWords(): Promise<string> {
    return (await this.formAmountWords.textContent()) ?? "";
  }

  async isBillAdjustmentVisible(): Promise<boolean> {
    return await this.billAdjustmentSection.isVisible();
  }
}
