/**
 * Test data fixtures for bardana module E2E tests
 */

// Bardana type test data
export const testBardanaType = {
  jute: {
    code: "JUTE",
    name: "Jute Bags",
    nameHindi: "जूट बोरी",
    rate: "25",
    unit: "bags",
    openingStock: "1000",
  },
  plastic: {
    code: "PLST",
    name: "Plastic Bags",
    nameHindi: "प्लास्टिक बोरी",
    rate: "15",
    unit: "bags",
    openingStock: "500",
  },
  hdpe: {
    code: "HDPE",
    name: "HDPE Bags",
    nameHindi: "एचडीपीई बोरी",
    rate: "20",
    unit: "bags",
    openingStock: "750",
  },
};

// Issue test data
export const testIssue = {
  regular: {
    type: "regular" as const,
    narration: "Regular issue for storage",
  },
  advance: {
    type: "advance" as const,
    interestRate: "2",
    expectedDays: "30",
    narration: "Advance issue with interest",
  },
  item: {
    quantity: "100",
    rate: "25",
  },
};

// Receipt/Return test data
export const testReceipt = {
  good: {
    condition: "GOOD" as const,
    narration: "Bags returned in good condition",
  },
  fair: {
    condition: "FAIR" as const,
    narration: "Bags returned in fair condition - some wear",
  },
  damaged: {
    condition: "DAMAGED" as const,
    narration: "Bags returned damaged - deduction applied",
  },
  item: {
    quantity: "50",
  },
};

// Condition values
export const CONDITIONS = {
  GOOD: { value: "GOOD", label: "Good (100%)", creditPercent: 100 },
  FAIR: { value: "FAIR", label: "Fair (50%)", creditPercent: 50 },
  DAMAGED: { value: "DAMAGED", label: "Damaged (0%)", creditPercent: 0 },
  UNUSABLE: { value: "UNUSABLE", label: "Unusable (0%)", creditPercent: 0 },
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
  daysFromNow: (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  },
};

// Generate unique test data with timestamp
export function uniqueCode(baseCode: string): string {
  return `${baseCode}_${Date.now()}`;
}

export function uniqueName(baseName: string): string {
  return `${baseName}_${Date.now()}`;
}

export function uniqueNarration(baseNarration: string): string {
  return `${baseNarration} - ${Date.now()}`;
}

// Generate random quantity within range
export function randomQuantity(min: number = 10, max: number = 100): string {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

// Generate random rate within range
export function randomRate(min: number = 10, max: number = 50): string {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
