import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class MeterReadingPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly meterReadingPage: Locator;
  readonly chamberFilter: Locator;
  readonly newMeterReadingButton: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formChamberSelect: Locator;
  readonly formMeterNumberInput: Locator;
  readonly formDateInput: Locator;
  readonly formTimeInput: Locator;
  readonly formPreviousReading: Locator;
  readonly formCurrentReadingInput: Locator;
  readonly formConsumption: Locator;
  readonly formRecordedByInput: Locator;
  readonly formRemarksInput: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.meterReadingPage = page.getByTestId("meter-reading-page");
    this.chamberFilter = page.getByTestId("meter-chamber-filter");
    this.newMeterReadingButton = page.getByTestId("new-meter-reading-button");

    // Form dialog
    this.formDialog = page.getByTestId("meter-reading-dialog");
    this.formChamberSelect = page.getByTestId("meter-form-chamber-select");
    this.formMeterNumberInput = page.getByTestId("meter-form-meter-number-input");
    this.formDateInput = page.getByTestId("meter-form-date-input");
    this.formTimeInput = page.getByTestId("meter-form-time-input");
    this.formPreviousReading = page.getByTestId("meter-form-previous-reading");
    this.formCurrentReadingInput = page.getByTestId("meter-form-current-reading-input");
    this.formConsumption = page.getByTestId("meter-form-consumption");
    this.formRecordedByInput = page.getByTestId("meter-form-recorded-by-input");
    this.formRemarksInput = page.getByTestId("meter-form-remarks-input");
    this.formCancelButton = page.getByTestId("meter-form-cancel-button");
    this.formSubmitButton = page.getByTestId("meter-form-submit-button");
  }

  async goto() {
    await super.goto("/warehouse/meter-reading");
    await expect(this.meterReadingPage).toBeVisible({ timeout: 15_000 });
  }

  async openNewMeterReadingDialog() {
    await this.newMeterReadingButton.click();
    await expect(this.formDialog).toBeVisible();
  }

  async closeFormDialog() {
    await this.formCancelButton.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async filterByChamber(chamberName: string) {
    await this.chamberFilter.click();
    await this.page.getByRole("option", { name: new RegExp(chamberName, "i") }).click();
  }

  async filterAllMeters() {
    await this.chamberFilter.click();
    await this.page.getByRole("option", { name: /All Meters/i }).click();
  }

  async selectChamber(chamberName: string) {
    await this.formChamberSelect.click();
    await this.page.getByRole("option", { name: new RegExp(chamberName, "i") }).click();
  }

  async selectGeneralMeter() {
    await this.formChamberSelect.click();
    await this.page.getByRole("option", { name: /General Meter/i }).click();
  }

  async fillMeterNumber(meterNumber: string) {
    await this.formMeterNumberInput.fill(meterNumber);
  }

  async fillDate(date: string) {
    await this.formDateInput.fill(date);
  }

  async fillTime(time: string) {
    await this.formTimeInput.fill(time);
  }

  async fillCurrentReading(reading: string) {
    await this.formCurrentReadingInput.fill(reading);
  }

  async fillRecordedBy(name: string) {
    await this.formRecordedByInput.fill(name);
  }

  async fillRemarks(remarks: string) {
    await this.formRemarksInput.fill(remarks);
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async getPreviousReading(): Promise<string> {
    return (await this.formPreviousReading.textContent()) ?? "";
  }

  async getConsumption(): Promise<string> {
    const text = await this.formConsumption.textContent();
    return text ?? "";
  }

  async createMeterReading(data: {
    meterNumber: string;
    currentReading: string;
    chamber?: string;
    recordedBy?: string;
    remarks?: string;
    date?: string;
    time?: string;
  }) {
    await this.openNewMeterReadingDialog();

    if (data.chamber) {
      await this.selectChamber(data.chamber);
    }

    await this.fillMeterNumber(data.meterNumber);

    if (data.date) {
      await this.fillDate(data.date);
    }
    if (data.time) {
      await this.fillTime(data.time);
    }

    await this.fillCurrentReading(data.currentReading);

    if (data.recordedBy) {
      await this.fillRecordedBy(data.recordedBy);
    }
    if (data.remarks) {
      await this.fillRemarks(data.remarks);
    }

    await this.submitForm();
    await expect(this.formDialog).not.toBeVisible({ timeout: 10_000 });
  }
}
