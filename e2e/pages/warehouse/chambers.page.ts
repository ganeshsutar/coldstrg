import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class ChambersPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly chambersPage: Locator;
  readonly newChamberButton: Locator;
  readonly searchInput: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formCodeInput: Locator;
  readonly formRoomNumberInput: Locator;
  readonly formStatusSelect: Locator;
  readonly formNameInput: Locator;
  readonly formNameHindiInput: Locator;
  readonly formFloorsInput: Locator;
  readonly formTotalRacksInput: Locator;
  readonly formRacksPerRowInput: Locator;
  readonly formRackCapacityInput: Locator;
  readonly formTargetTempInput: Locator;
  readonly formMinTempInput: Locator;
  readonly formMaxTempInput: Locator;
  readonly formDescriptionInput: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  // Floor config dialog
  readonly floorConfigDialog: Locator;
  readonly addFloorButton: Locator;
  readonly floorConfigCancelButton: Locator;
  readonly floorConfigSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.chambersPage = page.getByTestId("chambers-page");
    this.newChamberButton = page.getByTestId("new-chamber-button");
    this.searchInput = page.getByTestId("chambers-search-input");

    // Form dialog
    this.formDialog = page.getByTestId("chamber-form-dialog");
    this.formCodeInput = page.getByTestId("chamber-form-code-input");
    this.formRoomNumberInput = page.getByTestId("chamber-form-room-number-input");
    this.formStatusSelect = page.getByTestId("chamber-form-status-select");
    this.formNameInput = page.getByTestId("chamber-form-name-input");
    this.formNameHindiInput = page.getByTestId("chamber-form-name-hindi-input");
    this.formFloorsInput = page.getByTestId("chamber-form-floors-input");
    this.formTotalRacksInput = page.getByTestId("chamber-form-total-racks-input");
    this.formRacksPerRowInput = page.getByTestId("chamber-form-racks-per-row-input");
    this.formRackCapacityInput = page.getByTestId("chamber-form-rack-capacity-input");
    this.formTargetTempInput = page.getByTestId("chamber-form-target-temp-input");
    this.formMinTempInput = page.getByTestId("chamber-form-min-temp-input");
    this.formMaxTempInput = page.getByTestId("chamber-form-max-temp-input");
    this.formDescriptionInput = page.getByTestId("chamber-form-description-input");
    this.formCancelButton = page.getByTestId("chamber-form-cancel-button");
    this.formSubmitButton = page.getByTestId("chamber-form-submit-button");

    // Floor config dialog
    this.floorConfigDialog = page.getByTestId("floor-config-dialog");
    this.addFloorButton = page.getByTestId("add-floor-button");
    this.floorConfigCancelButton = page.getByTestId("floor-config-cancel-button");
    this.floorConfigSubmitButton = page.getByTestId("floor-config-submit-button");
  }

  async goto() {
    await super.goto("/warehouse/chambers");
    await expect(this.chambersPage).toBeVisible({ timeout: 15_000 });
  }

  async openNewChamberDialog() {
    await this.newChamberButton.click();
    await expect(this.formDialog).toBeVisible();
  }

  async closeFormDialog() {
    await this.formCancelButton.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async fillBasicInfo(data: {
    name?: string;
    nameHindi?: string;
    roomNumber?: string;
    code?: string;
  }) {
    if (data.name) {
      await this.formNameInput.fill(data.name);
    }
    if (data.nameHindi) {
      await this.formNameHindiInput.fill(data.nameHindi);
    }
    if (data.roomNumber) {
      await this.formRoomNumberInput.fill(data.roomNumber);
    }
    if (data.code) {
      await this.formCodeInput.fill(data.code);
    }
  }

  async fillRackConfig(data: {
    floors?: string;
    totalRacks?: string;
    racksPerRow?: string;
    rackCapacity?: string;
  }) {
    if (data.floors) {
      await this.formFloorsInput.fill(data.floors);
    }
    if (data.totalRacks) {
      await this.formTotalRacksInput.fill(data.totalRacks);
    }
    if (data.racksPerRow) {
      await this.formRacksPerRowInput.fill(data.racksPerRow);
    }
    if (data.rackCapacity) {
      await this.formRackCapacityInput.fill(data.rackCapacity);
    }
  }

  async fillTemperatureConfig(data: {
    targetTemperature?: string;
    minTemperature?: string;
    maxTemperature?: string;
  }) {
    if (data.targetTemperature) {
      await this.formTargetTempInput.fill(data.targetTemperature);
    }
    if (data.minTemperature) {
      await this.formMinTempInput.fill(data.minTemperature);
    }
    if (data.maxTemperature) {
      await this.formMaxTempInput.fill(data.maxTemperature);
    }
  }

  async fillDescription(description: string) {
    await this.formDescriptionInput.fill(description);
  }

  async selectStatus(status: "active" | "inactive") {
    await this.formStatusSelect.click();
    await this.page.getByRole("option", { name: new RegExp(status, "i") }).click();
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async createChamber(data: {
    name: string;
    nameHindi?: string;
    roomNumber?: string;
    floors?: string;
    totalRacks?: string;
    racksPerRow?: string;
    rackCapacity?: string;
    targetTemperature?: string;
    minTemperature?: string;
    maxTemperature?: string;
    description?: string;
  }) {
    await this.openNewChamberDialog();
    await this.fillBasicInfo({
      name: data.name,
      nameHindi: data.nameHindi,
      roomNumber: data.roomNumber,
    });
    await this.fillRackConfig({
      floors: data.floors,
      totalRacks: data.totalRacks,
      racksPerRow: data.racksPerRow,
      rackCapacity: data.rackCapacity,
    });
    await this.fillTemperatureConfig({
      targetTemperature: data.targetTemperature,
      minTemperature: data.minTemperature,
      maxTemperature: data.maxTemperature,
    });
    if (data.description) {
      await this.fillDescription(data.description);
    }
    await this.submitForm();
    await expect(this.formDialog).not.toBeVisible({ timeout: 10_000 });
  }

  async searchChambers(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  // Row action buttons
  getEditButton(chamberId: string): Locator {
    return this.page.getByTestId(`chamber-edit-button-${chamberId}`);
  }

  getFloorsButton(chamberId: string): Locator {
    return this.page.getByTestId(`chamber-floors-button-${chamberId}`);
  }

  getDeleteButton(chamberId: string): Locator {
    return this.page.getByTestId(`chamber-delete-button-${chamberId}`);
  }

  async openEditDialog(chamberId: string) {
    await this.getEditButton(chamberId).click();
    await expect(this.formDialog).toBeVisible();
  }

  async openFloorsDialog(chamberId: string) {
    await this.getFloorsButton(chamberId).click();
    await expect(this.floorConfigDialog).toBeVisible();
  }

  async deleteChamber(chamberId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getDeleteButton(chamberId).click();
  }

  // Floor config methods
  getFloorRow(index: number): Locator {
    return this.page.getByTestId(`floor-row-${index}`);
  }

  getFloorNumberInput(index: number): Locator {
    return this.page.getByTestId(`floor-number-input-${index}`);
  }

  getFloorNameInput(index: number): Locator {
    return this.page.getByTestId(`floor-name-input-${index}`);
  }

  getFloorFromRackInput(index: number): Locator {
    return this.page.getByTestId(`floor-from-rack-input-${index}`);
  }

  getFloorToRackInput(index: number): Locator {
    return this.page.getByTestId(`floor-to-rack-input-${index}`);
  }

  getFloorRacksPerRowInput(index: number): Locator {
    return this.page.getByTestId(`floor-racks-per-row-input-${index}`);
  }

  getFloorDeleteButton(index: number): Locator {
    return this.page.getByTestId(`floor-delete-button-${index}`);
  }

  async addFloor() {
    await this.addFloorButton.click();
  }

  async fillFloorConfig(
    index: number,
    data: {
      floorNumber?: string;
      floorName?: string;
      fromRack?: string;
      toRack?: string;
      racksPerRow?: string;
    }
  ) {
    if (data.floorNumber) {
      await this.getFloorNumberInput(index).fill(data.floorNumber);
    }
    if (data.floorName) {
      await this.getFloorNameInput(index).fill(data.floorName);
    }
    if (data.fromRack) {
      await this.getFloorFromRackInput(index).fill(data.fromRack);
    }
    if (data.toRack) {
      await this.getFloorToRackInput(index).fill(data.toRack);
    }
    if (data.racksPerRow) {
      await this.getFloorRacksPerRowInput(index).fill(data.racksPerRow);
    }
  }

  async saveFloorConfig() {
    await this.floorConfigSubmitButton.click();
    await expect(this.floorConfigDialog).not.toBeVisible({ timeout: 10_000 });
  }

  async closeFloorConfigDialog() {
    await this.floorConfigCancelButton.click();
    await expect(this.floorConfigDialog).not.toBeVisible();
  }
}
