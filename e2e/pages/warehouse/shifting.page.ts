import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class ShiftingPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly shiftingPage: Locator;

  // Wizard dialog elements
  readonly wizardDialog: Locator;
  readonly wizardProgress: Locator;
  readonly wizardBackButton: Locator;
  readonly wizardNextButton: Locator;
  readonly wizardCancelButton: Locator;
  readonly wizardConfirmButton: Locator;

  // Step containers
  readonly sourceStep: Locator;
  readonly destinationStep: Locator;
  readonly quantityStep: Locator;
  readonly confirmStep: Locator;

  // Location picker (shared)
  readonly locationPicker: Locator;
  readonly locationChamberSelect: Locator;
  readonly locationFloorSelect: Locator;
  readonly locationRackSelect: Locator;

  // Amad selector (shared)
  readonly amadSelector: Locator;
  readonly amadSelectorSearchInput: Locator;
  readonly amadSelectorList: Locator;
  readonly amadSelectorSelected: Locator;

  // Quantity form
  readonly formPkt1Input: Locator;
  readonly formPkt2Input: Locator;
  readonly formPkt3Input: Locator;
  readonly formTotalQuantity: Locator;
  readonly formReasonSelect: Locator;
  readonly formRemarksInput: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.shiftingPage = page.getByTestId("shifting-page");

    // Wizard dialog
    this.wizardDialog = page.getByTestId("shifting-wizard-dialog");
    this.wizardProgress = page.getByTestId("shifting-wizard-progress");
    this.wizardBackButton = page.getByTestId("shifting-wizard-back-button");
    this.wizardNextButton = page.getByTestId("shifting-wizard-next-button");
    this.wizardCancelButton = page.getByTestId("shifting-wizard-cancel-button");
    this.wizardConfirmButton = page.getByTestId("shifting-wizard-confirm-button");

    // Step containers
    this.sourceStep = page.getByTestId("shifting-source-step");
    this.destinationStep = page.getByTestId("shifting-destination-step");
    this.quantityStep = page.getByTestId("shifting-quantity-step");
    this.confirmStep = page.getByTestId("shifting-confirm-step");

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

    // Quantity form
    this.formPkt1Input = page.getByTestId("shifting-form-pkt1-input");
    this.formPkt2Input = page.getByTestId("shifting-form-pkt2-input");
    this.formPkt3Input = page.getByTestId("shifting-form-pkt3-input");
    this.formTotalQuantity = page.getByTestId("shifting-form-total-quantity");
    this.formReasonSelect = page.getByTestId("shifting-form-reason-select");
    this.formRemarksInput = page.getByTestId("shifting-form-remarks-input");
  }

  async goto() {
    await super.goto("/warehouse/shifting");
    await expect(this.shiftingPage).toBeVisible({ timeout: 15_000 });
  }

  async closeWizard() {
    await this.wizardCancelButton.click();
    await expect(this.wizardDialog).not.toBeVisible();
  }

  async goToNextStep() {
    await this.wizardNextButton.click();
  }

  async goToPreviousStep() {
    await this.wizardBackButton.click();
  }

  async confirmShift() {
    await this.wizardConfirmButton.click();
    await expect(this.wizardDialog).not.toBeVisible({ timeout: 10_000 });
  }

  // Step 1: Source
  async selectSourceChamber(chamberName: string) {
    await this.locationChamberSelect.click();
    await this.page.getByRole("option", { name: new RegExp(chamberName, "i") }).click();
  }

  async selectSourceFloor(floorName: string) {
    await this.locationFloorSelect.click();
    await this.page.getByRole("option", { name: new RegExp(floorName, "i") }).click();
  }

  async selectSourceRack(rackNumber: string) {
    await this.locationRackSelect.click();
    await this.page.getByRole("option", { name: new RegExp(`Rack ${rackNumber}`, "i") }).click();
  }

  async selectSourceLocation(chamber: string, floor: string, rack: string) {
    await this.selectSourceChamber(chamber);
    await this.selectSourceFloor(floor);
    await this.selectSourceRack(rack);
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

  async fillSourceStep(data: {
    chamber: string;
    floor: string;
    rack: string;
  }) {
    await this.selectSourceLocation(data.chamber, data.floor, data.rack);
    await this.selectFirstAmad();
  }

  // Step 2: Destination
  async selectDestinationChamber(chamberName: string) {
    await this.locationChamberSelect.click();
    await this.page.getByRole("option", { name: new RegExp(chamberName, "i") }).click();
  }

  async selectDestinationFloor(floorName: string) {
    await this.locationFloorSelect.click();
    await this.page.getByRole("option", { name: new RegExp(floorName, "i") }).click();
  }

  async selectDestinationRack(rackNumber: string) {
    await this.locationRackSelect.click();
    await this.page.getByRole("option", { name: new RegExp(`Rack ${rackNumber}`, "i") }).click();
  }

  async selectDestinationLocation(chamber: string, floor: string, rack: string) {
    await this.selectDestinationChamber(chamber);
    await this.selectDestinationFloor(floor);
    await this.selectDestinationRack(rack);
  }

  async fillDestinationStep(data: {
    chamber: string;
    floor: string;
    rack: string;
  }) {
    await this.selectDestinationLocation(data.chamber, data.floor, data.rack);
  }

  // Step 3: Quantity
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

  async selectReason(reason: string) {
    await this.formReasonSelect.click();
    await this.page.getByRole("option", { name: new RegExp(reason, "i") }).click();
  }

  async fillRemarks(remarks: string) {
    await this.formRemarksInput.fill(remarks);
  }

  async getTotalQuantity(): Promise<string> {
    return (await this.formTotalQuantity.textContent()) ?? "0";
  }

  async fillQuantityStep(data: {
    pkt1?: string;
    pkt2?: string;
    pkt3?: string;
    reason?: string;
    remarks?: string;
  }) {
    await this.fillPackets({
      pkt1: data.pkt1,
      pkt2: data.pkt2,
      pkt3: data.pkt3,
    });
    if (data.reason) {
      await this.selectReason(data.reason);
    }
    if (data.remarks) {
      await this.fillRemarks(data.remarks);
    }
  }

  // Complete wizard
  async completeShifting(data: {
    source: { chamber: string; floor: string; rack: string };
    destination: { chamber: string; floor: string; rack: string };
    pkt1?: string;
    pkt2?: string;
    pkt3?: string;
    reason?: string;
    remarks?: string;
  }) {
    // Step 1: Source
    await this.fillSourceStep(data.source);
    await this.goToNextStep();

    // Step 2: Destination
    await this.fillDestinationStep(data.destination);
    await this.goToNextStep();

    // Step 3: Quantity
    await this.fillQuantityStep({
      pkt1: data.pkt1,
      pkt2: data.pkt2,
      pkt3: data.pkt3,
      reason: data.reason,
      remarks: data.remarks,
    });
    await this.goToNextStep();

    // Step 4: Confirm
    await expect(this.confirmStep).toBeVisible();
    await this.confirmShift();
  }
}
