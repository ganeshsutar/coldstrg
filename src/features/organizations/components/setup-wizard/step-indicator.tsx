import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WizardStep } from "./wizard-types";

interface StepIndicatorProps {
  currentStep: WizardStep;
}

const steps = [
  { step: 1, label: "Organization Details" },
  { step: 2, label: "Business Registration" },
  { step: 3, label: "System Settings" },
  { step: 4, label: "Setup Data" },
] as const;

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full" data-testid="wizard-step-indicator">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.step} className="flex items-center">
            {/* Step circle and label */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  currentStep > step.step
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === step.step
                      ? "border-primary bg-background text-primary"
                      : "border-muted-foreground/30 bg-background text-muted-foreground"
                )}
              >
                {currentStep > step.step ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.step}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  currentStep >= step.step
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-0.5 flex-1 min-w-[60px] transition-colors",
                  currentStep > step.step ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
