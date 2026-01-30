// ============== TRADING ENUMS ==============

export type SaudaStatusValue = "OPEN" | "PARTIAL" | "DISPATCHED" | "CANCELLED" | "COMPLETED";
export type GatePassStatusValue = "DRAFT" | "PENDING" | "DONE" | "CANCELLED";
export type KataiStatusValue = "PENDING" | "IN_PROGRESS" | "COMPLETED";

// ============== SAUDA TYPES ==============

// Sauda - Trading deals/contracts
export interface Sauda {
  id: string;
  organizationId: string;
  saudaNo: number;
  saudaDate: string;
  dueDate?: string | null;
  dueDays: number;
  // Seller (Party with stock)
  sellerPartyId: string;
  sellerPartyName?: string | null;
  sellerVillage?: string | null;
  // Buyer (Vyapari/Trader)
  buyerPartyId: string;
  buyerPartyName?: string | null;
  buyerContact?: string | null;
  buyerLocation?: string | null;
  // Commodity details
  commodityId?: string | null;
  commodityName?: string | null;
  variety?: string | null;
  // Quantities
  quantity: number; // Total bags
  rate: number; // Rate per quintal
  amount: number; // Calculated total
  // Progress tracking
  dispatchedQty: number;
  balanceQty: number;
  // Terms
  paymentTerms?: string | null;
  deliveryLocation?: string | null;
  // Status
  status: SaudaStatusValue;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaudaInput {
  organizationId: string;
  saudaNo: number;
  saudaDate: string;
  dueDate?: string;
  dueDays?: number;
  sellerPartyId: string;
  sellerPartyName?: string;
  sellerVillage?: string;
  buyerPartyId: string;
  buyerPartyName?: string;
  buyerContact?: string;
  buyerLocation?: string;
  commodityId?: string;
  commodityName?: string;
  variety?: string;
  quantity: number;
  rate: number;
  amount?: number;
  dispatchedQty?: number;
  balanceQty?: number;
  paymentTerms?: string;
  deliveryLocation?: string;
  status: SaudaStatusValue;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdateSaudaInput extends Partial<CreateSaudaInput> {
  id: string;
}

export interface SaudaFormInput {
  saudaDate: string;
  dueDate?: string;
  dueDays?: number;
  sellerPartyId: string;
  sellerPartyName?: string;
  sellerVillage?: string;
  buyerPartyId: string;
  buyerPartyName?: string;
  buyerContact?: string;
  buyerLocation?: string;
  commodityId?: string;
  commodityName?: string;
  variety?: string;
  quantity: number;
  rate: number;
  paymentTerms?: string;
  deliveryLocation?: string;
  remarks?: string;
}

// ============== GATE PASS TYPES ==============

// GatePass - Gate pass/delivery note header
export interface GatePass {
  id: string;
  organizationId: string;
  gpNo: number;
  gpDate: string;
  gpTime?: string | null;
  // Seller (Party dispatching)
  sellerPartyId: string;
  sellerPartyName?: string | null;
  sellerVillage?: string | null;
  // Receiver (Buyer/Sakindar)
  buyerPartyId?: string | null;
  buyerPartyName?: string | null;
  buyerLocation?: string | null;
  // Link to deal (optional)
  saudaId?: string | null;
  saudaNo?: number | null;
  // Transport details
  transport?: string | null;
  vehicleNo?: string | null;
  driverName?: string | null;
  driverContact?: string | null;
  biltiNo?: string | null;
  // Totals
  totalPkt1: number;
  totalPkt2: number;
  totalPkt3: number;
  totalPackets: number;
  totalWeight: number;
  rate?: number | null;
  amount: number;
  // Status
  status: GatePassStatusValue;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGatePassInput {
  organizationId: string;
  gpNo: number;
  gpDate: string;
  gpTime?: string;
  sellerPartyId: string;
  sellerPartyName?: string;
  sellerVillage?: string;
  buyerPartyId?: string;
  buyerPartyName?: string;
  buyerLocation?: string;
  saudaId?: string;
  saudaNo?: number;
  transport?: string;
  vehicleNo?: string;
  driverName?: string;
  driverContact?: string;
  biltiNo?: string;
  totalPkt1?: number;
  totalPkt2?: number;
  totalPkt3?: number;
  totalPackets?: number;
  totalWeight?: number;
  rate?: number;
  amount?: number;
  status: GatePassStatusValue;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdateGatePassInput extends Partial<CreateGatePassInput> {
  id: string;
}

// ============== GATE PASS DETAIL TYPES ==============

// GatePassDetail - Gate pass line items (Amad-wise)
export interface GatePassDetail {
  id: string;
  organizationId: string;
  gatePassId: string;
  // Amad reference
  amadId: string;
  amadNo?: number | null;
  amadDate?: string | null;
  // Commodity info (denormalized)
  commodityName?: string | null;
  variety?: string | null;
  marks?: string | null;
  // Quantities
  pkt1: number;
  pkt2: number;
  pkt3: number;
  totalPackets: number;
  weight: number;
  rate?: number | null;
  amount: number;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGatePassDetailInput {
  organizationId: string;
  gatePassId: string;
  amadId: string;
  amadNo?: number;
  amadDate?: string;
  commodityName?: string;
  variety?: string;
  marks?: string;
  pkt1?: number;
  pkt2?: number;
  pkt3?: number;
  totalPackets?: number;
  weight?: number;
  rate?: number;
  amount?: number;
  isActive?: boolean;
}

export interface UpdateGatePassDetailInput extends Partial<CreateGatePassDetailInput> {
  id: string;
}

// ============== KATAI TYPES ==============

// Katai - Grading/sorting records
export interface Katai {
  id: string;
  organizationId: string;
  kataiNo: number;
  kataiDate: string;
  // Party
  partyId: string;
  partyName?: string | null;
  // Amad reference
  amadId: string;
  amadNo?: number | null;
  // Input
  bagsGraded: number;
  // Grading output (5 grades)
  motaBags: number; // Large (>55mm)
  chattaBags: number; // Medium (45-55mm)
  beejBags: number; // Seed (<45mm)
  mixBags: number; // Mixed
  gullaBags: number; // Damaged/reject
  // Charges
  laborName?: string | null;
  laborRate: number;
  charges: number;
  // Status
  status: KataiStatusValue;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKataiInput {
  organizationId: string;
  kataiNo: number;
  kataiDate: string;
  partyId: string;
  partyName?: string;
  amadId: string;
  amadNo?: number;
  bagsGraded: number;
  motaBags?: number;
  chattaBags?: number;
  beejBags?: number;
  mixBags?: number;
  gullaBags?: number;
  laborName?: string;
  laborRate?: number;
  charges?: number;
  status: KataiStatusValue;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdateKataiInput extends Partial<CreateKataiInput> {
  id: string;
}

export interface KataiFormInput {
  kataiDate: string;
  partyId: string;
  partyName?: string;
  amadId: string;
  amadNo?: number;
  bagsGraded: number;
  motaBags?: number;
  chattaBags?: number;
  beejBags?: number;
  mixBags?: number;
  gullaBags?: number;
  laborName?: string;
  laborRate?: number;
  remarks?: string;
}

// ============== FORM INPUT TYPES ==============

export interface GatePassFormInput {
  gpDate: string;
  gpTime?: string;
  sellerPartyId: string;
  sellerPartyName?: string;
  sellerVillage?: string;
  buyerPartyId?: string;
  buyerPartyName?: string;
  buyerLocation?: string;
  saudaId?: string;
  saudaNo?: number;
  transport?: string;
  vehicleNo?: string;
  driverName?: string;
  driverContact?: string;
  biltiNo?: string;
  rate?: number;
  remarks?: string;
  // Line items
  details: GatePassDetailFormInput[];
}

export interface GatePassDetailFormInput {
  amadId: string;
  amadNo?: number;
  amadDate?: string;
  commodityName?: string;
  variety?: string;
  marks?: string;
  pkt1: number;
  pkt2: number;
  pkt3: number;
  weight?: number;
  rate?: number;
}

// ============== STATISTICS & SUMMARY TYPES ==============

export interface TradingStats {
  openDeals: number;
  openDealsValue: number;
  dispatchedToday: number;
  pendingDelivery: number;
  pendingDeliveryValue: number;
  gradedBags: number;
}

export interface SaudaStats {
  totalDeals: number;
  openDeals: number;
  partialDeals: number;
  completedDeals: number;
  totalValue: number;
  dispatchedValue: number;
  pendingValue: number;
}

export interface GatePassStats {
  totalPasses: number;
  todayCount: number;
  pendingPrint: number;
  weekCount: number;
  totalBags: number;
}

// ============== AMAD SELECTION TYPES ==============

export interface AmadSelectionItem {
  amadId: string;
  amadNo: number;
  amadDate: string;
  commodityName: string;
  variety?: string;
  marks?: string;
  availablePkt1: number;
  availablePkt2: number;
  availablePkt3: number;
  availableTotal: number;
  // Selected quantities
  selectedPkt1: number;
  selectedPkt2: number;
  selectedPkt3: number;
  selected: boolean;
}
