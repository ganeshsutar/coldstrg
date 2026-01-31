import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export type GatePassFilterTab = "all" | "today" | "pending" | "week";

export class GatePassPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly gatePassPage: Locator;
  readonly newGatePassButton: Locator;
  readonly searchInput: Locator;

  // Tab filters
  readonly tabAll: Locator;
  readonly tabToday: Locator;
  readonly tabPending: Locator;
  readonly tabWeek: Locator;

  // KPI cards
  readonly kpiToday: Locator;
  readonly kpiPendingPrint: Locator;
  readonly kpiThisWeek: Locator;
  readonly kpiTotalBags: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formDialogTitle: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  // Gate Pass Details section
  readonly formGpNoInput: Locator;
  readonly formDateInput: Locator;
  readonly formTimeInput: Locator;

  // Party & Deal section
  readonly formSaudaSelect: Locator;
  readonly formRateInput: Locator;
  readonly formSellerSelect: Locator;
  readonly formBuyerSelect: Locator;
  readonly formBuyerLocationInput: Locator;

  // Amad Selection section
  readonly formAmadSelector: Locator;
  readonly formTotalPacketsDisplay: Locator;

  // Transport Details section
  readonly formTransportInput: Locator;
  readonly formVehicleNoInput: Locator;
  readonly formDriverNameInput: Locator;
  readonly formDriverContactInput: Locator;
  readonly formBiltiNoInput: Locator;

  // Remarks
  readonly formRemarksInput: Locator;

  // Print Preview Dialog
  readonly printPreviewDialog: Locator;
  readonly printPreviewCloseButton: Locator;
  readonly printButton: Locator;
  readonly downloadPdfButton: Locator;

  // Table elements
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.gatePassPage = page.getByTestId("gate-pass-page");
    this.newGatePassButton = page.getByTestId("new-gate-pass-button");
    this.searchInput = page.getByTestId("gate-pass-search-input");

    // Tab filters
    this.tabAll = page.getByTestId("gate-pass-tab-all");
    this.tabToday = page.getByTestId("gate-pass-tab-today");
    this.tabPending = page.getByTestId("gate-pass-tab-pending");
    this.tabWeek = page.getByTestId("gate-pass-tab-week");

    // KPI cards
    this.kpiToday = page.getByTestId("gate-pass-kpi-today");
    this.kpiPendingPrint = page.getByTestId("gate-pass-kpi-pending-print");
    this.kpiThisWeek = page.getByTestId("gate-pass-kpi-this-week");
    this.kpiTotalBags = page.getByTestId("gate-pass-kpi-total-bags");

    // Form dialog
    this.formDialog = page.getByTestId("gate-pass-form-dialog");
    this.formDialogTitle = page.getByTestId("gate-pass-form-dialog-title");
    this.formCancelButton = page.getByTestId("gate-pass-form-cancel-button");
    this.formSubmitButton = page.getByTestId("gate-pass-form-submit-button");

    // Gate Pass Details
    this.formGpNoInput = page.getByTestId("gate-pass-form-gp-no-input");
    this.formDateInput = page.getByTestId("gate-pass-form-date-input");
    this.formTimeInput = page.getByTestId("gate-pass-form-time-input");

    // Party & Deal
    this.formSaudaSelect = page.getByTestId("gate-pass-form-sauda-select");
    this.formRateInput = page.getByTestId("gate-pass-form-rate-input");
    this.formSellerSelect = page.getByTestId("gate-pass-form-seller-select");
    this.formBuyerSelect = page.getByTestId("gate-pass-form-buyer-select");
    this.formBuyerLocationInput = page.getByTestId("gate-pass-form-buyer-location-input");

    // Amad Selection
    this.formAmadSelector = page.getByTestId("gate-pass-form-amad-selector");
    this.formTotalPacketsDisplay = page.getByTestId("gate-pass-form-total-packets");

    // Transport Details
    this.formTransportInput = page.getByTestId("gate-pass-form-transport-input");
    this.formVehicleNoInput = page.getByTestId("gate-pass-form-vehicle-no-input");
    this.formDriverNameInput = page.getByTestId("gate-pass-form-driver-name-input");
    this.formDriverContactInput = page.getByTestId("gate-pass-form-driver-contact-input");
    this.formBiltiNoInput = page.getByTestId("gate-pass-form-bilti-no-input");

    // Remarks
    this.formRemarksInput = page.getByTestId("gate-pass-form-remarks-input");

    // Print Preview Dialog
    this.printPreviewDialog = page.getByTestId("gate-pass-print-preview-dialog");
    this.printPreviewCloseButton = page.getByTestId("gate-pass-print-preview-close");
    this.printButton = page.getByTestId("gate-pass-print-button");
    this.downloadPdfButton = page.getByTestId("gate-pass-download-pdf-button");

    // Table
    this.dataTable = page.getByTestId("gate-pass-data-table");
    this.tableRows = page.locator('[data-testid^="gate-pass-row-"]');
    this.emptyState = page.getByTestId("gate-pass-empty-state");
  }

  async goto() {
    await super.goto("/trading/gate-pass");
    await expect(this.gatePassPage).toBeVisible({ timeout: 15_000 });
  }

  async openNewGatePassDialog() {
    await this.newGatePassButton.click();
    await expect(this.formDialog).toBeVisible();
  }

  async closeFormDialog() {
    await this.formCancelButton.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async selectSauda(saudaText: string) {
    await this.formSaudaSelect.click();
    await this.page.getByRole("option", { name: new RegExp(saudaText, "i") }).click();
  }

  async selectSeller(sellerName: string) {
    await this.formSellerSelect.click();
    await this.page.getByRole("option", { name: new RegExp(sellerName, "i") }).click();
  }

  async selectBuyer(buyerName: string) {
    await this.formBuyerSelect.click();
    await this.page.getByRole("option", { name: new RegExp(buyerName, "i") }).click();
  }

  async fillTransportDetails(data: {
    transport?: string;
    vehicleNo?: string;
    driverName?: string;
    driverContact?: string;
    biltiNo?: string;
  }) {
    if (data.transport) {
      await this.formTransportInput.fill(data.transport);
    }
    if (data.vehicleNo) {
      await this.formVehicleNoInput.fill(data.vehicleNo);
    }
    if (data.driverName) {
      await this.formDriverNameInput.fill(data.driverName);
    }
    if (data.driverContact) {
      await this.formDriverContactInput.fill(data.driverContact);
    }
    if (data.biltiNo) {
      await this.formBiltiNoInput.fill(data.biltiNo);
    }
  }

  async fillRate(rate: string) {
    await this.formRateInput.fill(rate);
  }

  async fillBuyerLocation(location: string) {
    await this.formBuyerLocationInput.fill(location);
  }

  async fillRemarks(remarks: string) {
    await this.formRemarksInput.fill(remarks);
  }

  async selectAmad(amadNo: string, packets: { pkt1?: string; pkt2?: string; pkt3?: string }) {
    // Click on the amad checkbox
    const amadCheckbox = this.page.getByTestId(`amad-select-${amadNo}`);
    await amadCheckbox.click();

    // Fill in packet counts if provided
    if (packets.pkt1) {
      const pkt1Input = this.page.getByTestId(`amad-pkt1-${amadNo}`);
      await pkt1Input.fill(packets.pkt1);
    }
    if (packets.pkt2) {
      const pkt2Input = this.page.getByTestId(`amad-pkt2-${amadNo}`);
      await pkt2Input.fill(packets.pkt2);
    }
    if (packets.pkt3) {
      const pkt3Input = this.page.getByTestId(`amad-pkt3-${amadNo}`);
      await pkt3Input.fill(packets.pkt3);
    }
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async searchGatePass(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async filterByStatus(status: GatePassFilterTab) {
    switch (status) {
      case "all":
        await this.tabAll.click();
        break;
      case "today":
        await this.tabToday.click();
        break;
      case "pending":
        await this.tabPending.click();
        break;
      case "week":
        await this.tabWeek.click();
        break;
    }
  }

  async getTabCount(tab: GatePassFilterTab): Promise<number> {
    let tabElement: Locator;
    switch (tab) {
      case "all":
        tabElement = this.tabAll;
        break;
      case "today":
        tabElement = this.tabToday;
        break;
      case "pending":
        tabElement = this.tabPending;
        break;
      case "week":
        tabElement = this.tabWeek;
        break;
    }
    const text = await tabElement.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  getViewButton(gpId: string): Locator {
    return this.page.getByTestId(`gate-pass-view-button-${gpId}`);
  }

  getEditButton(gpId: string): Locator {
    return this.page.getByTestId(`gate-pass-edit-button-${gpId}`);
  }

  getDeleteButton(gpId: string): Locator {
    return this.page.getByTestId(`gate-pass-delete-button-${gpId}`);
  }

  getPrintButton(gpId: string): Locator {
    return this.page.getByTestId(`gate-pass-print-button-${gpId}`);
  }

  getConfirmButton(gpId: string): Locator {
    return this.page.getByTestId(`gate-pass-confirm-button-${gpId}`);
  }

  getMarkDoneButton(gpId: string): Locator {
    return this.page.getByTestId(`gate-pass-mark-done-button-${gpId}`);
  }

  getCancelButton(gpId: string): Locator {
    return this.page.getByTestId(`gate-pass-cancel-button-${gpId}`);
  }

  async deleteGatePass(gpId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getDeleteButton(gpId).click();
  }

  async confirmGatePass(gpId: string) {
    await this.getConfirmButton(gpId).click();
  }

  async markGatePassDone(gpId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getMarkDoneButton(gpId).click();
  }

  async cancelGatePass(gpId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getCancelButton(gpId).click();
  }

  async openPrintPreview(gpId: string) {
    await this.getViewButton(gpId).click();
    await expect(this.printPreviewDialog).toBeVisible();
  }

  async closePrintPreview() {
    await this.printPreviewCloseButton.click();
    await expect(this.printPreviewDialog).not.toBeVisible();
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async waitForTableLoad() {
    await this.page.waitForSelector(
      '[data-testid^="gate-pass-row-"], [data-testid="gate-pass-empty-state"]',
      { timeout: 10_000 }
    );
  }
}
