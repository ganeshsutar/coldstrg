import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export type AmadFilterTab = "all" | "in-stock" | "partial" | "dispatched" | "pending";

export class AmadPage extends BasePage {
  // Main page elements
  readonly page: Page;
  readonly amadPage: Locator;
  readonly newAmadButton: Locator;
  readonly searchInput: Locator;

  // Tab filters
  readonly tabAll: Locator;
  readonly tabInStock: Locator;
  readonly tabPartial: Locator;
  readonly tabDispatched: Locator;
  readonly tabPending: Locator;

  // KPI cards
  readonly kpiToday: Locator;
  readonly kpiTotalStock: Locator;
  readonly kpiPartial: Locator;
  readonly kpiPending: Locator;

  // Form dialog elements
  readonly formDialog: Locator;
  readonly formAmadNoInput: Locator;
  readonly formDateInput: Locator;
  readonly formPartySelect: Locator;
  readonly formVillageInput: Locator;
  readonly formPostInput: Locator;
  readonly formDistrictInput: Locator;
  readonly formRoadInput: Locator;

  // Step 2 fields
  readonly formCommoditySelect: Locator;
  readonly formVarietyInput: Locator;
  readonly formChamberSelect: Locator;
  readonly formFloorSelect: Locator;
  readonly formRentRateInput: Locator;
  readonly formGraceDaysInput: Locator;
  readonly formEwayBillInput: Locator;

  // Step 3 fields
  readonly formPkt1CountInput: Locator;
  readonly formPkt1WeightInput: Locator;
  readonly formPkt2CountInput: Locator;
  readonly formPkt2WeightInput: Locator;
  readonly formPkt3CountInput: Locator;
  readonly formPkt3WeightInput: Locator;
  readonly formTotalPackets: Locator;
  readonly formTotalWeight: Locator;

  // Step 4 fields
  readonly formMark1Input: Locator;
  readonly formMark2Input: Locator;
  readonly formPartyMarkInput: Locator;

  // Navigation buttons
  readonly formBackButton: Locator;
  readonly formNextButton: Locator;
  readonly formCancelButton: Locator;
  readonly formSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Main page elements
    this.amadPage = page.getByTestId("amad-page");
    this.newAmadButton = page.getByTestId("new-amad-button");
    this.searchInput = page.getByTestId("amad-search-input");

    // Tab filters
    this.tabAll = page.getByTestId("amad-tab-all");
    this.tabInStock = page.getByTestId("amad-tab-in-stock");
    this.tabPartial = page.getByTestId("amad-tab-partial");
    this.tabDispatched = page.getByTestId("amad-tab-dispatched");
    this.tabPending = page.getByTestId("amad-tab-pending");

    // KPI cards
    this.kpiToday = page.getByTestId("amad-kpi-today");
    this.kpiTotalStock = page.getByTestId("amad-kpi-total-stock");
    this.kpiPartial = page.getByTestId("amad-kpi-partial");
    this.kpiPending = page.getByTestId("amad-kpi-pending");

    // Form dialog
    this.formDialog = page.getByTestId("amad-form-dialog");
    this.formAmadNoInput = page.getByTestId("amad-form-amad-no-input");
    this.formDateInput = page.getByTestId("amad-form-date-input");
    this.formPartySelect = page.getByTestId("amad-form-party-select");
    this.formVillageInput = page.getByTestId("amad-form-village-input");
    this.formPostInput = page.getByTestId("amad-form-post-input");
    this.formDistrictInput = page.getByTestId("amad-form-district-input");
    this.formRoadInput = page.getByTestId("amad-form-road-input");

    // Step 2
    this.formCommoditySelect = page.getByTestId("amad-form-commodity-select");
    this.formVarietyInput = page.getByTestId("amad-form-variety-input");
    this.formChamberSelect = page.getByTestId("amad-form-chamber-select");
    this.formFloorSelect = page.getByTestId("amad-form-floor-select");
    this.formRentRateInput = page.getByTestId("amad-form-rent-rate-input");
    this.formGraceDaysInput = page.getByTestId("amad-form-grace-days-input");
    this.formEwayBillInput = page.getByTestId("amad-form-eway-bill-input");

    // Step 3
    this.formPkt1CountInput = page.getByTestId("amad-form-pkt1-count-input");
    this.formPkt1WeightInput = page.getByTestId("amad-form-pkt1-weight-input");
    this.formPkt2CountInput = page.getByTestId("amad-form-pkt2-count-input");
    this.formPkt2WeightInput = page.getByTestId("amad-form-pkt2-weight-input");
    this.formPkt3CountInput = page.getByTestId("amad-form-pkt3-count-input");
    this.formPkt3WeightInput = page.getByTestId("amad-form-pkt3-weight-input");
    this.formTotalPackets = page.getByTestId("amad-form-total-packets");
    this.formTotalWeight = page.getByTestId("amad-form-total-weight");

    // Step 4
    this.formMark1Input = page.getByTestId("amad-form-mark1-input");
    this.formMark2Input = page.getByTestId("amad-form-mark2-input");
    this.formPartyMarkInput = page.getByTestId("amad-form-party-mark-input");

    // Navigation
    this.formBackButton = page.getByTestId("amad-form-back-button");
    this.formNextButton = page.getByTestId("amad-form-next-button");
    this.formCancelButton = page.getByTestId("amad-form-cancel-button");
    this.formSubmitButton = page.getByTestId("amad-form-submit-button");
  }

  async goto() {
    await super.goto("/inventory/amad");
    await expect(this.amadPage).toBeVisible({ timeout: 15_000 });
  }

  async openNewAmadDialog() {
    await this.newAmadButton.click();
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

  async fillStep1(data: {
    village?: string;
    post?: string;
    district?: string;
    road?: string;
  }) {
    // Party must be selected from dropdown - handled separately
    if (data.village) {
      await this.formVillageInput.fill(data.village);
    }
    if (data.post) {
      await this.formPostInput.fill(data.post);
    }
    if (data.district) {
      await this.formDistrictInput.fill(data.district);
    }
    if (data.road) {
      await this.formRoadInput.fill(data.road);
    }
  }

  async selectParty(partyName: string) {
    await this.formPartySelect.click();
    await this.page.getByRole("option", { name: new RegExp(partyName, "i") }).click();
  }

  async fillStep2(data: {
    variety?: string;
    rentRate?: string;
    graceDays?: string;
    ewayBillNo?: string;
  }) {
    if (data.variety) {
      await this.formVarietyInput.fill(data.variety);
    }
    if (data.rentRate) {
      await this.formRentRateInput.fill(data.rentRate);
    }
    if (data.graceDays) {
      await this.formGraceDaysInput.fill(data.graceDays);
    }
    if (data.ewayBillNo) {
      await this.formEwayBillInput.fill(data.ewayBillNo);
    }
  }

  async selectCommodity(commodityName: string) {
    await this.formCommoditySelect.click();
    await this.page.getByRole("option", { name: new RegExp(commodityName, "i") }).click();
  }

  async selectChamber(chamberName: string) {
    await this.formChamberSelect.click();
    await this.page.getByRole("option", { name: new RegExp(chamberName, "i") }).click();
  }

  async fillStep3(data: {
    pkt1Count?: string;
    pkt1Weight?: string;
    pkt2Count?: string;
    pkt2Weight?: string;
    pkt3Count?: string;
    pkt3Weight?: string;
  }) {
    if (data.pkt1Count) {
      await this.formPkt1CountInput.fill(data.pkt1Count);
    }
    if (data.pkt1Weight) {
      await this.formPkt1WeightInput.fill(data.pkt1Weight);
    }
    if (data.pkt2Count) {
      await this.formPkt2CountInput.fill(data.pkt2Count);
    }
    if (data.pkt2Weight) {
      await this.formPkt2WeightInput.fill(data.pkt2Weight);
    }
    if (data.pkt3Count) {
      await this.formPkt3CountInput.fill(data.pkt3Count);
    }
    if (data.pkt3Weight) {
      await this.formPkt3WeightInput.fill(data.pkt3Weight);
    }
  }

  async fillStep4(data: { mark1?: string; mark2?: string; partyMark?: string }) {
    if (data.mark1) {
      await this.formMark1Input.fill(data.mark1);
    }
    if (data.mark2) {
      await this.formMark2Input.fill(data.mark2);
    }
    if (data.partyMark) {
      await this.formPartyMarkInput.fill(data.partyMark);
    }
  }

  async submitForm() {
    await this.formSubmitButton.click();
  }

  async searchAmad(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async filterByStatus(status: AmadFilterTab) {
    switch (status) {
      case "all":
        await this.tabAll.click();
        break;
      case "in-stock":
        await this.tabInStock.click();
        break;
      case "partial":
        await this.tabPartial.click();
        break;
      case "dispatched":
        await this.tabDispatched.click();
        break;
      case "pending":
        await this.tabPending.click();
        break;
    }
  }

  async getTabCount(tab: AmadFilterTab): Promise<number> {
    let tabElement: Locator;
    switch (tab) {
      case "all":
        tabElement = this.tabAll;
        break;
      case "in-stock":
        tabElement = this.tabInStock;
        break;
      case "partial":
        tabElement = this.tabPartial;
        break;
      case "dispatched":
        tabElement = this.tabDispatched;
        break;
      case "pending":
        tabElement = this.tabPending;
        break;
    }
    const text = await tabElement.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getTotalPackets(): Promise<string> {
    return (await this.formTotalPackets.textContent()) ?? "0";
  }

  async getTotalWeight(): Promise<string> {
    return (await this.formTotalWeight.textContent()) ?? "0";
  }

  getViewButton(amadId: string): Locator {
    return this.page.getByTestId(`amad-view-button-${amadId}`);
  }

  getEditButton(amadId: string): Locator {
    return this.page.getByTestId(`amad-edit-button-${amadId}`);
  }

  getDeleteButton(amadId: string): Locator {
    return this.page.getByTestId(`amad-delete-button-${amadId}`);
  }

  async deleteAmad(amadId: string) {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.getDeleteButton(amadId).click();
  }
}
