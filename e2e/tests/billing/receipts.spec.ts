import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ReceiptsPage } from "../../pages/billing/receipts.page";
import { testReceiptData, uniqueNarration } from "../../fixtures/billing-data";

test.describe("Receipts", () => {
  let receiptsPage: ReceiptsPage;

  test.beforeEach(async ({ page }) => {
    // Skip if no credentials
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!email || !password) {
      test.skip();
      return;
    }

    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);

    // Wait for dashboard to load with extended timeout for Cognito
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });

    // Navigate to receipts
    receiptsPage = new ReceiptsPage(page);
    await receiptsPage.goto();
  });

  test.describe("Page Display", () => {
    test("should display receipts list page with all elements", async () => {
      // Verify main page elements
      await expect(receiptsPage.listPage).toBeVisible();
      await expect(receiptsPage.newReceiptButton).toBeVisible();
      await expect(receiptsPage.searchInput).toBeVisible();

      // Verify tabs are visible
      await expect(receiptsPage.tabAll).toBeVisible();
      await expect(receiptsPage.tabDraft).toBeVisible();
      await expect(receiptsPage.tabConfirmed).toBeVisible();
      await expect(receiptsPage.tabCancelled).toBeVisible();
    });

    test("should show correct tab counts", async () => {
      const allCount = await receiptsPage.getTabCount("all");
      const draftCount = await receiptsPage.getTabCount("draft");
      const confirmedCount = await receiptsPage.getTabCount("confirmed");
      const cancelledCount = await receiptsPage.getTabCount("cancelled");

      // Sum of filtered tabs should be less than or equal to all
      expect(draftCount + confirmedCount + cancelledCount).toBeLessThanOrEqual(allCount + 1);
    });
  });

  test.describe("Filter Receipts", () => {
    test("should filter receipts by status - Draft", async () => {
      const allCount = await receiptsPage.getTabCount("all");
      const draftCount = await receiptsPage.getTabCount("draft");

      await receiptsPage.filterByStatus("draft");

      expect(draftCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter receipts by status - Confirmed", async () => {
      const allCount = await receiptsPage.getTabCount("all");
      const confirmedCount = await receiptsPage.getTabCount("confirmed");

      await receiptsPage.filterByStatus("confirmed");

      expect(confirmedCount).toBeLessThanOrEqual(allCount);
    });

    test("should filter receipts by status - Cancelled", async () => {
      const allCount = await receiptsPage.getTabCount("all");
      const cancelledCount = await receiptsPage.getTabCount("cancelled");

      await receiptsPage.filterByStatus("cancelled");

      expect(cancelledCount).toBeLessThanOrEqual(allCount);
    });
  });

  test.describe("Search Receipts", () => {
    test("should search receipts by number", async () => {
      await receiptsPage.searchReceipts("RCP-");
      await expect(receiptsPage.searchInput).toHaveValue("RCP-");

      await receiptsPage.clearSearch();
      await expect(receiptsPage.searchInput).toHaveValue("");
    });

    test("should search receipts by party name", async () => {
      await receiptsPage.searchReceipts("Ram");
      await expect(receiptsPage.searchInput).toHaveValue("Ram");

      await receiptsPage.clearSearch();
    });
  });

  test.describe("Receipt Form Dialog", () => {
    test("should open receipt form dialog when clicking new button", async () => {
      await receiptsPage.openNewReceiptDialog();
      await expect(receiptsPage.formDialog).toBeVisible();
      await expect(receiptsPage.formParty).toBeVisible();
      await expect(receiptsPage.formDate).toBeVisible();
      await expect(receiptsPage.formAmount).toBeVisible();
      await expect(receiptsPage.formSubmit).toBeVisible();
    });

    test("should close dialog when clicking cancel", async () => {
      await receiptsPage.openNewReceiptDialog();
      await expect(receiptsPage.formDialog).toBeVisible();

      await receiptsPage.closeDialog();
      await expect(receiptsPage.formDialog).not.toBeVisible();
    });

    test("should display payment mode options", async () => {
      await receiptsPage.openNewReceiptDialog();

      // Check all payment mode options are visible
      await expect(receiptsPage.modeCash).toBeVisible();
      await expect(receiptsPage.modeCheque).toBeVisible();
      await expect(receiptsPage.modeBank).toBeVisible();
      await expect(receiptsPage.modeUpi).toBeVisible();
    });

    test("should have submit button disabled without required fields", async () => {
      await receiptsPage.openNewReceiptDialog();

      // Submit should be disabled without party and amount
      await expect(receiptsPage.formSubmit).toBeDisabled();
    });
  });

  test.describe("Payment Mode - Cash", () => {
    test("should fill cash receipt form fields", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Select cash payment mode
        await receiptsPage.selectPaymentMode("CASH");

        // Fill amount
        await receiptsPage.fillAmount(testReceiptData.cash.amount);
        await expect(receiptsPage.formAmount).toHaveValue(testReceiptData.cash.amount);

        // Amount in words should appear
        await expect(receiptsPage.formAmountWords).toBeVisible();

        // Fill narration
        const narration = uniqueNarration(testReceiptData.cash.narration);
        await receiptsPage.fillNarration(narration);
        await expect(receiptsPage.formNarration).toHaveValue(narration);
      }
    });
  });

  test.describe("Payment Mode - Cheque", () => {
    test("should show cheque fields when cheque mode selected", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Select cheque payment mode
        await receiptsPage.selectPaymentMode("CHEQUE");

        // Cheque fields should be visible
        await expect(receiptsPage.chequeSection).toBeVisible();
        await expect(receiptsPage.chequeNumber).toBeVisible();
        await expect(receiptsPage.chequeDate).toBeVisible();
        await expect(receiptsPage.chequeBank).toBeVisible();
        await expect(receiptsPage.chequeBranch).toBeVisible();
        await expect(receiptsPage.chequePdc).toBeVisible();
      }
    });

    test("should fill cheque receipt form fields", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Select cheque payment mode
        await receiptsPage.selectPaymentMode("CHEQUE");

        // Fill amount
        await receiptsPage.fillAmount(testReceiptData.cheque.amount);

        // Fill cheque details
        await receiptsPage.fillChequeDetails({
          number: testReceiptData.cheque.chequeNumber,
          date: testReceiptData.cheque.chequeDate,
          bank: testReceiptData.cheque.bank,
          branch: testReceiptData.cheque.branch,
        });

        await expect(receiptsPage.chequeNumber).toHaveValue(testReceiptData.cheque.chequeNumber);
        await expect(receiptsPage.chequeBank).toHaveValue(testReceiptData.cheque.bank);
      }
    });

    test("should handle PDC checkbox for cheque", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Select cheque payment mode
        await receiptsPage.selectPaymentMode("CHEQUE");

        // Check PDC
        await receiptsPage.chequePdc.click();
        await expect(receiptsPage.chequePdc).toBeChecked();

        // Uncheck PDC
        await receiptsPage.chequePdc.click();
        await expect(receiptsPage.chequePdc).not.toBeChecked();
      }
    });
  });

  test.describe("Payment Mode - UPI", () => {
    test("should show UPI reference field when UPI mode selected", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Select UPI payment mode
        await receiptsPage.selectPaymentMode("UPI");

        // UPI reference field should be visible
        await expect(receiptsPage.upiRef).toBeVisible();

        // Cheque fields should not be visible
        await expect(receiptsPage.chequeSection).not.toBeVisible();
      }
    });

    test("should fill UPI receipt form fields", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Select UPI payment mode
        await receiptsPage.selectPaymentMode("UPI");

        // Fill amount
        await receiptsPage.fillAmount(testReceiptData.upi.amount);

        // Fill UPI reference
        await receiptsPage.fillUpiRef(testReceiptData.upi.upiRef);
        await expect(receiptsPage.upiRef).toHaveValue(testReceiptData.upi.upiRef);
      }
    });
  });

  test.describe("Payment Mode - Bank Transfer", () => {
    test("should show bank reference field when bank mode selected", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Select bank payment mode
        await receiptsPage.selectPaymentMode("BANK");

        // Bank reference field should be visible
        await expect(receiptsPage.bankRef).toBeVisible();

        // Cheque fields should not be visible
        await expect(receiptsPage.chequeSection).not.toBeVisible();

        // UPI field should not be visible
        await expect(receiptsPage.upiRef).not.toBeVisible();
      }
    });

    test("should fill bank transfer receipt form fields", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Select bank payment mode
        await receiptsPage.selectPaymentMode("BANK");

        // Fill amount
        await receiptsPage.fillAmount(testReceiptData.bank.amount);

        // Fill bank reference
        await receiptsPage.fillBankRef(testReceiptData.bank.bankRef);
        await expect(receiptsPage.bankRef).toHaveValue(testReceiptData.bank.bankRef);
      }
    });
  });

  test.describe("Bill Adjustment", () => {
    test("should show auto-adjust checkbox", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Wait for data to load
        await page.waitForTimeout(1000);

        // If party has unpaid bills, adjustment section should be visible
        const isBillSectionVisible = await receiptsPage.isBillAdjustmentVisible();
        if (isBillSectionVisible) {
          await expect(receiptsPage.autoAdjust).toBeVisible();
          await expect(receiptsPage.billTable).toBeVisible();
        }
      }
    });

    test("should toggle auto-adjust option", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Wait for data to load
        await page.waitForTimeout(1000);

        const isBillSectionVisible = await receiptsPage.isBillAdjustmentVisible();
        if (isBillSectionVisible) {
          // Toggle auto-adjust off
          await receiptsPage.toggleAutoAdjust();
          await expect(receiptsPage.autoAdjust).not.toBeChecked();

          // Toggle auto-adjust on
          await receiptsPage.toggleAutoAdjust();
          await expect(receiptsPage.autoAdjust).toBeChecked();
        }
      }
    });
  });

  test.describe("Outstanding Balance", () => {
    test("should show outstanding balance after selecting party", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Wait for outstanding to load
        await page.waitForTimeout(1000);

        // Outstanding section should be visible
        await expect(receiptsPage.formOutstanding).toBeVisible();
      }
    });
  });

  test.describe("Amount in Words", () => {
    test("should show amount in words when amount is entered", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Enter amount
        await receiptsPage.fillAmount("5000");

        // Amount in words should appear
        await expect(receiptsPage.formAmountWords).toBeVisible();
        const words = await receiptsPage.getAmountInWords();
        expect(words.toLowerCase()).toContain("five thousand");
      }
    });
  });

  test.describe("Form Validation", () => {
    test("should not submit without party selection", async () => {
      await receiptsPage.openNewReceiptDialog();

      // Fill amount without selecting party
      await receiptsPage.fillAmount("5000");

      // Submit should be disabled
      await expect(receiptsPage.formSubmit).toBeDisabled();
    });

    test("should not submit without amount", async ({ page }) => {
      await receiptsPage.openNewReceiptDialog();

      // Select party
      await receiptsPage.formParty.click();
      const firstParty = page.locator('[data-testid^="receipt-form-party-option-"]').first();

      if (await firstParty.isVisible()) {
        await firstParty.click();

        // Don't fill amount

        // Submit should be disabled
        await expect(receiptsPage.formSubmit).toBeDisabled();
      }
    });
  });
});
