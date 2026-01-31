// Amad status type
export type AmadStatusValue = "IN_STOCK" | "PARTIAL_DISPATCH" | "DISPATCHED" | "PENDING";

// Transfer status type
export type TransferStatusValue = "PENDING" | "COMPLETED" | "CANCELLED";

// Amad filter tab type
export type AmadFilterTab = "all" | "in-stock" | "partial" | "dispatched" | "pending";

// Amad types
export interface Amad {
  id: string;
  organizationId: string;
  amadNo: number;
  date: string;
  partyId?: string | null;
  partyName: string;
  villageName?: string | null;
  post?: string | null;
  district?: string | null;
  road?: string | null;
  floor?: string | null;
  room?: string | null;
  chamberId?: string | null;
  chamberName?: string | null;
  position?: string | null;
  commodityId?: string | null;
  commodityName?: string | null;
  variety?: string | null;
  pkt1?: number | null;
  pkt2?: number | null;
  pkt3?: number | null;
  pwt1?: number | null;
  pwt2?: number | null;
  pwt3?: number | null;
  totalWeight?: number | null;
  totalPackets?: number | null;
  mark1?: string | null;
  mark2?: string | null;
  partyMark?: string | null;
  dalaCharges?: number | null;
  rentRate?: number | null;
  graceDays?: number | null;
  graceDays1?: number | null;
  takpattiNo?: number | null;
  eWayBillNo?: string | null;
  eWayBillDate?: string | null;
  transferRef?: string | null;
  status?: AmadStatusValue | null;
  dispatchedPackets?: number | null;
  grading?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAmadInput {
  organizationId: string;
  amadNo: number;
  date: string;
  partyId?: string;
  partyName: string;
  villageName?: string;
  post?: string;
  district?: string;
  road?: string;
  floor?: string;
  room?: string;
  chamberId?: string;
  chamberName?: string;
  position?: string;
  commodityId?: string;
  commodityName?: string;
  variety?: string;
  pkt1?: number;
  pkt2?: number;
  pkt3?: number;
  pwt1?: number;
  pwt2?: number;
  pwt3?: number;
  totalWeight?: number;
  totalPackets?: number;
  mark1?: string;
  mark2?: string;
  partyMark?: string;
  dalaCharges?: number;
  rentRate?: number;
  graceDays?: number;
  graceDays1?: number;
  takpattiNo?: number;
  eWayBillNo?: string;
  eWayBillDate?: string;
  transferRef?: string;
  status?: AmadStatusValue;
  dispatchedPackets?: number;
  grading?: string;
  isActive?: boolean;
}

export interface UpdateAmadInput extends Partial<CreateAmadInput> {
  id: string;
}

// Rent types
export interface Rent {
  id: string;
  organizationId: string;
  serialNo: number;
  date: string;
  partyId?: string | null;
  partyName: string;
  amadId?: string | null;
  amadNo?: number | null;
  receiverName?: string | null;
  pkt1?: number | null;
  pkt2?: number | null;
  pkt3?: number | null;
  totalPackets?: number | null;
  totalWeight?: number | null;
  storageDays?: number | null;
  rent?: number | null;
  rate?: number | null;
  amount?: number | null;
  loadingAmt?: number | null;
  unloadingAmt?: number | null;
  dumpingAmt?: number | null;
  vehicleNo?: string | null;
  cgst?: number | null;
  sgst?: number | null;
  igst?: number | null;
  billAmount?: number | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentInput {
  organizationId: string;
  serialNo: number;
  date: string;
  partyId?: string;
  partyName: string;
  amadId?: string;
  amadNo?: number;
  receiverName?: string;
  pkt1?: number;
  pkt2?: number;
  pkt3?: number;
  totalPackets?: number;
  totalWeight?: number;
  storageDays?: number;
  rent?: number;
  rate?: number;
  amount?: number;
  loadingAmt?: number;
  unloadingAmt?: number;
  dumpingAmt?: number;
  vehicleNo?: string;
  cgst?: number;
  sgst?: number;
  igst?: number;
  billAmount?: number;
  isActive?: boolean;
}

export interface UpdateRentInput extends Partial<CreateRentInput> {
  id: string;
}

// Takpatti types
export interface Takpatti {
  id: string;
  organizationId: string;
  takpattiNo: number;
  amadNo?: number | null;
  amadId?: string | null;
  date: string;
  pkt1?: number | null;
  pkt2?: number | null;
  pkt3?: number | null;
  totalPackets?: number | null;
  totalWeight?: number | null;
  serialNo?: number | null;
  room?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTakpattiInput {
  organizationId: string;
  takpattiNo: number;
  amadNo?: number;
  amadId?: string;
  date: string;
  pkt1?: number;
  pkt2?: number;
  pkt3?: number;
  totalPackets?: number;
  totalWeight?: number;
  serialNo?: number;
  room?: string;
  isActive?: boolean;
}

// StockTransfer types
export interface StockTransfer {
  id: string;
  organizationId: string;
  transferNo: number;
  date: string;
  amadId?: string | null;
  amadNo?: number | null;
  fromPartyId?: string | null;
  fromPartyName?: string | null;
  toPartyId?: string | null;
  toPartyName?: string | null;
  commodityName?: string | null;
  pkt1?: number | null;
  pkt2?: number | null;
  pkt3?: number | null;
  totalPackets?: number | null;
  totalWeight?: number | null;
  sourceRoom?: string | null;
  destRoom?: string | null;
  status?: TransferStatusValue | null;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockTransferInput {
  organizationId: string;
  transferNo: number;
  date: string;
  amadId?: string;
  amadNo?: number;
  fromPartyId?: string;
  fromPartyName?: string;
  toPartyId?: string;
  toPartyName?: string;
  commodityName?: string;
  pkt1?: number;
  pkt2?: number;
  pkt3?: number;
  totalPackets?: number;
  totalWeight?: number;
  sourceRoom?: string;
  destRoom?: string;
  status?: TransferStatusValue;
  remarks?: string;
  isActive?: boolean;
}
