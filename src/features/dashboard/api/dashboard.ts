import type {
  DashboardData,
  DashboardMetric,
  FinancialSummary,
  Alert,
  AmadTransaction,
  NikasiTransaction,
  VoucherTransaction,
  RoomOccupancy,
  QuickAction,
  ChartDataPoint,
  TransactionRow,
} from "../types";

// Mock data for dashboard - will be replaced with actual API calls
const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Today's Amad",
    value: "12",
    subValue: "245 qtl / 4,120 packets",
    change: { value: 8, type: "increase" },
    icon: "truck",
  },
  {
    label: "Today's Nikasi",
    value: "8",
    subValue: "180 qtl / 2,980 packets",
    change: { value: 12, type: "increase" },
    icon: "package-open",
  },
  {
    label: "Current Stock",
    value: "15,240 qtl",
    subValue: "78% occupancy",
    change: { value: 3, type: "decrease" },
    icon: "warehouse",
  },
  {
    label: "Cash Balance",
    value: "4,52,000",
    subValue: "+65,000 today",
    change: { value: 15, type: "increase" },
    icon: "indian-rupee",
  },
];

const financialSummary: FinancialSummary[] = [
  {
    label: "Total Receivables",
    amount: "28,45,000",
    progress: 65,
    details: "142 parties • 85 overdue",
    type: "receivable",
  },
  {
    label: "Total Payables",
    amount: "12,80,000",
    progress: 35,
    details: "68 parties • 12 due today",
    type: "payable",
  },
  {
    label: "Pending Saudas",
    amount: "18",
    details: "5 due today • 3 overdue",
    type: "pending",
  },
];

const alerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Payment Overdue",
    description: "Ramesh Kumar - 2,45,000 overdue by 15 days",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "temperature",
    title: "Temperature Alert",
    description: "Room 3 temperature above threshold (8°C)",
    timestamp: "30 min ago",
  },
  {
    id: "3",
    type: "warning",
    title: "Stock Low",
    description: "Room 5 occupancy below 20%",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "info",
    title: "Sauda Due Today",
    description: "3 saudas pending settlement",
    timestamp: "Today",
  },
  {
    id: "5",
    type: "warning",
    title: "Bardana Advance Pending",
    description: "Suresh Traders - 15,000 pending",
    timestamp: "3 hours ago",
  },
];

const recentAmad: AmadTransaction[] = [
  {
    id: "A001",
    partyName: "Ramesh Kumar",
    partyType: "kissan",
    lots: 3,
    quantity: "65 qtl",
    room: "Room 2",
    timestamp: "10:30 AM",
  },
  {
    id: "A002",
    partyName: "Sharma Traders",
    partyType: "vyapari",
    lots: 5,
    quantity: "120 qtl",
    room: "Room 4",
    timestamp: "09:15 AM",
  },
  {
    id: "A003",
    partyName: "Gupta Commission",
    partyType: "aarti",
    lots: 2,
    quantity: "45 qtl",
    room: "Room 1",
    timestamp: "08:45 AM",
  },
  {
    id: "A004",
    partyName: "Mohan Singh",
    partyType: "kissan",
    lots: 1,
    quantity: "22 qtl",
    room: "Room 3",
    timestamp: "Yesterday",
  },
  {
    id: "A005",
    partyName: "Patel Brothers",
    partyType: "vyapari",
    lots: 4,
    quantity: "95 qtl",
    room: "Room 2",
    timestamp: "Yesterday",
  },
];

const recentNikasi: NikasiTransaction[] = [
  {
    id: "N001",
    partyName: "Krishna Traders",
    partyType: "vyapari",
    lots: 2,
    quantity: "48 qtl",
    room: "Room 1",
    billNumber: "NB-2024-156",
    timestamp: "11:00 AM",
  },
  {
    id: "N002",
    partyName: "Agarwal & Sons",
    partyType: "vyapari",
    lots: 3,
    quantity: "72 qtl",
    room: "Room 3",
    billNumber: "NB-2024-155",
    timestamp: "09:30 AM",
  },
  {
    id: "N003",
    partyName: "Sunita Devi",
    partyType: "kissan",
    lots: 1,
    quantity: "25 qtl",
    room: "Room 2",
    timestamp: "Yesterday",
  },
  {
    id: "N004",
    partyName: "Metro Foods",
    partyType: "vyapari",
    lots: 4,
    quantity: "98 qtl",
    room: "Room 4",
    billNumber: "NB-2024-154",
    timestamp: "Yesterday",
  },
];

const recentVouchers: VoucherTransaction[] = [
  {
    id: "V001",
    partyName: "Ramesh Kumar",
    type: "receipt",
    amount: "45,000",
    mode: "cash",
    timestamp: "10:45 AM",
  },
  {
    id: "V002",
    partyName: "Sharma Traders",
    type: "payment",
    amount: "1,25,000",
    mode: "bank",
    timestamp: "09:00 AM",
  },
  {
    id: "V003",
    partyName: "Gupta Commission",
    type: "receipt",
    amount: "8,500",
    mode: "upi",
    timestamp: "Yesterday",
  },
  {
    id: "V004",
    partyName: "Krishna Traders",
    type: "receipt",
    amount: "75,000",
    mode: "bank",
    timestamp: "Yesterday",
  },
  {
    id: "V005",
    partyName: "Labour Payment",
    type: "payment",
    amount: "12,000",
    mode: "cash",
    timestamp: "Yesterday",
  },
];

const roomOccupancy: RoomOccupancy[] = [
  {
    id: "R1",
    name: "Room 1",
    capacity: "5,000 qtl",
    current: "4,250 qtl",
    occupancy: 85,
    temperature: "-2°C",
    status: "normal",
  },
  {
    id: "R2",
    name: "Room 2",
    capacity: "4,500 qtl",
    current: "3,800 qtl",
    occupancy: 84,
    temperature: "-1°C",
    status: "normal",
  },
  {
    id: "R3",
    name: "Room 3",
    capacity: "5,000 qtl",
    current: "4,100 qtl",
    occupancy: 82,
    temperature: "8°C",
    status: "critical",
  },
  {
    id: "R4",
    name: "Room 4",
    capacity: "3,500 qtl",
    current: "2,450 qtl",
    occupancy: 70,
    temperature: "0°C",
    status: "normal",
  },
  {
    id: "R5",
    name: "Room 5",
    capacity: "4,000 qtl",
    current: "640 qtl",
    occupancy: 16,
    temperature: "-2°C",
    status: "warning",
  },
];

const quickActions: QuickAction[] = [
  { id: "new-amad", label: "New Amad", icon: "truck", shortcut: "A" },
  { id: "new-nikasi", label: "New Nikasi", icon: "package-open", shortcut: "N" },
  { id: "new-voucher", label: "New Voucher", icon: "receipt", shortcut: "V" },
  { id: "new-party", label: "New Party", icon: "user-plus", shortcut: "P" },
  { id: "new-sauda", label: "New Sauda", icon: "handshake", shortcut: "S" },
  { id: "search-party", label: "Search Party", icon: "search" },
];

// Generate 30 days of chart data
function generateChartData(): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      amad: Math.floor(Math.random() * 150) + 50,
      nikasi: Math.floor(Math.random() * 120) + 30,
    });
  }
  return data;
}

const chartData = generateChartData();

// Unified transactions list
const transactions: TransactionRow[] = [
  {
    id: "T001",
    partyName: "Ramesh Kumar",
    type: "amad",
    quantity: "65 qtl",
    room: "Room 2",
    timestamp: "2024-01-15 10:30",
    status: "completed",
  },
  {
    id: "T002",
    partyName: "Krishna Traders",
    type: "nikasi",
    quantity: "48 qtl",
    room: "Room 1",
    timestamp: "2024-01-15 11:00",
    status: "completed",
  },
  {
    id: "T003",
    partyName: "Sharma Traders",
    type: "amad",
    quantity: "120 qtl",
    room: "Room 4",
    timestamp: "2024-01-15 09:15",
    status: "completed",
  },
  {
    id: "T004",
    partyName: "Gupta Commission",
    type: "voucher",
    quantity: "45,000",
    timestamp: "2024-01-15 10:45",
    status: "completed",
  },
  {
    id: "T005",
    partyName: "Agarwal & Sons",
    type: "nikasi",
    quantity: "72 qtl",
    room: "Room 3",
    timestamp: "2024-01-15 09:30",
    status: "completed",
  },
  {
    id: "T006",
    partyName: "Mohan Singh",
    type: "amad",
    quantity: "22 qtl",
    room: "Room 3",
    timestamp: "2024-01-14 14:20",
    status: "completed",
  },
  {
    id: "T007",
    partyName: "Metro Foods",
    type: "nikasi",
    quantity: "98 qtl",
    room: "Room 4",
    timestamp: "2024-01-14 16:45",
    status: "pending",
  },
  {
    id: "T008",
    partyName: "Patel Brothers",
    type: "amad",
    quantity: "95 qtl",
    room: "Room 2",
    timestamp: "2024-01-14 11:00",
    status: "completed",
  },
];

export async function fetchDashboardData(): Promise<DashboardData> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    metrics: dashboardMetrics,
    financialSummary,
    alerts,
    recentAmad,
    recentNikasi,
    recentVouchers,
    roomOccupancy,
    quickActions,
    chartData,
    transactions,
  };
}
