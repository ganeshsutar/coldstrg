import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export type SaudaFilterTab = "all" | "open" | "partial" | "completed";

export class SaudaPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly saudaPage: Locator;
  readonly newDealButton: Locator;
  readonly searchInput: Locator;

  // Tab filters
  readonly tabAll: Locator;
  readonly tabOpen: Locator;
  readonly tabPartial: Locator;
  readonly tabCompleted: Locator;

  // KPI cards
  readonly kpiOpenDeals: Locator;
  readonly kpiPartialDispatch: Locator;
  readonly kpiTotalValue: Locator;
  readonly kpiDispatched: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formDialogTitle: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  // Deal Information section
  readonly formSaudaNoInput: Locator;
  readonly formDateInput: Locator;
  readonly formDueDaysInput: Locator;
  readonly formDueDateDisplay: Locator;

  // Parties section
  readonly formSellerSelect: Locator;
  readonly formBuyerSelect: Locator;
  readonly formBuyerContactInput: Locator;
  readonly formBuyerLocationInput: Locator;

  // Deal Details section
  readonly formCommodityInput: Locator;
  readonly formVarietyInput: Locator;
  readonly formQuantityInput: Locator;
  readonly formRateInput: Locator;
  readonly formAmountDisplay: Locator;

  // Terms section
  readonly formPaymentTermsInput: Locator;
  readonly formDeliveryLocationInput: Locator;
  readonly formRemarksInput: Locator;

  // Table elements
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.saudaPage = page.getByTestId("sauda-page");
    this.newDealButton = page.getByTestId("new-deal-button");
    this.searchInput = page.getByTestId("sauda-search-input");

    // Tab filters
    this.tabAll = page.getByTestId("sauda-tab-all");
    this.tabOpen = page.getByTestId("sauda-tab-open");
    this.tabPartial = page.getByTestId("sauda-tab-partial");
    this.tabCompleted = page.getByTestId("sauda-tab-completed");

    // KPI cards
    this.kpiOpenDeals = page.getByTestId("sauda-kpi-open-deals");
    this.kpiPartialDispatch = page.getByTestId("sauda-kpi-partial-dispatch");
    this.kpiTotalValue = page.getByTestId("sauda-kpi-total-value");
    this.kpiDispatched = page.getByTestId("sauda-kpi-dispatched");

    // Form dialog
    this.formDialog = page.getByTestId("sauda-form-dialog");
    this.formDialogTitle = page.getByTestId("sauda-form-dialog-title");
    this.formCancelButton = page.getByTestId("sauda-form-cancel-button");
    this.formSubmitButton = page.getByTestId("sauda-form-submit-button");

    // Deal Information
    this.formSaudaNoInput = page.getByTestId("sauda-form-sauda-no-input");
    this.formDateInput = page.getByTestId("sauda-form-date-input");
    this.formDueDaysInput = page.getByTestId("sauda-form-due-days-input");
    this.formDueDateDisplay = page.getByTestId("sauda-form-due-date-display");

    // Parties
    this.formSellerSelect = page.getByTestId("sauda-form-seller-select");
    this.formBuyerSelect = page.getByTestId("sauda-form-buyer-select");
    this.formBuyerContactInput = page.getByTestId("sauda-form-buyer-contact-input");
    this.formBuyerLocationInput = page.getByTestId("sauda-form-buyer-location-input");

    // Deal Details
    this.formCommodityInput = page.getByTestId("sauda-form-commodity-input");
    this.formVarietyInput = page.getByTestId("sauda-form-variety-input");
    this.formQuantityInput = page.getByTestId("sauda-form-quantity-input");
    this.formRateInput = page.getByTestId("sauda-form-rate-input");
    this.formAmountDisplay = page.getByTestId("sauda-form-amount-display");

    // Terms
    this.formPaymentTermsInput = page.getByTestId("sauda-form-payment-terms-input");
    this.formDeliveryLocationInput = page.getByTestId("sauda-form-delivery-location-input");
    this.formRemarksInput = page.getByTestId("sauda-form-remarks-input");

    // Table
    this.dataTable = page.getByTestId("sauda-data-table");
    this.tableRows = page.locator('[data-testid^="sauda-row-"]');
    this.emptyState = page.getByTestId("sauda-empty-state");
  }

  async goto() {
    await super.goto("/trading/sauda");
    await expect(this.saudaPage).toBeVisible({ timeout: 15_000 });
  }

  async openNewDealDialog() {
    await this.newDealButton.click();
    await expect(this.formDialog).toBeVisible();
  }

  async closeFormDialog() {
    await this.formCancelButton.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async selectSeller(sellerName: string) {
    await this.formSellerSelect.click();
    await this.page.getByRole("option", { name: new RegExp(sellerName, "i") }).click();
  }

  async selectBuyer(buyerName: string) {
    await this.formBuyerSelect.click();
    await this.page.getByRole("option", { name: new RegExp(buyerName, "i") }).click();
  }

  async fillDealDetails(data: {
    commodity?: string;
    variety?: string;
    quantity?: string;
    rate?: string;
  }) {
    if (data.commodity) {
      await this.formCommodityInput.fill(data.commodity);
    }
    if (data.variety) {
      await this.formVarietyInput.fill(data.variety);
    }
    if (data.quantity) {
      await this.formQuantityInput.fill(data.quantity);
    }
    if (data.rate) {
      await this.formRateInput.fill(data.rate);
    }
  }

  async fillDealInfo(data: { dueDays?: string }) {
    if (data.dueDays) {
      await this.formDueDaysInput.fill(data.dueDays);
    }
  }

  async fillTerms(data: {
    paymentTerms?: string;
    deliveryLocation?: string;
    remarks?: string;
  }) {
    if (data.paymentTerms) {
      await this.formPaymentTermsInput.fill(data.paymentTerms);
    }
    if (data.deliveryLocation) {
      await this.formDeliveryLocationInput.fill(data.deliveryLocation);
    }
    if (data.remarks) {
      await this.formRemarksInput.fill(data.remarks);
    }
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async searchDeal(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async filterByStatus(status: SaudaFilterTab) {
    switch (status) {
      case "all":
        await this.tabAll.click();
        break;
      case "open":
        await this.tabOpen.click();
        break;
      case "partial":
        await this.tabPartial.click();
        break;
      case "completed":
        await this.tabCompleted.click();
        break;
    }
  }

  async getTabCount(tab: SaudaFilterTab): Promise<number> {
    let tabElement: Locator;
    switch (tab) {
      case "all":
        tabElement = this.tabAll;
        break;
      case "open":
        tabElement = this.tabOpen;
        break;
      case "partial":
        tabElement = this.tabPartial;
        break;
      case "completed":
        tabElement = this.tabCompleted;
        break;
    }
    const text = await tabElement.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getFormAmount(): Promise<string> {
    return (await this.formAmountDisplay.inputValue()) ?? "0";
  }

  getViewButton(saudaId: string): Locator {
    return this.page.getByTestId(`sauda-view-button-${saudaId}`);
  }

  getEditButton(saudaId: string): Locator {
    return this.page.getByTestId(`sauda-edit-button-${saudaId}`);
  }

  getDeleteButton(saudaId: string): Locator {
    return this.page.getByTestId(`sauda-delete-button-${saudaId}`);
  }

  getCreateGatePassButton(saudaId: string): Locator {
    return this.page.getByTestId(`sauda-create-gp-button-${saudaId}`);
  }

  getCancelButton(saudaId: string): Locator {
    return this.page.getByTestId(`sauda-cancel-button-${saudaId}`);
  }

  getCompleteButton(saudaId: string): Locator {
    return this.page.getByTestId(`sauda-complete-button-${saudaId}`);
  }

  async deleteDeal(saudaId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getDeleteButton(saudaId).click();
  }

  async cancelDeal(saudaId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getCancelButton(saudaId).click();
  }

  async completeDeal(saudaId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getCompleteButton(saudaId).click();
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async waitForTableLoad() {
    // Wait for either rows or empty state
    await this.page.waitForSelector(
      '[data-testid^="sauda-row-"], [data-testid="sauda-empty-state"]',
      { timeout: 10_000 }
    );
  }
}
