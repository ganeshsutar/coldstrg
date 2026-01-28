// Commodity types
export interface Commodity {
  id: string;
  organizationId: string;
  name: string;
  nameHindi?: string | null;
  code: string;
  commodityType?: "SEASONAL" | "REGULAR" | null;
  rentRatePKT1?: number | null;
  rentRatePKT2?: number | null;
  rentRatePKT3?: number | null;
  rateWT?: number | null;
  gracePeriod?: number | null;
  rentBasis?: "QUINTAL" | "PACKET" | "WEIGHT" | null;
  hsnCode?: string | null;
  loanRate?: number | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommodityInput {
  organizationId: string;
  name: string;
  nameHindi?: string;
  code: string;
  commodityType?: "SEASONAL" | "REGULAR";
  rentRatePKT1?: number;
  rentRatePKT2?: number;
  rentRatePKT3?: number;
  rateWT?: number;
  gracePeriod?: number;
  rentBasis?: "QUINTAL" | "PACKET" | "WEIGHT";
  hsnCode?: string;
  loanRate?: number;
  isActive?: boolean;
}

export interface UpdateCommodityInput extends Partial<CreateCommodityInput> {
  id: string;
}

// Village types
export interface Village {
  id: string;
  organizationId: string;
  name: string;
  nameHindi?: string | null;
  code: string;
  stateName: string;
  districtName: string;
  pincode?: string | null;
  road?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVillageInput {
  organizationId: string;
  name: string;
  nameHindi?: string;
  code: string;
  stateName: string;
  districtName: string;
  pincode?: string;
  road?: string;
  isActive?: boolean;
}

export interface UpdateVillageInput extends Partial<CreateVillageInput> {
  id: string;
}

export interface VillageTreeNode {
  stateName: string;
  districts: {
    districtName: string;
    villages: Village[];
  }[];
}

// Bank types
export interface Bank {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  ifscPattern?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBankInput {
  organizationId: string;
  name: string;
  code: string;
  ifscPattern?: string;
  isActive?: boolean;
}

export interface UpdateBankInput extends Partial<CreateBankInput> {
  id: string;
}

// GST Rate types
export interface GstRate {
  id: string;
  organizationId: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  hsnCode?: string | null;
  description?: string | null;
  effectiveDate: string;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGstRateInput {
  organizationId: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  hsnCode?: string;
  description?: string;
  effectiveDate: string;
  isActive?: boolean;
}

export interface UpdateGstRateInput extends Partial<CreateGstRateInput> {
  id: string;
}

// Labor Rate types
export type LaborRateTypeValue =
  | "LOADING"
  | "UNLOADING"
  | "RELOADING"
  | "GRADING"
  | "DUMPING"
  | "DALA";

export interface LaborRate {
  id: string;
  organizationId: string;
  rateType: LaborRateTypeValue;
  ratePKT1: number;
  ratePKT2?: number | null;
  ratePKT3?: number | null;
  effectiveDate: string;
  reason?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLaborRateInput {
  organizationId: string;
  rateType: LaborRateTypeValue;
  ratePKT1: number;
  ratePKT2?: number;
  ratePKT3?: number;
  effectiveDate: string;
  reason?: string;
  isActive?: boolean;
}
