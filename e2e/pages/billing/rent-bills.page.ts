import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export type BillStatus = "all" | "draft" | "pending" | "paid" | "cancelled";
export type GstType = "INTRA_STATE" | "INTER_STATE";
export type ChargeType = "loading" | "unloading" | "dala" | "insurance" | "other";

export interface BillWizardData {
  partyId?: string;
  amadIds?: string[];
  selectAll?: boolean;
  charges?: Array<{ type: ChargeType; rate: string; qty: string }>;
  gstType?: GstType;
  gstRate?: string;
  discount?: string;
  notes?: string;
}

export class RentBillsPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly listPage: Locator;
  readonly searchInput: Locator;
  readonly newBillButton: Locator;

  // KPI cards
  readonly kpiCards: Locator;
  readonly kpiBillsThisMonth: Locator;
  readonly kpiPending: Locator;
  readonly kpiCollections: Locator;
  readonly kpiGst: Locator;

  // Tab filters
  readonly tabAll: Locator;
  readonly tabDraft: Locator;
  readonly tabPending: Locator;
  readonly tabPaid: Locator;
  readonly tabCancelled: Locator;

  // Bill wizard page
  readonly wizardPage: Locator;
  readonly wizardSteps: Locator;
  readonly wizardCancel: Locator;

  // Wizard Step 1 elements
  readonly step1Content: Locator;
  readonly wizardPartySelect: Locator;
  readonly wizardAmadTable: Locator;
  readonly wizardAmadCount: Locator;
  readonly wizardSelectAll: Locator;
  readonly wizardClearAll: Locator;
  readonly wizardSelectionSummary: Locator;
  readonly wizardSelectedCount: Locator;
  readonly wizardTotalBags: Locator;
  readonly wizardEstRent: Locator;

  // Wizard Step 2 elements
  readonly step2Content: Locator;
  readonly wizardRentTable: Locator;
  readonly wizardGstType: Locator;
  readonly wizardGstRate: Locator;
  readonly wizardDiscount: Locator;

  // Wizard Step 3 elements
  readonly step3Content: Locator;
  readonly wizardPreview: Locator;
  readonly wizardNotes: Locator;

  // Navigation
  readonly wizardNext: Locator;
  readonly wizardBack: Locator;
  readonly wizardGenerateButton: Locator;

  // Bill preview page
  readonly previewPage: Locator;
  readonly previewBack: Locator;
  readonly previewNumber: Locator;
  readonly previewStatus: Locator;
  readonly previewConfirm: Locator;
  readonly previewCancel: Locator;
  readonly previewPrint: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.listPage = page.getByTestId("rent-bill-list-page");
    this.searchInput = page.getByTestId("rent-bill-search");
    this.newBillButton = page.getByTestId("rent-bill-new-button");

    // KPI cards
    this.kpiCards = page.getByTestId("rent-bill-kpi-cards");
    this.kpiBillsThisMonth = page.getByTestId("rent-bill-kpi-bills-this-month");
    this.kpiPending = page.getByTestId("rent-bill-kpi-pending");
    this.kpiCollections = page.getByTestId("rent-bill-kpi-collections");
    this.kpiGst = page.getByTestId("rent-bill-kpi-gst");

    // Tab filters
    this.tabAll = page.getByTestId("rent-bill-tab-all");
    this.tabDraft = page.getByTestId("rent-bill-tab-draft");
    this.tabPending = page.getByTestId("rent-bill-tab-pending");
    this.tabPaid = page.getByTestId("rent-bill-tab-paid");
    this.tabCancelled = page.getByTestId("rent-bill-tab-cancelled");

    // Bill wizard page
    this.wizardPage = page.getByTestId("bill-wizard-page");
    this.wizardSteps = page.getByTestId("bill-wizard-steps");
    this.wizardCancel = page.getByTestId("bill-wizard-cancel");

    // Wizard Step 1 elements
    this.step1Content = page.getByTestId("bill-wizard-step1-content");
    this.wizardPartySelect = page.getByTestId("bill-wizard-party-select");
    this.wizardAmadTable = page.getByTestId("bill-wizard-amad-table");
    this.wizardAmadCount = page.getByTestId("bill-wizard-amad-count");
    this.wizardSelectAll = page.getByTestId("bill-wizard-select-all");
    this.wizardClearAll = page.getByTestId("bill-wizard-clear-all");
    this.wizardSelectionSummary = page.getByTestId("bill-wizard-selection-summary");
    this.wizardSelectedCount = page.getByTestId("bill-wizard-selected-count");
    this.wizardTotalBags = page.getByTestId("bill-wizard-total-bags");
    this.wizardEstRent = page.getByTestId("bill-wizard-est-rent");

    // Wizard Step 2 elements
    this.step2Content = page.getByTestId("bill-wizard-step2-content");
    this.wizardRentTable = page.getByTestId("bill-wizard-rent-table");
    this.wizardGstType = page.getByTestId("bill-wizard-gst-type");
    this.wizardGstRate = page.getByTestId("bill-wizard-gst-rate");
    this.wizardDiscount = page.getByTestId("bill-wizard-discount");

    // Wizard Step 3 elements
    this.step3Content = page.getByTestId("bill-wizard-step3-content");
    this.wizardPreview = page.getByTestId("bill-wizard-preview");
    this.wizardNotes = page.getByTestId("bill-wizard-notes");

    // Navigation
    this.wizardNext = page.getByTestId("bill-wizard-next");
    this.wizardBack = page.getByTestId("bill-wizard-back");
    this.wizardGenerateButton = page.getByTestId("bill-wizard-generate-button");

    // Bill preview page
    this.previewPage = page.getByTestId("bill-preview-page");
    this.previewBack = page.getByTestId("bill-preview-back");
    this.previewNumber = page.getByTestId("bill-preview-number");
    this.previewStatus = page.getByTestId("bill-preview-status");
    this.previewConfirm = page.getByTestId("bill-preview-confirm");
    this.previewCancel = page.getByTestId("bill-preview-cancel");
    this.previewPrint = page.getByTestId("bill-preview-print");
  }

  // Navigation methods
  async goto() {
    await super.goto("/billing/rent-bills");
    await expect(this.listPage).toBeVisible({ timeout: 15_000 });
  }

  async gotoNewBill() {
    await super.goto("/billing/new-bill");
    await expect(this.wizardPage).toBeVisible({ timeout: 15_000 });
  }

  // List page methods
  async clickNewBill() {
    await this.newBillButton.click();
    await expect(this.wizardPage).toBeVisible({ timeout: 10_000 });
  }

  async searchBills(term: string) {
    await this.searchInput.fill(term);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async filterByStatus(status: BillStatus) {
    switch (status) {
      case "all":
        await this.tabAll.click();
        break;
      case "draft":
        await this.tabDraft.click();
        break;
      case "pending":
        await this.tabPending.click();
        break;
      case "paid":
        await this.tabPaid.click();
        break;
      case "cancelled":
        await this.tabCancelled.click();
        break;
    }
  }

  async getTabCount(tab: BillStatus): Promise<number> {
    let tabElement: Locator;
    switch (tab) {
      case "all":
        tabElement = this.tabAll;
        break;
      case "draft":
        tabElement = this.tabDraft;
        break;
      case "pending":
        tabElement = this.tabPending;
        break;
      case "paid":
        tabElement = this.tabPaid;
        break;
      case "cancelled":
        tabElement = this.tabCancelled;
        break;
    }
    const text = await tabElement.textContent();
    const match = text?.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  // Wizard Step 1 methods
  async selectParty(partyId: string) {
    await this.wizardPartySelect.click();
    await this.page.getByTestId(`bill-wizard-party-option-${partyId}`).click();
  }

  async selectAmads(amadIds: string[]) {
    for (const amadId of amadIds) {
      await this.page.getByTestId(`bill-wizard-amad-checkbox-${amadId}`).click();
    }
  }

  async selectAllAmads() {
    await this.wizardSelectAll.click();
  }

  async clearAllAmads() {
    await this.wizardClearAll.click();
  }

  async getSelectedAmadCount(): Promise<number> {
    const text = await this.wizardSelectedCount.textContent();
    return parseInt(text || "0", 10);
  }

  // Wizard Step 2 methods
  async addCharge(type: ChargeType) {
    await this.page.getByTestId(`bill-wizard-add-charge-${type}`).click();
    // Note: Would need to add data-testid to charge row inputs for proper automation
  }

  async setGstType(type: GstType) {
    await this.wizardGstType.click();
    if (type === "INTRA_STATE") {
      await this.page.getByTestId("bill-wizard-gst-intra").click();
    } else {
      await this.page.getByTestId("bill-wizard-gst-inter").click();
    }
  }

  async setGstRate(rate: string) {
    await this.wizardGstRate.fill(rate);
  }

  async setDiscount(amount: string) {
    await this.wizardDiscount.fill(amount);
  }

  // Wizard Step 3 methods
  async setNotes(notes: string) {
    await this.wizardNotes.fill(notes);
  }

  // Wizard navigation
  async goToStep2() {
    await this.wizardNext.click();
    await expect(this.step2Content).toBeVisible({ timeout: 5_000 });
  }

  async goToStep3() {
    await this.wizardNext.click();
    await expect(this.step3Content).toBeVisible({ timeout: 5_000 });
  }

  async goBack() {
    await this.wizardBack.click();
  }

  async cancelWizard() {
    await this.wizardCancel.click();
    await expect(this.listPage).toBeVisible({ timeout: 10_000 });
  }

  async generateBill() {
    await this.wizardGenerateButton.click();
    // Wait for navigation to preview page
    await expect(this.previewPage).toBeVisible({ timeout: 15_000 });
  }

  // Step indicators
  getStepIndicator(step: 1 | 2 | 3): Locator {
    return this.page.getByTestId(`bill-wizard-step-${step}`);
  }

  // Bill preview methods
  async confirmBill() {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.previewConfirm.click();
  }

  async cancelBill(reason: string = "Test cancellation") {
    this.page.on("dialog", async (dialog) => {
      await dialog.accept(reason);
    });
    await this.previewCancel.click();
  }

  async printBill() {
    await this.previewPrint.click();
  }

  async backToList() {
    await this.previewBack.click();
    await expect(this.listPage).toBeVisible({ timeout: 10_000 });
  }

  async getBillStatus(): Promise<string> {
    return (await this.previewStatus.textContent()) ?? "";
  }

  // Full flow helper
  async createBill(data: BillWizardData) {
    // Step 1: Select party and amads
    if (data.partyId) {
      await this.selectParty(data.partyId);
    }
    if (data.selectAll) {
      await this.selectAllAmads();
    } else if (data.amadIds) {
      await this.selectAmads(data.amadIds);
    }

    // Go to step 2
    await this.goToStep2();

    // Step 2: Add charges and configure GST
    if (data.charges) {
      for (const charge of data.charges) {
        await this.addCharge(charge.type);
      }
    }
    if (data.gstType) {
      await this.setGstType(data.gstType);
    }
    if (data.gstRate) {
      await this.setGstRate(data.gstRate);
    }
    if (data.discount) {
      await this.setDiscount(data.discount);
    }

    // Go to step 3
    await this.goToStep3();

    // Step 3: Add notes and generate
    if (data.notes) {
      await this.setNotes(data.notes);
    }

    await this.generateBill();
  }
}
