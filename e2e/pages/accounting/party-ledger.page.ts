import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class PartyLedgerPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly partyLedgerPage: Locator;
  readonly addPartyButton: Locator;
  readonly searchInput: Locator;

  // Tab filters
  readonly tabAll: Locator;
  readonly tabDebtors: Locator;
  readonly tabCreditors: Locator;

  // KPI Cards
  readonly kpiCards: Locator;
  readonly kpiTotalDebtors: Locator;
  readonly kpiTotalDebtorsValue: Locator;
  readonly kpiTotalCreditors: Locator;
  readonly kpiTotalCreditorsValue: Locator;
  readonly kpiPendingRent: Locator;
  readonly kpiPendingInterest: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formTypeSelect: Locator;
  readonly formParentSelect: Locator;
  readonly formCodeInput: Locator;
  readonly formNatureSelect: Locator;
  readonly formNameInput: Locator;
  readonly formNameHindiInput: Locator;
  readonly formPhoneInput: Locator;
  readonly formOpeningBalanceInput: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.partyLedgerPage = page.getByTestId("party-ledger-page");
    this.addPartyButton = page.getByTestId("add-party-button");
    this.searchInput = page.getByTestId("party-search-input");

    // Tab filters
    this.tabAll = page.getByTestId("party-tab-all");
    this.tabDebtors = page.getByTestId("party-tab-debtors");
    this.tabCreditors = page.getByTestId("party-tab-creditors");

    // KPI Cards
    this.kpiCards = page.getByTestId("party-kpi-cards");
    this.kpiTotalDebtors = page.getByTestId("kpi-total-debtors");
    this.kpiTotalDebtorsValue = page.getByTestId("kpi-total-debtors-value");
    this.kpiTotalCreditors = page.getByTestId("kpi-total-creditors");
    this.kpiTotalCreditorsValue = page.getByTestId("kpi-total-creditors-value");
    this.kpiPendingRent = page.getByTestId("kpi-pending-rent");
    this.kpiPendingInterest = page.getByTestId("kpi-pending-interest");

    // Form dialog elements
    this.formDialog = page.getByTestId("party-form-dialog");
    this.formTypeSelect = page.getByTestId("party-form-type-select");
    this.formParentSelect = page.getByTestId("party-form-parent-select");
    this.formCodeInput = page.getByTestId("party-form-code-input");
    this.formNatureSelect = page.getByTestId("party-form-nature-select");
    this.formNameInput = page.getByTestId("party-form-name-input");
    this.formNameHindiInput = page.getByTestId("party-form-name-hindi-input");
    this.formPhoneInput = page.getByTestId("party-form-phone-input");
    this.formOpeningBalanceInput = page.getByTestId("party-form-opening-balance-input");
    this.formCancelButton = page.getByTestId("party-form-cancel-button");
    this.formSubmitButton = page.getByTestId("party-form-submit-button");
  }

  async goto() {
    await super.goto("/accounts/party-ledger");
    await expect(this.partyLedgerPage).toBeVisible({ timeout: 15_000 });
  }

  async openAddPartyDialog() {
    await this.addPartyButton.click();
    await expect(this.formDialog).toBeVisible();
  }

  async closeFormDialog() {
    await this.formCancelButton.click();
    await expect(this.formDialog).not.toBeVisible();
  }

  async selectPartyType(type: "KISAN" | "AARTI" | "VYAPARI" | "OTHER") {
    await this.formTypeSelect.click();
    // Use exact match to avoid ambiguity (e.g., "Kisan" vs "Kisan D")
    const optionMap: Record<string, string> = {
      KISAN: "Kisan (Farmer)",
      AARTI: "Aarti (Commission Agent)",
      VYAPARI: "Vyapari (Trader)",
      OTHER: "Other",
    };
    await this.page.getByRole("option", { name: optionMap[type], exact: true }).click();
  }

  async fillPartyForm(data: {
    name: string;
    nameHindi?: string;
    phone?: string;
    openingBalance?: string;
  }) {
    await this.formNameInput.fill(data.name);
    if (data.nameHindi) {
      await this.formNameHindiInput.fill(data.nameHindi);
    }
    if (data.phone) {
      await this.formPhoneInput.fill(data.phone);
    }
    if (data.openingBalance) {
      await this.formOpeningBalanceInput.fill(data.openingBalance);
    }
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async createParty(data: {
    name: string;
    nameHindi?: string;
    phone?: string;
    openingBalance?: string;
  }) {
    await this.openAddPartyDialog();
    await this.fillPartyForm(data);
    await this.submitForm();
    // Wait for dialog to close
    await expect(this.formDialog).not.toBeVisible({ timeout: 10_000 });
  }

  async searchParties(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async filterByTab(tab: "all" | "debtors" | "creditors") {
    switch (tab) {
      case "all":
        await this.tabAll.click();
        break;
      case "debtors":
        await this.tabDebtors.click();
        break;
      case "creditors":
        await this.tabCreditors.click();
        break;
    }
  }

  async getTabCount(tab: "all" | "debtors" | "creditors"): Promise<number> {
    let tabElement: Locator;
    switch (tab) {
      case "all":
        tabElement = this.tabAll;
        break;
      case "debtors":
        tabElement = this.tabDebtors;
        break;
      case "creditors":
        tabElement = this.tabCreditors;
        break;
    }
    const text = await tabElement.textContent();
    const match = text?.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  getEditButton(partyId: string): Locator {
    return this.page.getByTestId(`party-edit-button-${partyId}`);
  }

  getDeleteButton(partyId: string): Locator {
    return this.page.getByTestId(`party-delete-button-${partyId}`);
  }

  getViewButton(partyId: string): Locator {
    return this.page.getByTestId(`party-view-button-${partyId}`);
  }

  async editParty(partyId: string) {
    await this.getEditButton(partyId).click();
    await expect(this.formDialog).toBeVisible();
  }

  async deleteParty(partyId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getDeleteButton(partyId).click();
  }

  async getKpiDebtorsValue(): Promise<string> {
    return (await this.kpiTotalDebtorsValue.textContent()) ?? "";
  }

  async getKpiCreditorsValue(): Promise<string> {
    return (await this.kpiTotalCreditorsValue.textContent()) ?? "";
  }
}
