import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class NikasiPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly nikasiPage: Locator;
  readonly newNikasiButton: Locator;
  readonly searchInput: Locator;

  // KPI cards
  readonly kpiTodayDispatch: Locator;
  readonly kpiMonthRevenue: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formSerialInput: Locator;
  readonly formDateInput: Locator;
  readonly formAmadSelect: Locator;
  readonly formPartyInput: Locator;
  readonly formReceiverInput: Locator;
  readonly formVehicleInput: Locator;

  // Step 2 fields
  readonly formPkt1Input: Locator;
  readonly formPkt2Input: Locator;
  readonly formPkt3Input: Locator;
  readonly formTotalPackets: Locator;

  // Step 3 fields
  readonly formStorageDaysInput: Locator;
  readonly formRateInput: Locator;
  readonly formRentAmount: Locator;
  readonly formLoadingInput: Locator;
  readonly formUnloadingInput: Locator;
  readonly formDumpingInput: Locator;
  readonly formCgstInput: Locator;
  readonly formSgstInput: Locator;
  readonly formIgstInput: Locator;
  readonly formBillAmount: Locator;

  // Navigation buttons
  readonly formBackButton: Locator;
  readonly formNextButton: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.nikasiPage = page.getByTestId("nikasi-page");
    this.newNikasiButton = page.getByTestId("new-nikasi-button");
    this.searchInput = page.getByTestId("nikasi-search-input");

    // KPI cards
    this.kpiTodayDispatch = page.getByTestId("nikasi-kpi-today-dispatch");
    this.kpiMonthRevenue = page.getByTestId("nikasi-kpi-month-revenue");

    // Form dialog - Step 1
    this.formDialog = page.getByTestId("nikasi-form-dialog");
    this.formSerialInput = page.getByTestId("nikasi-form-serial-input");
    this.formDateInput = page.getByTestId("nikasi-form-date-input");
    this.formAmadSelect = page.getByTestId("nikasi-form-amad-select");
    this.formPartyInput = page.getByTestId("nikasi-form-party-input");
    this.formReceiverInput = page.getByTestId("nikasi-form-receiver-input");
    this.formVehicleInput = page.getByTestId("nikasi-form-vehicle-input");

    // Step 2
    this.formPkt1Input = page.getByTestId("nikasi-form-pkt1-input");
    this.formPkt2Input = page.getByTestId("nikasi-form-pkt2-input");
    this.formPkt3Input = page.getByTestId("nikasi-form-pkt3-input");
    this.formTotalPackets = page.getByTestId("nikasi-form-total-packets");

    // Step 3
    this.formStorageDaysInput = page.getByTestId("nikasi-form-storage-days-input");
    this.formRateInput = page.getByTestId("nikasi-form-rate-input");
    this.formRentAmount = page.getByTestId("nikasi-form-rent-amount");
    this.formLoadingInput = page.getByTestId("nikasi-form-loading-input");
    this.formUnloadingInput = page.getByTestId("nikasi-form-unloading-input");
    this.formDumpingInput = page.getByTestId("nikasi-form-dumping-input");
    this.formCgstInput = page.getByTestId("nikasi-form-cgst-input");
    this.formSgstInput = page.getByTestId("nikasi-form-sgst-input");
    this.formIgstInput = page.getByTestId("nikasi-form-igst-input");
    this.formBillAmount = page.getByTestId("nikasi-form-bill-amount");

    // Navigation
    this.formBackButton = page.getByTestId("nikasi-form-back-button");
    this.formNextButton = page.getByTestId("nikasi-form-next-button");
    this.formCancelButton = page.getByTestId("nikasi-form-cancel-button");
    this.formSubmitButton = page.getByTestId("nikasi-form-submit-button");
  }

  async goto() {
    await super.goto("/inventory/nikasi");
    await expect(this.nikasiPage).toBeVisible({ timeout: 15_000 });
  }

  async openNewNikasiDialog() {
    await this.newNikasiButton.click();
    await expect(this.formDialog).toBeVisible();
  }

  async closeFormDialog() {
    await this.formCancelButton.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async goToNextStep() {
    await this.formNextButton.click();
  }

  async goToPreviousStep() {
    await this.formBackButton.click();
  }

  async selectAmad(amadInfo: string) {
    await this.formAmadSelect.click();
    await this.page.getByRole("option", { name: new RegExp(amadInfo, "i") }).click();
  }

  async fillStep1(data: {
    partyName?: string;
    receiverName?: string;
    vehicleNo?: string;
  }) {
    if (data.partyName) {
      await this.formPartyInput.fill(data.partyName);
    }
    if (data.receiverName) {
      await this.formReceiverInput.fill(data.receiverName);
    }
    if (data.vehicleNo) {
      await this.formVehicleInput.fill(data.vehicleNo);
    }
  }

  async fillStep2(data: { pkt1?: string; pkt2?: string; pkt3?: string }) {
    if (data.pkt1) {
      await this.formPkt1Input.fill(data.pkt1);
    }
    if (data.pkt2) {
      await this.formPkt2Input.fill(data.pkt2);
    }
    if (data.pkt3) {
      await this.formPkt3Input.fill(data.pkt3);
    }
  }

  async fillStep3(data: {
    storageDays?: string;
    rate?: string;
    loading?: string;
    unloading?: string;
    dumping?: string;
    cgst?: string;
    sgst?: string;
    igst?: string;
  }) {
    if (data.storageDays) {
      await this.formStorageDaysInput.fill(data.storageDays);
    }
    if (data.rate) {
      await this.formRateInput.fill(data.rate);
    }
    if (data.loading) {
      await this.formLoadingInput.fill(data.loading);
    }
    if (data.unloading) {
      await this.formUnloadingInput.fill(data.unloading);
    }
    if (data.dumping) {
      await this.formDumpingInput.fill(data.dumping);
    }
    if (data.cgst) {
      await this.formCgstInput.fill(data.cgst);
    }
    if (data.sgst) {
      await this.formSgstInput.fill(data.sgst);
    }
    if (data.igst) {
      await this.formIgstInput.fill(data.igst);
    }
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async searchNikasi(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async getTotalPackets(): Promise<string> {
    return (await this.formTotalPackets.textContent()) ?? "0";
  }

  async getBillAmount(): Promise<string> {
    return (await this.formBillAmount.textContent()) ?? "0";
  }

  async getKpiTodayDispatch(): Promise<string> {
    const card = this.kpiTodayDispatch;
    const title = await card.locator('[data-slot="card-title"]').textContent();
    return title ?? "0";
  }

  async getKpiMonthRevenue(): Promise<string> {
    const card = this.kpiMonthRevenue;
    const title = await card.locator('[data-slot="card-title"]').textContent();
    return title ?? "0";
  }

  getEditButton(nikasiId: string): Locator {
    return this.page.getByTestId(`nikasi-edit-button-${nikasiId}`);
  }

  getDeleteButton(nikasiId: string): Locator {
    return this.page.getByTestId(`nikasi-delete-button-${nikasiId}`);
  }

  async deleteNikasi(nikasiId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getDeleteButton(nikasiId).click();
  }
}
