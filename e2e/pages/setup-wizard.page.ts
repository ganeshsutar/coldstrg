import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class SetupWizardPage extends BasePage {
  // Step Indicator
  readonly stepIndicator: Locator;

  // Navigation buttons
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly skipButton: Locator;
  readonly startSetupButton: Locator;
  readonly completeButton: Locator;

  // Step 1 - Organization Details
  readonly orgNameInput: Locator;
  readonly orgNameHindiInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateSelect: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;

  // Step 2 - Business Registration
  readonly gstNoInput: Locator;
  readonly panNoInput: Locator;
  readonly fyStartSelect: Locator;
  readonly bankNameInput: Locator;
  readonly bankAccountInput: Locator;
  readonly bankIfscInput: Locator;
  readonly bankBranchInput: Locator;

  // Step 3 - System Settings
  readonly modeStandard: Locator;
  readonly modeAdvanced: Locator;
  readonly rentLedger: Locator;
  readonly rentBill: Locator;
  readonly multiChamberCheckbox: Locator;
  readonly partialLotCheckbox: Locator;
  readonly mapRequiredCheckbox: Locator;
  readonly pkt1Name: Locator;
  readonly pkt1Weight: Locator;
  readonly pkt2Name: Locator;
  readonly pkt2Weight: Locator;
  readonly pkt3Name: Locator;
  readonly pkt3Weight: Locator;

  // Step 4 - Data Population
  readonly overallProgress: Locator;

  constructor(page: Page) {
    super(page);

    // Step Indicator
    this.stepIndicator = page.getByTestId("wizard-step-indicator");

    // Navigation buttons
    this.nextButton = page.getByTestId("wizard-next-button");
    this.backButton = page.getByTestId("wizard-back-button");
    this.skipButton = page.getByTestId("wizard-skip-button");
    this.startSetupButton = page.getByTestId("wizard-start-setup-button");
    this.completeButton = page.getByTestId("wizard-complete-button");

    // Step 1
    this.orgNameInput = page.getByTestId("wizard-org-name");
    this.orgNameHindiInput = page.getByTestId("wizard-org-name-hindi");
    this.addressInput = page.getByTestId("wizard-org-address");
    this.cityInput = page.getByTestId("wizard-org-city");
    this.stateSelect = page.getByTestId("wizard-org-state");
    this.phoneInput = page.getByTestId("wizard-org-phone");
    this.emailInput = page.getByTestId("wizard-org-email");

    // Step 2
    this.gstNoInput = page.getByTestId("wizard-gst-no");
    this.panNoInput = page.getByTestId("wizard-pan-no");
    this.fyStartSelect = page.getByTestId("wizard-fy-start");
    this.bankNameInput = page.getByTestId("wizard-bank-name");
    this.bankAccountInput = page.getByTestId("wizard-bank-account");
    this.bankIfscInput = page.getByTestId("wizard-bank-ifsc");
    this.bankBranchInput = page.getByTestId("wizard-bank-branch");

    // Step 3
    this.modeStandard = page.getByTestId("wizard-mode-standard");
    this.modeAdvanced = page.getByTestId("wizard-mode-advanced");
    this.rentLedger = page.getByTestId("wizard-rent-ledger");
    this.rentBill = page.getByTestId("wizard-rent-bill");
    this.multiChamberCheckbox = page.getByTestId("wizard-multi-chamber");
    this.partialLotCheckbox = page.getByTestId("wizard-partial-lot");
    this.mapRequiredCheckbox = page.getByTestId("wizard-map-required");
    this.pkt1Name = page.getByTestId("wizard-pkt1-name");
    this.pkt1Weight = page.getByTestId("wizard-pkt1-weight");
    this.pkt2Name = page.getByTestId("wizard-pkt2-name");
    this.pkt2Weight = page.getByTestId("wizard-pkt2-weight");
    this.pkt3Name = page.getByTestId("wizard-pkt3-name");
    this.pkt3Weight = page.getByTestId("wizard-pkt3-weight");

    // Step 4
    this.overallProgress = page.getByTestId("seeding-overall-progress");
  }

  async goto() {
    await super.goto("/setup-wizard");
  }

  async waitForWizard() {
    await this.stepIndicator.waitFor({ state: "visible" });
  }

  // Step 1 helpers
  async fillOrganizationDetails(data: {
    name: string;
    nameHindi?: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    email: string;
  }) {
    await this.orgNameInput.fill(data.name);
    if (data.nameHindi) {
      await this.orgNameHindiInput.fill(data.nameHindi);
    }
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateSelect.click();
    await this.page.getByRole("option", { name: data.state }).click();
    await this.phoneInput.fill(data.phone);
    await this.emailInput.fill(data.email);
  }

  // Step 2 helpers
  async fillBusinessRegistration(data: {
    gstNo?: string;
    panNo?: string;
    bankName?: string;
    bankAccount?: string;
    bankIfsc?: string;
    bankBranch?: string;
  }) {
    if (data.gstNo) {
      await this.gstNoInput.fill(data.gstNo);
    }
    if (data.panNo) {
      await this.panNoInput.fill(data.panNo);
    }
    if (data.bankName) {
      await this.bankNameInput.fill(data.bankName);
    }
    if (data.bankAccount) {
      await this.bankAccountInput.fill(data.bankAccount);
    }
    if (data.bankIfsc) {
      await this.bankIfscInput.fill(data.bankIfsc);
    }
    if (data.bankBranch) {
      await this.bankBranchInput.fill(data.bankBranch);
    }
  }

  // Step 3 helpers
  async configureSystemSettings(data: {
    softwareMode?: "standard" | "advanced";
    rentProcessing?: "ledger" | "bill";
    multiChamber?: boolean;
    partialLot?: boolean;
    mapRequired?: boolean;
  }) {
    if (data.softwareMode === "advanced") {
      await this.modeAdvanced.click();
    } else if (data.softwareMode === "standard") {
      await this.modeStandard.click();
    }

    if (data.rentProcessing === "bill") {
      await this.rentBill.click();
    } else if (data.rentProcessing === "ledger") {
      await this.rentLedger.click();
    }

    if (data.multiChamber) {
      await this.multiChamberCheckbox.click();
    }
    if (data.partialLot) {
      await this.partialLotCheckbox.click();
    }
    if (data.mapRequired) {
      await this.mapRequiredCheckbox.click();
    }
  }

  // Navigation helpers
  async goToNextStep() {
    await this.nextButton.click();
  }

  async goToPreviousStep() {
    await this.backButton.click();
  }

  async skipCurrentStep() {
    await this.skipButton.click();
  }

  async startSetup() {
    await this.startSetupButton.click();
  }

  async completeWizard() {
    await this.completeButton.click();
  }

  // Progress card helpers
  getSeedingProgressCard(tableName: string) {
    return this.page.getByTestId(`seeding-progress-${tableName}`);
  }

  async waitForSeedingComplete() {
    // Wait for the complete button to appear (indicates seeding is done)
    await this.completeButton.waitFor({ state: "visible", timeout: 120_000 });
  }

  // Step verification helpers
  async isOnStep(step: number) {
    const stepTestId = `wizard-step-${step}`;
    return this.page.getByTestId(stepTestId).isVisible();
  }
}
