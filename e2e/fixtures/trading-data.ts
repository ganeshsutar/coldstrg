/**
 * Test data fixtures for trading module E2E tests
 */

// Sauda (Deal) test data
export const testSauda = {
  basic: {
    commodity: "POTATO",
    variety: "PUKHRAJ",
    quantity: "100",
    rate: "1500",
    dueDays: "30",
  },
  withTerms: {
    commodity: "POTATO",
    variety: "CHIPSONA",
    quantity: "200",
    rate: "1200",
    dueDays: "45",
    paymentTerms: "50% advance, 50% on delivery",
    deliveryLocation: "Agra Mandi, Near Gate No. 3",
    remarks: "Quality: A-grade only. Transport by buyer.",
  },
  small: {
    commodity: "POTATO",
    variety: "JYOTI",
    quantity: "50",
    rate: "1000",
    dueDays: "15",
  },
};

// Gate Pass test data
export const testGatePass = {
  basic: {
    vehicleNo: "UP32AB1234",
    driverName: "Ramesh Kumar",
    driverContact: "9876543210",
  },
  withTransport: {
    transport: "ABC Transport",
    vehicleNo: "DL01CD5678",
    driverName: "Suresh Kumar",
    driverContact: "9876543211",
    biltiNo: "BLT-2024-0123",
    buyerLocation: "Delhi Azadpur Mandi",
  },
  selfDispatch: {
    vehicleNo: "UP80EF9012",
    driverName: "Self",
    remarks: "Owner taking own goods",
  },
};

// Katai (Grading) test data
export const testKatai = {
  basic: {
    bagsGraded: "50",
    laborRate: "5",
  },
  fullGrading: {
    bagsGraded: "100",
    motaBags: "30",
    chattaBags: "40",
    beejBags: "15",
    mixBags: "10",
    gullaBags: "5",
    laborName: "Ramesh",
    laborRate: "5",
    remarks: "Graded for sale",
  },
  partialGrading: {
    bagsGraded: "30",
    motaBags: "10",
    chattaBags: "12",
    beejBags: "5",
    mixBags: "2",
    gullaBags: "1",
    laborRate: "4",
  },
};

// Deal status types
export const dealStatuses = {
  OPEN: "Open",
  PARTIAL: "Partial",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

// Gate pass status types
export const gatePassStatuses = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  DONE: "Done",
  CANCELLED: "Cancelled",
} as const;

// Katai status types
export const kataiStatuses = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
} as const;

// Grading grades
export const gradingGrades = {
  MOTA: { name: "Mota", description: "Large size (>55mm)", color: "green" },
  CHATTA: { name: "Chatta", description: "Medium size (45-55mm)", color: "blue" },
  BEEJ: { name: "Beej", description: "Seed grade (<45mm)", color: "amber" },
  MIX: { name: "Mix", description: "Mixed sizes", color: "purple" },
  GULLA: { name: "Gulla", description: "Damaged/Reject", color: "red" },
} as const;

// Date helpers
export const testDates = {
  today: () => new Date().toISOString().split("T")[0],
  yesterday: () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  },
  tomorrow: () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  },
  daysAgo: (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split("T")[0];
  },
  daysFromNow: (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  },
};

// Generate unique test data with timestamp
export function uniqueSaudaRemarks(baseRemarks: string): string {
  return `${baseRemarks} - ${Date.now()}`;
}

export function uniqueVehicleNo(): string {
  const states = ["UP32", "DL01", "HR26", "RJ14"];
  const state = states[Math.floor(Math.random() * states.length)];
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters =
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length));
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return `${state}${randomLetters}${randomNumbers}`;
}

export function uniqueBiltiNo(): string {
  return `BLT-${Date.now()}`;
}

export function uniqueDriverContact(): string {
  return `98${Math.floor(10000000 + Math.random() * 90000000)}`;
}

// Calculate expected deal amount
export function calculateDealAmount(
  quantity: number,
  rate: number,
  weightPerBag: number = 50
): number {
  // quantity in bags, rate in Rs/quintal
  // Total weight = bags * weightPerBag (kg)
  // Total quintals = Total weight / 100
  // Amount = quintals * rate
  const totalWeight = quantity * weightPerBag;
  const quintals = totalWeight / 100;
  return quintals * rate;
}

// Calculate due date from deal date and due days
export function calculateDueDate(dealDate: string, dueDays: number): string {
  const date = new Date(dealDate);
  date.setDate(date.getDate() + dueDays);
  return date.toISOString().split("T")[0];
}

// Calculate grading charges
export function calculateGradingCharges(
  bagsGraded: number,
  ratePerBag: number
): number {
  return bagsGraded * ratePerBag;
}

// Check if grading output is balanced
export function isGradingBalanced(
  input: number,
  output: {
    motaBags: number;
    chattaBags: number;
    beejBags: number;
    mixBags: number;
    gullaBags: number;
  }
): boolean {
  const total =
    output.motaBags +
    output.chattaBags +
    output.beejBags +
    output.mixBags +
    output.gullaBags;
  return total === input;
}
