import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class StockTransferPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly transferPage: Locator;
  readonly newTransferButton: Locator;
  readonly searchInput: Locator;

  // Form dialog elements
  readonly formDialog: Locator;

  // Step 1 fields
  readonly formAmadSelect: Locator;
  readonly formAmadInfo: Locator;
  readonly formPkt1Input: Locator;
  readonly formPkt2Input: Locator;
  readonly formPkt3Input: Locator;
  readonly formTotalPackets: Locator;

  // Step 2 fields
  readonly formToPartySelect: Locator;
  readonly formDestRoomInput: Locator;

  // Step 3 fields
  readonly formSummary: Locator;
  readonly formRemarksInput: Locator;

  // Navigation buttons
  readonly formBackButton: Locator;
  readonly formNextButton: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.transferPage = page.getByTestId("transfer-page");
    this.newTransferButton = page.getByTestId("new-transfer-button");
    this.searchInput = page.getByTestId("transfer-search-input");

    // Form dialog
    this.formDialog = page.getByTestId("transfer-form-dialog");

    // Step 1
    this.formAmadSelect = page.getByTestId("transfer-form-amad-select");
    this.formAmadInfo = page.getByTestId("transfer-form-amad-info");
    this.formPkt1Input = page.getByTestId("transfer-form-pkt1-input");
    this.formPkt2Input = page.getByTestId("transfer-form-pkt2-input");
    this.formPkt3Input = page.getByTestId("transfer-form-pkt3-input");
    this.formTotalPackets = page.getByTestId("transfer-form-total-packets");

    // Step 2
    this.formToPartySelect = page.getByTestId("transfer-form-to-party-select");
    this.formDestRoomInput = page.getByTestId("transfer-form-dest-room-input");

    // Step 3
    this.formSummary = page.getByTestId("transfer-form-summary");
    this.formRemarksInput = page.getByTestId("transfer-form-remarks-input");

    // Navigation
    this.formBackButton = page.getByTestId("transfer-form-back-button");
    this.formNextButton = page.getByTestId("transfer-form-next-button");
    this.formCancelButton = page.getByTestId("transfer-form-cancel-button");
    this.formSubmitButton = page.getByTestId("transfer-form-submit-button");
  }

  async goto() {
    await super.goto("/inventory/stock-transfer");
    await expect(this.transferPage).toBeVisible({ timeout: 15_000 });
  }

  async openNewTransferDialog() {
    await this.newTransferButton.click();
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

  async fillStep1(data: { pkt1?: string; pkt2?: string; pkt3?: string }) {
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

  async selectToParty(partyName: string) {
    await this.formToPartySelect.click();
    await this.page.getByRole("option", { name: new RegExp(partyName, "i") }).click();
  }

  async fillStep2(data: { destRoom?: string }) {
    if (data.destRoom) {
      await this.formDestRoomInput.fill(data.destRoom);
    }
  }

  async fillStep3(data: { remarks?: string }) {
    if (data.remarks) {
      await this.formRemarksInput.fill(data.remarks);
    }
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async createTransfer(data: {
    amadInfo: string;
    pkt1?: string;
    pkt2?: string;
    pkt3?: string;
    toParty?: string;
    destRoom?: string;
    remarks?: string;
  }) {
    await this.openNewTransferDialog();

    // Step 1: Source
    await this.selectAmad(data.amadInfo);
    await this.fillStep1({ pkt1: data.pkt1, pkt2: data.pkt2, pkt3: data.pkt3 });
    await this.goToNextStep();

    // Step 2: Destination
    if (data.toParty) {
      await this.selectToParty(data.toParty);
    }
    await this.fillStep2({ destRoom: data.destRoom });
    await this.goToNextStep();

    // Step 3: Confirm
    await this.fillStep3({ remarks: data.remarks });
    await this.submitForm();

    await expect(this.formDialog).not.toBeVisible({ timeout: 10_000 });
  }

  async searchTransfer(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async getTotalPackets(): Promise<string> {
    return (await this.formTotalPackets.textContent()) ?? "0";
  }

  getDeleteButton(transferId: string): Locator {
    return this.page.getByTestId(`transfer-delete-button-${transferId}`);
  }

  async deleteTransfer(transferId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getDeleteButton(transferId).click();
  }
}
