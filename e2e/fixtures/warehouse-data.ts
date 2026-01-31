/**
 * Test data fixtures for warehouse module E2E tests
 */

// Chamber test data
export const testChamber = {
  basic: {
    name: "Test Chamber",
    nameHindi: "टेस्ट चैम्बर",
    floors: "3",
    totalRacks: "150",
    racksPerRow: "10",
    rackCapacity: "100",
  },
  temperature: {
    targetTemperature: "-18",
    minTemperature: "-25",
    maxTemperature: "-15",
  },
  description: "Test chamber for e2e testing",
};

// Loading test data
export const testLoading = {
  packets: {
    pkt1: "10",
    pkt2: "5",
    pkt3: "3",
  },
  remarks: "Test loading remarks",
};

// Unloading test data
export const testUnloading = {
  packets: {
    pkt1: "5",
    pkt2: "3",
    pkt3: "2",
  },
  vehicleNo: "UP32AB1234",
  remarks: "Test unloading remarks",
};

// Shifting test data
export const testShifting = {
  packets: {
    pkt1: "2",
    pkt2: "1",
    pkt3: "1",
  },
  reason: "SPACE_OPTIMIZATION",
  remarks: "Test shifting remarks",
};

// Temperature log test data
export const testTemperature = {
  basic: {
    lowTemp: "-20",
    highTemp: "-16",
    humidity: "85",
    recordedBy: "Test Operator",
    remarks: "Normal temperature",
  },
  warning: {
    lowTemp: "-12",
    highTemp: "-8",
    humidity: "90",
    recordedBy: "Test Operator",
    remarks: "Temperature warning",
  },
  critical: {
    lowTemp: "-5",
    highTemp: "0",
    humidity: "95",
    recordedBy: "Test Operator",
    remarks: "Critical temperature alert",
  },
};

// Meter reading test data
export const testMeterReading = {
  basic: {
    meterNumber: "MTR001",
    currentReading: "15000",
    recordedBy: "Test Operator",
    remarks: "Monthly reading",
  },
  chamberMeter: {
    meterNumber: "MTR-CH1",
    currentReading: "5000",
    recordedBy: "Test Operator",
    remarks: "Chamber specific meter",
  },
};

// Floor configuration test data
export const testFloorConfig = {
  floor1: {
    floorNumber: "1",
    floorName: "Ground Floor",
    fromRack: "1",
    toRack: "50",
    racksPerRow: "10",
  },
  floor2: {
    floorNumber: "2",
    floorName: "First Floor",
    fromRack: "51",
    toRack: "100",
    racksPerRow: "10",
  },
  floor3: {
    floorNumber: "3",
    floorName: "Second Floor",
    fromRack: "101",
    toRack: "150",
    racksPerRow: "10",
  },
};

// Date and time helpers
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
  currentTime: () => new Date().toTimeString().split(" ")[0].slice(0, 5),
};

// Generate unique test data with timestamp
export function uniqueChamberName(baseName: string): string {
  return `${baseName}_${Date.now()}`;
}

export function uniqueChamberCode(): string {
  return `C${Date.now().toString().slice(-4)}`;
}

export function uniqueMeterNumber(baseNumber: string): string {
  return `${baseNumber}_${Date.now().toString().slice(-4)}`;
}

export function uniqueRemarks(baseRemarks: string): string {
  return `${baseRemarks} - ${Date.now()}`;
}

export function uniqueVehicleNo(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return `UP32${randomLetters}${randomNumbers}`;
}

// Shifting reasons matching the constants
export const SHIFTING_REASONS = [
  "SPACE_OPTIMIZATION",
  "TEMPERATURE_ADJUSTMENT",
  "DISPATCH_PREPARATION",
  "MAINTENANCE",
  "OTHER",
] as const;

export type ShiftingReason = (typeof SHIFTING_REASONS)[number];

// Temperature status values
export const TEMPERATURE_STATUS = {
  NORMAL: "NORMAL",
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
} as const;

export type TemperatureStatus = keyof typeof TEMPERATURE_STATUS;

// Rack status values
export const RACK_STATUS = {
  EMPTY: "EMPTY",
  PARTIAL: "PARTIAL",
  FULL: "FULL",
} as const;

export type RackStatus = keyof typeof RACK_STATUS;
