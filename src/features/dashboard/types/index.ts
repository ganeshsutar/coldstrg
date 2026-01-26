export interface DashboardMetric {
  label: string;
  value: string;
  subValue?: string;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: string;
}

export interface FinancialSummary {
  label: string;
  amount: string;
  progress?: number;
  details: string;
  type: "receivable" | "payable" | "pending";
}

export type AlertType = "critical" | "warning" | "info" | "temperature";

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  timestamp: string;
}

export interface AmadTransaction {
  id: string;
  partyName: string;
  partyType: "kissan" | "vyapari" | "aarti";
  lots: number;
  quantity: string;
  room: string;
  timestamp: string;
}

export interface NikasiTransaction {
  id: string;
  partyName: string;
  partyType: "kissan" | "vyapari" | "aarti";
  lots: number;
  quantity: string;
  room: string;
  billNumber?: string;
  timestamp: string;
}

export interface VoucherTransaction {
  id: string;
  partyName: string;
  type: "receipt" | "payment";
  amount: string;
  mode: "cash" | "bank" | "upi";
  timestamp: string;
}

export interface RoomOccupancy {
  id: string;
  name: string;
  capacity: string;
  current: string;
  occupancy: number;
  temperature: string;
  status: "normal" | "warning" | "critical";
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
}

export interface ChartDataPoint {
  date: string;
  amad: number;
  nikasi: number;
}

export interface TransactionRow {
  id: string;
  partyName: string;
  type: "amad" | "nikasi" | "voucher";
  quantity: string;
  room?: string;
  timestamp: string;
  status: "completed" | "pending";
}

export interface DashboardData {
  metrics: DashboardMetric[];
  financialSummary: FinancialSummary[];
  alerts: Alert[];
  recentAmad: AmadTransaction[];
  recentNikasi: NikasiTransaction[];
  recentVouchers: VoucherTransaction[];
  roomOccupancy: RoomOccupancy[];
  quickActions: QuickAction[];
  chartData: ChartDataPoint[];
  transactions: TransactionRow[];
}
