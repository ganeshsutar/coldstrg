import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, SkipForward, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOrganization } from "../../hooks/use-organization";
import { updateOrganization, markOrganizationConfigured } from "../../api/organizations";
import { createSystemConfigWithProgress } from "@/features/settings/api/system-config";
import { seedDefaultPermissionsWithProgress } from "@/features/settings/api/permissions";
import { seedAccountsWithProgress } from "@/features/accounting/api/accounts";
import { seedBanksWithProgress } from "@/features/masters/api/banks";
import { seedCommoditiesWithProgress } from "@/features/masters/api/commodities";
import { seedGstRatesWithProgress } from "@/features/masters/api/gst-rates";
import { seedLaborRatesWithProgress } from "@/features/masters/api/labor-rates";
import { StepIndicator } from "./step-indicator";
import { OrganizationDetailsStep } from "./organization-details-step";
import { BusinessRegistrationStep } from "./business-registration-step";
import { SystemConfigStep } from "./system-config-step";
import { DataPopulationStep } from "./data-population-step";
import {
  type WizardStep,
  type WizardFormData,
  type SeedingProgress,
  INITIAL_WIZARD_FORM_DATA,
  INITIAL_SEEDING_PROGRESS,
} from "./wizard-types";

export function SetupWizard() {
  const navigate = useNavigate();
  const { currentOrganization, setCurrentOrganization, refreshMemberships } = useOrganization();

  // Check if we're in reconfigure mode
  const searchParams = useSearch({ strict: false }) as Record<string, string | undefined>;
  const isReconfigureMode = searchParams?.mode === "reconfigure";

  const [step, setStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<WizardFormData>(() => {
    // In reconfigure mode, pre-populate all fields from existing organization
    if (isReconfigureMode && currentOrganization) {
      return {
        ...INITIAL_WIZARD_FORM_DATA,
        name: currentOrganization.name || "",
        nameHindi: currentOrganization.nameHindi || "",
        address: currentOrganization.address || "",
        city: currentOrganization.city || "",
        state: currentOrganization.state || "",
        phone: currentOrganization.phone || "",
        email: currentOrganization.email || "",
        gstNo: currentOrganization.gstNo || "",
        panNo: currentOrganization.panNo || "",
        financialYearStart: currentOrganization.financialYearStart || 4,
        bankName: currentOrganization.bankName || "",
        bankAccountNo: currentOrganization.bankAccountNo || "",
        bankIfsc: currentOrganization.bankIfsc || "",
        bankBranch: currentOrganization.bankBranch || "",
      };
    }
    return {
      ...INITIAL_WIZARD_FORM_DATA,
      name: currentOrganization?.name || "",
      email: currentOrganization?.email || "",
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingComplete, setSeedingComplete] = useState(false);
  const [seedingProgress, setSeedingProgress] = useState<SeedingProgress>(INITIAL_SEEDING_PROGRESS);
  const [isSaving, setIsSaving] = useState(false);

  // Header text based on mode
  const headerText = useMemo(() => {
    if (isReconfigureMode) {
      return {
        title: "Reconfigure Organization",
        subtitle: "Update your organization settings and re-seed data",
      };
    }
    return {
      title: "Welcome to Cold Storage",
      subtitle: "Let's get your organization set up",
    };
  }, [isReconfigureMode]);

  // Warn user before leaving during seeding
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSeeding && !seedingComplete) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSeeding, seedingComplete]);

  const updateFormData = useCallback((updates: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedKeys = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedKeys.forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  }, []);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Organization name must be at least 3 characters";
    }
    if (!formData.address || formData.address.length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }
    if (!formData.city || formData.city.length < 2) {
      newErrors.city = "City is required";
    }
    if (!formData.state) {
      newErrors.state = "State is required";
    }
    if (!formData.phone || !/^[+]?[\d\s-]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Valid phone number is required";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    // GST validation (optional but must be valid if provided)
    if (formData.gstNo && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNo)) {
      newErrors.gstNo = "Invalid GST number format";
    }
    // PAN validation (optional but must be valid if provided)
    if (formData.panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo)) {
      newErrors.panNo = "Invalid PAN number format";
    }
    // IFSC validation (optional but must be valid if provided)
    if (formData.bankIfsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankIfsc)) {
      newErrors.bankIfsc = "Invalid IFSC code format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveOrganizationData = async (): Promise<void> => {
    if (!currentOrganization) return;

    setIsSaving(true);
    try {
      const updatedOrg = await updateOrganization({
        id: currentOrganization.id,
        name: formData.name,
        nameHindi: formData.nameHindi || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        phone: formData.phone || null,
        email: formData.email || null,
        gstNo: formData.gstNo || null,
        panNo: formData.panNo || null,
        financialYearStart: formData.financialYearStart || null,
        bankName: formData.bankName || null,
        bankAccountNo: formData.bankAccountNo || null,
        bankIfsc: formData.bankIfsc || null,
        bankBranch: formData.bankBranch || null,
      });
      setCurrentOrganization(updatedOrg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!validateStep1()) return;
      await saveOrganizationData();
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2()) return;
      await saveOrganizationData();
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleSkip = async () => {
    if (step === 1) {
      // Save whatever data is there
      await saveOrganizationData();
      setStep(2);
    } else if (step === 2) {
      await saveOrganizationData();
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const updateProgress = (
    table: keyof SeedingProgress,
    updates: Partial<SeedingProgress[keyof SeedingProgress]>
  ) => {
    setSeedingProgress((prev) => ({
      ...prev,
      [table]: { ...prev[table], ...updates },
    }));
  };

  const runSeeding = async () => {
    if (!currentOrganization) return;

    setIsSeeding(true);
    const orgId = currentOrganization.id;

    try {
      // 1. System Config
      updateProgress("systemConfig", { status: "seeding" });
      const { skipped: sysConfigSkipped } = await createSystemConfigWithProgress(orgId, (completed, item, skipped) => {
        updateProgress("systemConfig", { completed, currentItem: item, skipped: skipped || 0 });
      });
      updateProgress("systemConfig", { status: "done", completed: 1, skipped: sysConfigSkipped });

      // 2. Role Permissions
      updateProgress("rolePermissions", { status: "seeding" });
      const { skipped: permSkipped } = await seedDefaultPermissionsWithProgress(orgId, (completed, item, skipped) => {
        updateProgress("rolePermissions", { completed, currentItem: item, skipped: skipped || 0 });
      });
      updateProgress("rolePermissions", { status: "done", completed: 3, skipped: permSkipped });

      // 3. GST Rates
      updateProgress("gstRates", { status: "seeding" });
      const { skipped: gstSkipped } = await seedGstRatesWithProgress(orgId, (completed, item, skipped) => {
        updateProgress("gstRates", { completed, currentItem: item, skipped: skipped || 0 });
      });
      updateProgress("gstRates", { status: "done", completed: 5, skipped: gstSkipped });

      // 4. Labor Rates
      updateProgress("laborRates", { status: "seeding" });
      const { skipped: laborSkipped } = await seedLaborRatesWithProgress(orgId, (completed, item, skipped) => {
        updateProgress("laborRates", { completed, currentItem: item, skipped: skipped || 0 });
      });
      updateProgress("laborRates", { status: "done", completed: 6, skipped: laborSkipped });

      // 5. Chart of Accounts
      updateProgress("accounts", { status: "seeding" });
      const { skipped: accountsSkipped } = await seedAccountsWithProgress(orgId, (completed, item, skipped) => {
        updateProgress("accounts", { completed, currentItem: item, skipped: skipped || 0 });
      });
      updateProgress("accounts", { status: "done", completed: 56, skipped: accountsSkipped });

      // 6. Banks
      updateProgress("banks", { status: "seeding" });
      const { skipped: banksSkipped } = await seedBanksWithProgress(orgId, (completed, item, skipped) => {
        updateProgress("banks", { completed, currentItem: item, skipped: skipped || 0 });
      });
      updateProgress("banks", { status: "done", completed: 39, skipped: banksSkipped });

      // 7. Commodities
      updateProgress("commodities", { status: "seeding" });
      const { skipped: commoditiesSkipped } = await seedCommoditiesWithProgress(orgId, (completed, item, skipped) => {
        updateProgress("commodities", { completed, currentItem: item, skipped: skipped || 0 });
      });
      updateProgress("commodities", { status: "done", completed: 1, skipped: commoditiesSkipped });

      // Mark organization as configured (even if already configured in reconfigure mode)
      const updatedOrg = await markOrganizationConfigured(orgId);
      setCurrentOrganization(updatedOrg);

      // Refresh memberships to get updated org data
      await refreshMemberships();

      setSeedingComplete(true);
    } catch (error) {
      console.error("Seeding error:", error);
      // Find which table failed and mark it
      const tables: (keyof SeedingProgress)[] = [
        "systemConfig", "rolePermissions", "gstRates", "laborRates",
        "accounts", "banks", "commodities"
      ];
      for (const table of tables) {
        if (seedingProgress[table].status === "seeding") {
          updateProgress(table, {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          });
          break;
        }
      }
    } finally {
      setIsSeeding(false);
    }
  };

  const handleStartSetup = () => {
    runSeeding();
  };

  const handleComplete = () => {
    navigate({ to: "/dashboard" });
  };

  const handleRetry = async (table: keyof SeedingProgress) => {
    if (!currentOrganization) return;

    const orgId = currentOrganization.id;
    updateProgress(table, { status: "seeding", error: undefined });

    try {
      switch (table) {
        case "systemConfig": {
          const { skipped } = await createSystemConfigWithProgress(orgId, (completed, item, sk) => {
            updateProgress("systemConfig", { completed, currentItem: item, skipped: sk || 0 });
          });
          updateProgress("systemConfig", { status: "done", completed: 1, skipped });
          break;
        }
        case "rolePermissions": {
          const { skipped } = await seedDefaultPermissionsWithProgress(orgId, (completed, item, sk) => {
            updateProgress("rolePermissions", { completed, currentItem: item, skipped: sk || 0 });
          });
          updateProgress("rolePermissions", { status: "done", completed: 3, skipped });
          break;
        }
        case "gstRates": {
          const { skipped } = await seedGstRatesWithProgress(orgId, (completed, item, sk) => {
            updateProgress("gstRates", { completed, currentItem: item, skipped: sk || 0 });
          });
          updateProgress("gstRates", { status: "done", completed: 5, skipped });
          break;
        }
        case "laborRates": {
          const { skipped } = await seedLaborRatesWithProgress(orgId, (completed, item, sk) => {
            updateProgress("laborRates", { completed, currentItem: item, skipped: sk || 0 });
          });
          updateProgress("laborRates", { status: "done", completed: 6, skipped });
          break;
        }
        case "accounts": {
          const { skipped } = await seedAccountsWithProgress(orgId, (completed, item, sk) => {
            updateProgress("accounts", { completed, currentItem: item, skipped: sk || 0 });
          });
          updateProgress("accounts", { status: "done", completed: 56, skipped });
          break;
        }
        case "banks": {
          const { skipped } = await seedBanksWithProgress(orgId, (completed, item, sk) => {
            updateProgress("banks", { completed, currentItem: item, skipped: sk || 0 });
          });
          updateProgress("banks", { status: "done", completed: 39, skipped });
          break;
        }
        case "commodities": {
          const { skipped } = await seedCommoditiesWithProgress(orgId, (completed, item, sk) => {
            updateProgress("commodities", { completed, currentItem: item, skipped: sk || 0 });
          });
          updateProgress("commodities", { status: "done", completed: 1, skipped });
          break;
        }
      }

      // Check if all tables are done
      const allDone = Object.values(seedingProgress).every(
        (p) => p.status === "done"
      );
      if (allDone) {
        const updatedOrg = await markOrganizationConfigured(orgId);
        setCurrentOrganization(updatedOrg);
        await refreshMemberships();
        setSeedingComplete(true);
      }
    } catch (error) {
      updateProgress(table, {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <OrganizationDetailsStep
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <BusinessRegistrationStep
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return <SystemConfigStep data={formData} onChange={updateFormData} />;
      case 4:
        return (
          <DataPopulationStep
            isSeeding={isSeeding}
            seedingComplete={seedingComplete}
            seedingProgress={seedingProgress}
            onRetry={handleRetry}
            isReconfigureMode={isReconfigureMode}
          />
        );
    }
  };

  const renderFooter = () => {
    if (step === 4 && seedingComplete) {
      return (
        <Button onClick={handleComplete} data-testid="wizard-complete-button">
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      );
    }

    if (step === 4 && isSeeding) {
      return null;
    }

    if (step === 4) {
      return (
        <>
          <Button variant="outline" onClick={handleBack} data-testid="wizard-back-button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleStartSetup} data-testid="wizard-start-setup-button">
            {isReconfigureMode ? "Re-run Setup" : "Start Setup"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </>
      );
    }

    return (
      <>
        {step > 1 && (
          <Button variant="outline" onClick={handleBack} data-testid="wizard-back-button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isSaving}
            data-testid="wizard-skip-button"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip
          </Button>
          <Button
            onClick={handleNext}
            disabled={isSaving}
            data-testid="wizard-next-button"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{headerText.title}</h1>
          <p className="text-muted-foreground mt-2">
            {headerText.subtitle}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={step} />
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">{renderStepContent()}</CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between items-center">{renderFooter()}</div>
      </div>
    </div>
  );
}
