import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class TypesPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly typesPage: Locator;
  readonly addTypeButton: Locator;
  readonly searchInput: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formCodeInput: Locator;
  readonly formNameInput: Locator;
  readonly formNameHindiInput: Locator;
  readonly formRateInput: Locator;
  readonly formUnitInput: Locator;
  readonly formOpeningStockInput: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.typesPage = page.getByTestId("bardana-types-page");
    this.addTypeButton = page.getByTestId("bardana-types-add-button");
    this.searchInput = page.getByTestId("bardana-types-search-input");

    // Form dialog
    this.formDialog = page.getByTestId("bardana-types-form-dialog");
    this.formCodeInput = page.getByTestId("bardana-types-form-code-input");
    this.formNameInput = page.getByTestId("bardana-types-form-name-input");
    this.formNameHindiInput = page.getByTestId("bardana-types-form-name-hindi-input");
    this.formRateInput = page.getByTestId("bardana-types-form-rate-input");
    this.formUnitInput = page.getByTestId("bardana-types-form-unit-input");
    this.formOpeningStockInput = page.getByTestId("bardana-types-form-opening-stock-input");
    this.formCancelButton = page.getByTestId("bardana-types-form-cancel-button");
    this.formSubmitButton = page.getByTestId("bardana-types-form-submit-button");
  }

  async goto() {
    await super.goto("/bardana/types");
    await expect(this.typesPage).toBeVisible({ timeout: 15_000 });
  }

  async openAddTypeDialog() {
    await this.addTypeButton.click();
    await expect(this.formDialog).toBeVisible();
  }

  async closeFormDialog() {
    await this.formCancelButton.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async fillTypeForm(data: {
    code: string;
    name: string;
    nameHindi?: string;
    rate?: string;
    unit?: string;
    openingStock?: string;
  }) {
    await this.formCodeInput.fill(data.code);
    await this.formNameInput.fill(data.name);
    if (data.nameHindi) {
      await this.formNameHindiInput.fill(data.nameHindi);
    }
    if (data.rate) {
      await this.formRateInput.fill(data.rate);
    }
    if (data.unit) {
      await this.formUnitInput.fill(data.unit);
    }
    if (data.openingStock) {
      await this.formOpeningStockInput.fill(data.openingStock);
    }
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async searchType(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  getEditButton(typeId: string): Locator {
    return this.page.getByTestId(`bardana-types-edit-button-${typeId}`);
  }

  getDeleteButton(typeId: string): Locator {
    return this.page.getByTestId(`bardana-types-delete-button-${typeId}`);
  }

  async editType(typeId: string) {
    await this.getEditButton(typeId).click();
    await expect(this.formDialog).toBeVisible();
  }

  async deleteType(typeId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getDeleteButton(typeId).click();
  }
}
