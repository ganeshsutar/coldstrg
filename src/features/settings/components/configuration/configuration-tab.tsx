import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SOFTWARE_MODES, RENT_PROCESSING_MODES, DEFAULT_SYSTEM_CONFIG } from "@/config/constants";
import { useSystemConfig, useUpdateSystemConfig } from "../../hooks/use-system-config";

interface ConfigurationTabProps {
  organizationId: string;
}

interface ConfigFormData {
  softwareMode: string;
  multiChamber: boolean;
  partialLot: boolean;
  mapRequired: boolean;
  separateVoucherNo: boolean;
  rentCalculationBasis: string;
  rentProcessingMode: string;
  additionalRentDays: number;
  interestRate: number;
  interestDaysInYear: number;
  autoCalculateInterest: boolean;
  applyInterestOnRent: boolean;
  applyInterestOnLabor: boolean;
  applyInterestOnBardana: boolean;
  pkt1Name: string;
  pkt1Weight: number;
  pkt2Name: string;
  pkt2Weight: number;
  pkt3Name: string;
  pkt3Weight: number;
  mixPackets: boolean;
  gradingRatePKT1: number;
  gradingRatePKT2: number;
  gradingRatePKT3: number;
  loadingRatePKT1: number;
  loadingRatePKT2: number;
  loadingRatePKT3: number;
  unloadingRatePKT1: number;
  unloadingRatePKT2: number;
  unloadingRatePKT3: number;
  showBalance: boolean;
  showShadowBalance: boolean;
  searchOnName: boolean;
  searchOnCode: boolean;
  searchOnMobile: boolean;
}

export function ConfigurationTab({ organizationId }: ConfigurationTabProps) {
  const { data: config, isLoading } = useSystemConfig(organizationId);

  if (isLoading || !config) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">
          {isLoading ? "Loading configuration..." : "Setting up configuration..."}
        </div>
      </div>
    );
  }

  // Key-based reset: when config.updatedAt changes, ConfigurationForm remounts with fresh state
  return <ConfigurationForm key={config.updatedAt} config={config} organizationId={organizationId} />;
}

function configFromData(config: import("../../types").SystemConfig): ConfigFormData {
  return {
    softwareMode: config.softwareMode || DEFAULT_SYSTEM_CONFIG.softwareMode,
    multiChamber: config.multiChamber ?? DEFAULT_SYSTEM_CONFIG.multiChamber,
    partialLot: config.partialLot ?? DEFAULT_SYSTEM_CONFIG.partialLot,
    mapRequired: config.mapRequired ?? DEFAULT_SYSTEM_CONFIG.mapRequired,
    separateVoucherNo: config.separateVoucherNo ?? DEFAULT_SYSTEM_CONFIG.separateVoucherNo,
    rentCalculationBasis: config.rentCalculationBasis || DEFAULT_SYSTEM_CONFIG.rentCalculationBasis,
    rentProcessingMode: config.rentProcessingMode || DEFAULT_SYSTEM_CONFIG.rentProcessingMode,
    additionalRentDays: config.additionalRentDays ?? DEFAULT_SYSTEM_CONFIG.additionalRentDays,
    interestRate: config.interestRate ?? DEFAULT_SYSTEM_CONFIG.interestRate,
    interestDaysInYear: config.interestDaysInYear ?? DEFAULT_SYSTEM_CONFIG.interestDaysInYear,
    autoCalculateInterest: config.autoCalculateInterest ?? DEFAULT_SYSTEM_CONFIG.autoCalculateInterest,
    applyInterestOnRent: config.applyInterestOnRent ?? DEFAULT_SYSTEM_CONFIG.applyInterestOnRent,
    applyInterestOnLabor: config.applyInterestOnLabor ?? DEFAULT_SYSTEM_CONFIG.applyInterestOnLabor,
    applyInterestOnBardana: config.applyInterestOnBardana ?? DEFAULT_SYSTEM_CONFIG.applyInterestOnBardana,
    pkt1Name: config.pkt1Name || DEFAULT_SYSTEM_CONFIG.pkt1Name,
    pkt1Weight: config.pkt1Weight ?? DEFAULT_SYSTEM_CONFIG.pkt1Weight,
    pkt2Name: config.pkt2Name || DEFAULT_SYSTEM_CONFIG.pkt2Name,
    pkt2Weight: config.pkt2Weight ?? DEFAULT_SYSTEM_CONFIG.pkt2Weight,
    pkt3Name: config.pkt3Name || DEFAULT_SYSTEM_CONFIG.pkt3Name,
    pkt3Weight: config.pkt3Weight ?? DEFAULT_SYSTEM_CONFIG.pkt3Weight,
    mixPackets: config.mixPackets ?? DEFAULT_SYSTEM_CONFIG.mixPackets,
    gradingRatePKT1: config.gradingRatePKT1 ?? DEFAULT_SYSTEM_CONFIG.gradingRatePKT1,
    gradingRatePKT2: config.gradingRatePKT2 ?? DEFAULT_SYSTEM_CONFIG.gradingRatePKT2,
    gradingRatePKT3: config.gradingRatePKT3 ?? DEFAULT_SYSTEM_CONFIG.gradingRatePKT3,
    loadingRatePKT1: config.loadingRatePKT1 ?? DEFAULT_SYSTEM_CONFIG.loadingRatePKT1,
    loadingRatePKT2: config.loadingRatePKT2 ?? DEFAULT_SYSTEM_CONFIG.loadingRatePKT2,
    loadingRatePKT3: config.loadingRatePKT3 ?? DEFAULT_SYSTEM_CONFIG.loadingRatePKT3,
    unloadingRatePKT1: config.unloadingRatePKT1 ?? DEFAULT_SYSTEM_CONFIG.unloadingRatePKT1,
    unloadingRatePKT2: config.unloadingRatePKT2 ?? DEFAULT_SYSTEM_CONFIG.unloadingRatePKT2,
    unloadingRatePKT3: config.unloadingRatePKT3 ?? DEFAULT_SYSTEM_CONFIG.unloadingRatePKT3,
    showBalance: config.showBalance ?? DEFAULT_SYSTEM_CONFIG.showBalance,
    showShadowBalance: config.showShadowBalance ?? DEFAULT_SYSTEM_CONFIG.showShadowBalance,
    searchOnName: config.searchOnName ?? DEFAULT_SYSTEM_CONFIG.searchOnName,
    searchOnCode: config.searchOnCode ?? DEFAULT_SYSTEM_CONFIG.searchOnCode,
    searchOnMobile: config.searchOnMobile ?? DEFAULT_SYSTEM_CONFIG.searchOnMobile,
  };
}

interface ConfigurationFormProps {
  config: import("../../types").SystemConfig;
  organizationId: string;
}

function ConfigurationForm({ config, organizationId }: ConfigurationFormProps) {
  const updateMutation = useUpdateSystemConfig();

  const [formData, setFormData] = useState<ConfigFormData>(() => configFromData(config));
  const [isDirty, setIsDirty] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange<K extends keyof ConfigFormData>(key: K, value: ConfigFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setSuccess(false);
  }

  function handleNumberChange(key: keyof ConfigFormData, value: string) {
    const num = value === "" ? 0 : parseFloat(value);
    handleChange(key, num as ConfigFormData[typeof key]);
  }

  function handleSave() {
    updateMutation.mutate(
      {
        id: config.id,
        organizationId,
        ...formData,
        softwareMode: formData.softwareMode as "STANDARD" | "ADVANCED",
        rentProcessingMode: formData.rentProcessingMode as "LEDGER" | "BILL",
      },
      {
        onSuccess: () => {
          setIsDirty(false);
          setSuccess(true);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {success && (
        <div className="text-sm text-green-600 bg-green-500/10 p-3 rounded-md">
          Configuration saved successfully.
        </div>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="rent">Rent</TabsTrigger>
          <TabsTrigger value="interest">Interest</TabsTrigger>
          <TabsTrigger value="packets">Packets</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSubTab formData={formData} onChange={handleChange} />
        </TabsContent>
        <TabsContent value="rent">
          <RentSubTab formData={formData} onChange={handleChange} onNumberChange={handleNumberChange} />
        </TabsContent>
        <TabsContent value="interest">
          <InterestSubTab formData={formData} onChange={handleChange} onNumberChange={handleNumberChange} />
        </TabsContent>
        <TabsContent value="packets">
          <PacketsSubTab formData={formData} onChange={handleChange} onNumberChange={handleNumberChange} />
        </TabsContent>
        <TabsContent value="charges">
          <ChargesSubTab formData={formData} onNumberChange={handleNumberChange} />
        </TabsContent>
        <TabsContent value="display">
          <DisplaySubTab formData={formData} onChange={handleChange} />
        </TabsContent>
      </Tabs>

      {isDirty && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      )}
    </div>
  );
}

// -- Sub-tab components --

interface SubTabProps {
  formData: ConfigFormData;
  onChange: <K extends keyof ConfigFormData>(key: K, value: ConfigFormData[K]) => void;
  onNumberChange?: (key: keyof ConfigFormData, value: string) => void;
}

function GeneralSubTab({ formData, onChange }: SubTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Core software configuration options.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Software Mode</Label>
            <Select value={formData.softwareMode} onValueChange={(v) => onChange("softwareMode", v)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SOFTWARE_MODES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-3">
          <SwitchField label="Multi-Chamber Support" checked={formData.multiChamber} onCheckedChange={(v) => onChange("multiChamber", v)} />
          <SwitchField label="Partial Lot Allowed" checked={formData.partialLot} onCheckedChange={(v) => onChange("partialLot", v)} />
          <SwitchField label="Map Required" checked={formData.mapRequired} onCheckedChange={(v) => onChange("mapRequired", v)} />
          <SwitchField label="Separate Voucher Numbering" checked={formData.separateVoucherNo} onCheckedChange={(v) => onChange("separateVoucherNo", v)} />
        </div>
      </CardContent>
    </Card>
  );
}

function RentSubTab({ formData, onChange, onNumberChange }: SubTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rent Settings</CardTitle>
        <CardDescription>Rent calculation and processing configuration.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Rent Calculation Basis</Label>
            <Select value={formData.rentCalculationBasis} onValueChange={(v) => onChange("rentCalculationBasis", v)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Rent Processing Mode</Label>
            <Select value={formData.rentProcessingMode} onValueChange={(v) => onChange("rentProcessingMode", v)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RENT_PROCESSING_MODES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Additional Rent Days</Label>
            <Input type="number" value={formData.additionalRentDays} onChange={(e) => onNumberChange?.("additionalRentDays", e.target.value)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InterestSubTab({ formData, onChange, onNumberChange }: SubTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interest Settings</CardTitle>
        <CardDescription>Interest calculation configuration.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Interest Rate (%)</Label>
            <Input type="number" step="0.01" value={formData.interestRate} onChange={(e) => onNumberChange?.("interestRate", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Days in Year</Label>
            <Input type="number" value={formData.interestDaysInYear} onChange={(e) => onNumberChange?.("interestDaysInYear", e.target.value)} />
          </div>
        </div>
        <div className="space-y-3">
          <SwitchField label="Auto-Calculate Interest" checked={formData.autoCalculateInterest} onCheckedChange={(v) => onChange("autoCalculateInterest", v)} />
          <SwitchField label="Apply Interest on Rent" checked={formData.applyInterestOnRent} onCheckedChange={(v) => onChange("applyInterestOnRent", v)} />
          <SwitchField label="Apply Interest on Labor" checked={formData.applyInterestOnLabor} onCheckedChange={(v) => onChange("applyInterestOnLabor", v)} />
          <SwitchField label="Apply Interest on Bardana" checked={formData.applyInterestOnBardana} onCheckedChange={(v) => onChange("applyInterestOnBardana", v)} />
        </div>
      </CardContent>
    </Card>
  );
}

function PacketsSubTab({ formData, onChange, onNumberChange }: SubTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Packet Settings</CardTitle>
        <CardDescription>Packet types and weight configuration.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>PKT1 Name</Label>
            <Input value={formData.pkt1Name} onChange={(e) => onChange("pkt1Name", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>PKT1 Weight (kg)</Label>
            <Input type="number" step="0.01" value={formData.pkt1Weight} onChange={(e) => onNumberChange?.("pkt1Weight", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>PKT2 Name</Label>
            <Input value={formData.pkt2Name} onChange={(e) => onChange("pkt2Name", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>PKT2 Weight (kg)</Label>
            <Input type="number" step="0.01" value={formData.pkt2Weight} onChange={(e) => onNumberChange?.("pkt2Weight", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>PKT3 Name</Label>
            <Input value={formData.pkt3Name} onChange={(e) => onChange("pkt3Name", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>PKT3 Weight (kg)</Label>
            <Input type="number" step="0.01" value={formData.pkt3Weight} onChange={(e) => onNumberChange?.("pkt3Weight", e.target.value)} />
          </div>
        </div>
        <SwitchField label="Allow Mixed Packets" checked={formData.mixPackets} onCheckedChange={(v) => onChange("mixPackets", v)} />
      </CardContent>
    </Card>
  );
}

function ChargesSubTab({ formData, onNumberChange }: Omit<SubTabProps, "onChange">) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Charge Rates</CardTitle>
        <CardDescription>Default rates for grading, loading, and unloading operations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operation</TableHead>
                <TableHead>PKT1 Rate</TableHead>
                <TableHead>PKT2 Rate</TableHead>
                <TableHead>PKT3 Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Grading</TableCell>
                <TableCell>
                  <Input type="number" step="0.01" className="w-24" value={formData.gradingRatePKT1} onChange={(e) => onNumberChange?.("gradingRatePKT1", e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input type="number" step="0.01" className="w-24" value={formData.gradingRatePKT2} onChange={(e) => onNumberChange?.("gradingRatePKT2", e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input type="number" step="0.01" className="w-24" value={formData.gradingRatePKT3} onChange={(e) => onNumberChange?.("gradingRatePKT3", e.target.value)} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Loading</TableCell>
                <TableCell>
                  <Input type="number" step="0.01" className="w-24" value={formData.loadingRatePKT1} onChange={(e) => onNumberChange?.("loadingRatePKT1", e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input type="number" step="0.01" className="w-24" value={formData.loadingRatePKT2} onChange={(e) => onNumberChange?.("loadingRatePKT2", e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input type="number" step="0.01" className="w-24" value={formData.loadingRatePKT3} onChange={(e) => onNumberChange?.("loadingRatePKT3", e.target.value)} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Unloading</TableCell>
                <TableCell>
                  <Input type="number" step="0.01" className="w-24" value={formData.unloadingRatePKT1} onChange={(e) => onNumberChange?.("unloadingRatePKT1", e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input type="number" step="0.01" className="w-24" value={formData.unloadingRatePKT2} onChange={(e) => onNumberChange?.("unloadingRatePKT2", e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input type="number" step="0.01" className="w-24" value={formData.unloadingRatePKT3} onChange={(e) => onNumberChange?.("unloadingRatePKT3", e.target.value)} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function DisplaySubTab({ formData, onChange }: SubTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Settings</CardTitle>
        <CardDescription>Configure what information is shown in the interface.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <SwitchField label="Show Balance" checked={formData.showBalance} onCheckedChange={(v) => onChange("showBalance", v)} />
        <SwitchField label="Show Shadow Balance" checked={formData.showShadowBalance} onCheckedChange={(v) => onChange("showShadowBalance", v)} />
        <SwitchField label="Search on Name" checked={formData.searchOnName} onCheckedChange={(v) => onChange("searchOnName", v)} />
        <SwitchField label="Search on Code" checked={formData.searchOnCode} onCheckedChange={(v) => onChange("searchOnCode", v)} />
        <SwitchField label="Search on Mobile" checked={formData.searchOnMobile} onCheckedChange={(v) => onChange("searchOnMobile", v)} />
      </CardContent>
    </Card>
  );
}

function SwitchField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="font-normal">{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
