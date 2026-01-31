import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export type KataiFilterTab = "all" | "pending" | "in_progress" | "completed";

export class KataiPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly kataiPage: Locator;
  readonly newGradingButton: Locator;
  readonly searchInput: Locator;

  // Tab filters
  readonly tabAll: Locator;
  readonly tabPending: Locator;
  readonly tabInProgress: Locator;
  readonly tabCompleted: Locator;

  // KPI cards
  readonly kpiTotalRecords: Locator;
  readonly kpiInProgress: Locator;
  readonly kpiCompleted: Locator;
  readonly kpiTotalGraded: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formDialogTitle: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  // Grading Details section
  readonly formKataiNoInput: Locator;
  readonly formDateInput: Locator;

  // Source Selection section
  readonly formPartySelect: Locator;
  readonly formAmadSelect: Locator;
  readonly formAmadInfo: Locator;
  readonly formBagsGradedInput: Locator;

  // Grading Output section
  readonly formMotaBagsInput: Locator;
  readonly formChattaBagsInput: Locator;
  readonly formBeejBagsInput: Locator;
  readonly formMixBagsInput: Locator;
  readonly formGullaBagsInput: Locator;
  readonly formOutputTotalDisplay: Locator;
  readonly formBalanceIndicator: Locator;

  // Labor Charges section
  readonly formLaborNameInput: Locator;
  readonly formLaborRateInput: Locator;
  readonly formTotalChargesDisplay: Locator;

  // Remarks
  readonly formRemarksInput: Locator;

  // Table elements
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.kataiPage = page.getByTestId("katai-page");
    this.newGradingButton = page.getByTestId("new-grading-button");
    this.searchInput = page.getByTestId("katai-search-input");

    // Tab filters
    this.tabAll = page.getByTestId("katai-tab-all");
    this.tabPending = page.getByTestId("katai-tab-pending");
    this.tabInProgress = page.getByTestId("katai-tab-in-progress");
    this.tabCompleted = page.getByTestId("katai-tab-completed");

    // KPI cards
    this.kpiTotalRecords = page.getByTestId("katai-kpi-total-records");
    this.kpiInProgress = page.getByTestId("katai-kpi-in-progress");
    this.kpiCompleted = page.getByTestId("katai-kpi-completed");
    this.kpiTotalGraded = page.getByTestId("katai-kpi-total-graded");

    // Form dialog
    this.formDialog = page.getByTestId("katai-form-dialog");
    this.formDialogTitle = page.getByTestId("katai-form-dialog-title");
    this.formCancelButton = page.getByTestId("katai-form-cancel-button");
    this.formSubmitButton = page.getByTestId("katai-form-submit-button");

    // Grading Details
    this.formKataiNoInput = page.getByTestId("katai-form-katai-no-input");
    this.formDateInput = page.getByTestId("katai-form-date-input");

    // Source Selection
    this.formPartySelect = page.getByTestId("katai-form-party-select");
    this.formAmadSelect = page.getByTestId("katai-form-amad-select");
    this.formAmadInfo = page.getByTestId("katai-form-amad-info");
    this.formBagsGradedInput = page.getByTestId("katai-form-bags-graded-input");

    // Grading Output
    this.formMotaBagsInput = page.getByTestId("katai-form-mota-bags-input");
    this.formChattaBagsInput = page.getByTestId("katai-form-chatta-bags-input");
    this.formBeejBagsInput = page.getByTestId("katai-form-beej-bags-input");
    this.formMixBagsInput = page.getByTestId("katai-form-mix-bags-input");
    this.formGullaBagsInput = page.getByTestId("katai-form-gulla-bags-input");
    this.formOutputTotalDisplay = page.getByTestId("katai-form-output-total");
    this.formBalanceIndicator = page.getByTestId("katai-form-balance-indicator");

    // Labor Charges
    this.formLaborNameInput = page.getByTestId("katai-form-labor-name-input");
    this.formLaborRateInput = page.getByTestId("katai-form-labor-rate-input");
    this.formTotalChargesDisplay = page.getByTestId("katai-form-total-charges");

    // Remarks
    this.formRemarksInput = page.getByTestId("katai-form-remarks-input");

    // Table
    this.dataTable = page.getByTestId("katai-data-table");
    this.tableRows = page.locator('[data-testid^="katai-row-"]');
    this.emptyState = page.getByTestId("katai-empty-state");
  }

  async goto() {
    await super.goto("/trading/katai");
    await expect(this.kataiPage).toBeVisible({ timeout: 15_000 });
  }

  async openNewGradingDialog() {
    await this.newGradingButton.click();
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

  async selectAmad(amadText: string) {
    await this.formAmadSelect.click();
    await this.page.getByRole("option", { name: new RegExp(amadText, "i") }).click();
  }

  async fillBagsGraded(bags: string) {
    await this.formBagsGradedInput.fill(bags);
  }

  async fillGradingOutput(data: {
    motaBags?: string;
    chattaBags?: string;
    beejBags?: string;
    mixBags?: string;
    gullaBags?: string;
  }) {
    if (data.motaBags) {
      await this.formMotaBagsInput.fill(data.motaBags);
    }
    if (data.chattaBags) {
      await this.formChattaBagsInput.fill(data.chattaBags);
    }
    if (data.beejBags) {
      await this.formBeejBagsInput.fill(data.beejBags);
    }
    if (data.mixBags) {
      await this.formMixBagsInput.fill(data.mixBags);
    }
    if (data.gullaBags) {
      await this.formGullaBagsInput.fill(data.gullaBags);
    }
  }

  async fillLaborDetails(data: { laborName?: string; laborRate?: string }) {
    if (data.laborName) {
      await this.formLaborNameInput.fill(data.laborName);
    }
    if (data.laborRate) {
      await this.formLaborRateInput.fill(data.laborRate);
    }
  }

  async fillRemarks(remarks: string) {
    await this.formRemarksInput.fill(remarks);
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async searchKatai(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async filterByStatus(status: KataiFilterTab) {
    switch (status) {
      case "all":
        await this.tabAll.click();
        break;
      case "pending":
        await this.tabPending.click();
        break;
      case "in_progress":
        await this.tabInProgress.click();
        break;
      case "completed":
        await this.tabCompleted.click();
        break;
    }
  }

  async getTabCount(tab: KataiFilterTab): Promise<number> {
    let tabElement: Locator;
    switch (tab) {
      case "all":
        tabElement = this.tabAll;
        break;
      case "pending":
        tabElement = this.tabPending;
        break;
      case "in_progress":
        tabElement = this.tabInProgress;
        break;
      case "completed":
        tabElement = this.tabCompleted;
        break;
    }
    const text = await tabElement.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getOutputTotal(): Promise<string> {
    return (await this.formOutputTotalDisplay.textContent()) ?? "0";
  }

  async getTotalCharges(): Promise<string> {
    return (await this.formTotalChargesDisplay.inputValue()) ?? "0";
  }

  async isBalanced(): Promise<boolean> {
    const indicator = await this.formBalanceIndicator.textContent();
    // Check for "✓ Balanced" specifically (not "Unbalanced")
    return indicator?.includes("✓") ?? false;
  }

  getViewButton(kataiId: string): Locator {
    return this.page.getByTestId(`katai-view-button-${kataiId}`);
  }

  getEditButton(kataiId: string): Locator {
    return this.page.getByTestId(`katai-edit-button-${kataiId}`);
  }

  getDeleteButton(kataiId: string): Locator {
    return this.page.getByTestId(`katai-delete-button-${kataiId}`);
  }

  getCompleteButton(kataiId: string): Locator {
    return this.page.getByTestId(`katai-complete-button-${kataiId}`);
  }

  async deleteKatai(kataiId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getDeleteButton(kataiId).click();
  }

  async completeKatai(kataiId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getCompleteButton(kataiId).click();
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async waitForTableLoad() {
    await this.page.waitForSelector(
      '[data-testid^="katai-row-"], [data-testid="katai-empty-state"]',
      { timeout: 10_000 }
    );
  }

  // Helper method to verify grading output is balanced
  async verifyGradingBalance(
    input: number,
    output: {
      mota: number;
      chatta: number;
      beej: number;
      mix: number;
      gulla: number;
    }
  ): Promise<boolean> {
    const total = output.mota + output.chatta + output.beej + output.mix + output.gulla;
    return total === input;
  }
}
