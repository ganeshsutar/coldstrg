/**
 * Test data fixtures for inventory module E2E tests
 */

// Amad test data
export const testAmad = {
  basic: {
    villageName: "Test Village",
    post: "Test Post",
    district: "Test District",
    road: "Test Road",
  },
  packets: {
    pkt1Count: "10",
    pkt1Weight: "800",
    pkt2Count: "5",
    pkt2Weight: "350",
    pkt3Count: "3",
    pkt3Weight: "150",
  },
  marks: {
    mark1: "TM1",
    mark2: "TM2",
    partyMark: "PM",
  },
  commodity: {
    variety: "Test Variety",
    rentRate: "5",
    graceDays: "7",
  },
};

// Nikasi (Dispatch) test data
export const testNikasi = {
  packets: {
    pkt1: "5",
    pkt2: "3",
    pkt3: "2",
  },
  charges: {
    storageDays: "30",
    rate: "5",
    loading: "100",
    unloading: "100",
    dumping: "50",
    cgst: "45",
    sgst: "45",
    igst: "0",
  },
  receiver: {
    name: "Test Receiver",
    vehicleNo: "UP32AB1234",
  },
};

// Takpatti test data
export const testTakpatti = {
  packets: {
    pkt1: "10",
    pkt2: "5",
    pkt3: "3",
  },
  room: "Chamber-1",
};

// Stock Transfer test data
export const testTransfer = {
  packets: {
    pkt1: "2",
    pkt2: "1",
    pkt3: "1",
  },
  destRoom: "Chamber-2",
  remarks: "Test transfer",
};

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
};

// Generate unique test data with timestamp
export function uniqueVillage(baseName: string): string {
  return `${baseName}_${Date.now()}`;
}

export function uniqueMark(baseMark: string): string {
  return `${baseMark}_${Date.now()}`;
}

export function uniqueRoom(baseRoom: string): string {
  return `${baseRoom}_${Date.now()}`;
}

export function uniqueRemarks(baseRemarks: string): string {
  return `${baseRemarks} - ${Date.now()}`;
}
