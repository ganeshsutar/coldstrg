import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TemperaturePage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly temperaturePage: Locator;
  readonly chamberFilter: Locator;
  readonly newTempLogButton: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formChamberSelect: Locator;
  readonly formDateInput: Locator;
  readonly formTimeInput: Locator;
  readonly formLowTempInput: Locator;
  readonly formHighTempInput: Locator;
  readonly formHumidityInput: Locator;
  readonly formRecordedByInput: Locator;
  readonly formRemarksInput: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.temperaturePage = page.getByTestId("temperature-page");
    this.chamberFilter = page.getByTestId("temp-chamber-filter");
    this.newTempLogButton = page.getByTestId("new-temp-log-button");

    // Form dialog
    this.formDialog = page.getByTestId("temp-log-dialog");
    this.formChamberSelect = page.getByTestId("temp-form-chamber-select");
    this.formDateInput = page.getByTestId("temp-form-date-input");
    this.formTimeInput = page.getByTestId("temp-form-time-input");
    this.formLowTempInput = page.getByTestId("temp-form-low-temp-input");
    this.formHighTempInput = page.getByTestId("temp-form-high-temp-input");
    this.formHumidityInput = page.getByTestId("temp-form-humidity-input");
    this.formRecordedByInput = page.getByTestId("temp-form-recorded-by-input");
    this.formRemarksInput = page.getByTestId("temp-form-remarks-input");
    this.formCancelButton = page.getByTestId("temp-form-cancel-button");
    this.formSubmitButton = page.getByTestId("temp-form-submit-button");
  }

  async goto() {
    await super.goto("/warehouse/temperature");
    await expect(this.temperaturePage).toBeVisible({ timeout: 15_000 });
  }

  async openNewTempLogDialog() {
    await this.newTempLogButton.click();
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

  async filterAllChambers() {
    await this.chamberFilter.click();
    await this.page.getByRole("option", { name: /All Chambers/i }).click();
  }

  async selectChamber(chamberName: string) {
    await this.formChamberSelect.click();
    await this.page.getByRole("option", { name: new RegExp(chamberName, "i") }).click();
  }

  async fillDate(date: string) {
    await this.formDateInput.fill(date);
  }

  async fillTime(time: string) {
    await this.formTimeInput.fill(time);
  }

  async fillTemperatureReadings(data: {
    lowTemp: string;
    highTemp: string;
  }) {
    await this.formLowTempInput.fill(data.lowTemp);
    await this.formHighTempInput.fill(data.highTemp);
  }

  async fillHumidity(humidity: string) {
    await this.formHumidityInput.fill(humidity);
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

  async createTemperatureLog(data: {
    chamber: string;
    lowTemp: string;
    highTemp: string;
    humidity?: string;
    recordedBy?: string;
    remarks?: string;
    date?: string;
    time?: string;
  }) {
    await this.openNewTempLogDialog();
    await this.selectChamber(data.chamber);

    if (data.date) {
      await this.fillDate(data.date);
    }
    if (data.time) {
      await this.fillTime(data.time);
    }

    await this.fillTemperatureReadings({
      lowTemp: data.lowTemp,
      highTemp: data.highTemp,
    });

    if (data.humidity) {
      await this.fillHumidity(data.humidity);
    }
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
