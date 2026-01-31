import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TakpattiPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly takpattiPage: Locator;
  readonly newTakpattiButton: Locator;
  readonly searchInput: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly form: Locator;
  readonly formNoInput: Locator;
  readonly formDateInput: Locator;
  readonly formAmadSelect: Locator;
  readonly formRoomInput: Locator;
  readonly formPkt1Input: Locator;
  readonly formPkt2Input: Locator;
  readonly formPkt3Input: Locator;
  readonly formTotalPackets: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.takpattiPage = page.getByTestId("takpatti-page");
    this.newTakpattiButton = page.getByTestId("new-takpatti-button");
    this.searchInput = page.getByTestId("takpatti-search-input");

    // Form dialog
    this.formDialog = page.getByTestId("takpatti-form-dialog");
    this.form = page.getByTestId("takpatti-form");
    this.formNoInput = page.getByTestId("takpatti-form-no-input");
    this.formDateInput = page.getByTestId("takpatti-form-date-input");
    this.formAmadSelect = page.getByTestId("takpatti-form-amad-select");
    this.formRoomInput = page.getByTestId("takpatti-form-room-input");
    this.formPkt1Input = page.getByTestId("takpatti-form-pkt1-input");
    this.formPkt2Input = page.getByTestId("takpatti-form-pkt2-input");
    this.formPkt3Input = page.getByTestId("takpatti-form-pkt3-input");
    this.formTotalPackets = page.getByTestId("takpatti-form-total-packets");
    this.formCancelButton = page.getByTestId("takpatti-form-cancel-button");
    this.formSubmitButton = page.getByTestId("takpatti-form-submit-button");
  }

  async goto() {
    await super.goto("/inventory/takpatti");
    await expect(this.takpattiPage).toBeVisible({ timeout: 15_000 });
  }

  async openNewTakpattiDialog() {
    await this.newTakpattiButton.click();
    await expect(this.formDialog).toBeVisible();
  }

  async closeFormDialog() {
    await this.formCancelButton.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async selectAmad(amadInfo: string) {
    await this.formAmadSelect.click();
    await this.page.getByRole("option", { name: new RegExp(amadInfo, "i") }).click();
  }

  async fillForm(data: {
    room?: string;
    pkt1?: string;
    pkt2?: string;
    pkt3?: string;
  }) {
    if (data.room) {
      await this.formRoomInput.fill(data.room);
    }
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

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async createTakpatti(data: {
    amadInfo?: string;
    room?: string;
    pkt1?: string;
    pkt2?: string;
    pkt3?: string;
  }) {
    await this.openNewTakpattiDialog();
    if (data.amadInfo) {
      await this.selectAmad(data.amadInfo);
    }
    await this.fillForm(data);
    await this.submitForm();
    await expect(this.formDialog).not.toBeVisible({ timeout: 10_000 });
  }

  async searchTakpatti(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async getTotalPackets(): Promise<string> {
    return (await this.formTotalPackets.textContent()) ?? "0";
  }

  getDeleteButton(takpattiId: string): Locator {
    return this.page.getByTestId(`takpatti-delete-button-${takpattiId}`);
  }

  async deleteTakpatti(takpattiId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getDeleteButton(takpattiId).click();
  }
}
