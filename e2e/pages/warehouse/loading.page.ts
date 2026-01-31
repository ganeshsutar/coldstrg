import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class LoadingPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly loadingPage: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formLoadingNoInput: Locator;
  readonly formDateInput: Locator;
  readonly formPkt1Input: Locator;
  readonly formPkt2Input: Locator;
  readonly formPkt3Input: Locator;
  readonly formTotalQuantity: Locator;
  readonly formRemarksInput: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  // Location picker
  readonly locationPicker: Locator;
  readonly locationChamberSelect: Locator;
  readonly locationFloorSelect: Locator;
  readonly locationRackSelect: Locator;

  // Amad selector
  readonly amadSelector: Locator;
  readonly amadSelectorSearchInput: Locator;
  readonly amadSelectorList: Locator;
  readonly amadSelectorSelected: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.loadingPage = page.getByTestId("loading-page");

    // Form dialog
    this.formDialog = page.getByTestId("loading-form-dialog");
    this.formLoadingNoInput = page.getByTestId("loading-form-loading-no-input");
    this.formDateInput = page.getByTestId("loading-form-date-input");
    this.formPkt1Input = page.getByTestId("loading-form-pkt1-input");
    this.formPkt2Input = page.getByTestId("loading-form-pkt2-input");
    this.formPkt3Input = page.getByTestId("loading-form-pkt3-input");
    this.formTotalQuantity = page.getByTestId("loading-form-total-quantity");
    this.formRemarksInput = page.getByTestId("loading-form-remarks-input");
    this.formCancelButton = page.getByTestId("loading-form-cancel-button");
    this.formSubmitButton = page.getByTestId("loading-form-submit-button");

    // Location picker
    this.locationPicker = page.getByTestId("location-picker");
    this.locationChamberSelect = page.getByTestId("location-chamber-select");
    this.locationFloorSelect = page.getByTestId("location-floor-select");
    this.locationRackSelect = page.getByTestId("location-rack-select");

    // Amad selector
    this.amadSelector = page.getByTestId("amad-selector");
    this.amadSelectorSearchInput = page.getByTestId("amad-selector-search-input");
    this.amadSelectorList = page.getByTestId("amad-selector-list");
    this.amadSelectorSelected = page.getByTestId("amad-selector-selected");
  }

  async goto() {
    await super.goto("/warehouse/loading");
    await expect(this.loadingPage).toBeVisible({ timeout: 15_000 });
  }

  async closeFormDialog() {
    await this.formCancelButton.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async selectChamber(chamberName: string) {
    await this.locationChamberSelect.click();
    await this.page.getByRole("option", { name: new RegExp(chamberName, "i") }).click();
  }

  async selectFloor(floorName: string) {
    await this.locationFloorSelect.click();
    await this.page.getByRole("option", { name: new RegExp(floorName, "i") }).click();
  }

  async selectRack(rackNumber: string) {
    await this.locationRackSelect.click();
    await this.page.getByRole("option", { name: new RegExp(`Rack ${rackNumber}`, "i") }).click();
  }

  async selectLocation(chamber: string, floor: string, rack: string) {
    await this.selectChamber(chamber);
    await this.selectFloor(floor);
    await this.selectRack(rack);
  }

  async searchAmad(searchTerm: string) {
    await this.amadSelectorSearchInput.fill(searchTerm);
  }

  async selectAmadById(amadId: string) {
    await this.page.getByTestId(`amad-selector-item-${amadId}`).click();
  }

  async selectFirstAmad() {
    await this.amadSelectorList.locator("button").first().click();
  }

  async fillPackets(data: { pkt1?: string; pkt2?: string; pkt3?: string }) {
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

  async fillRemarks(remarks: string) {
    await this.formRemarksInput.fill(remarks);
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async getTotalQuantity(): Promise<string> {
    return (await this.formTotalQuantity.textContent()) ?? "0";
  }

  async createLoading(data: {
    chamber: string;
    floor: string;
    rack: string;
    pkt1?: string;
    pkt2?: string;
    pkt3?: string;
    remarks?: string;
  }) {
    // Dialog should already be open
    await this.selectLocation(data.chamber, data.floor, data.rack);
    await this.selectFirstAmad();
    await this.fillPackets({
      pkt1: data.pkt1,
      pkt2: data.pkt2,
      pkt3: data.pkt3,
    });
    if (data.remarks) {
      await this.fillRemarks(data.remarks);
    }
    await this.submitForm();
    await expect(this.formDialog).not.toBeVisible({ timeout: 10_000 });
  }
}
