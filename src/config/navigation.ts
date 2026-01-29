import type { NavItem, QuickCreateItem } from "@/types/navigation";

// Quick Create items with keyboard shortcuts
export const quickCreateItems: QuickCreateItem[] = [
  { id: "new-amad", label: "New Amad (Goods Receipt)", shortcut: "N" },
  { id: "new-dispatch", label: "New Dispatch (Nikasi)", shortcut: "D" },
  { id: "new-voucher", label: "New Voucher", shortcut: "V" },
  { id: "new-bill", label: "New Bill", shortcut: "B" },
  { id: "separator-1", label: "", separator: true },
  { id: "new-party", label: "New Party" },
  { id: "new-sauda", label: "New Deal (Sauda)" },
  { id: "issue-bardana", label: "Issue Bardana" },
];

// MAIN section - Core daily operations
export const mainNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard", to: "/dashboard" },
  {
    id: "inventory",
    label: "Inventory",
    icon: "warehouse",
    children: [
      { id: "amad", label: "Amad (Receipts)", icon: "truck", to: "/inventory/amad" },
      { id: "nikasi", label: "Nikasi (Dispatch)", icon: "package-open", to: "/inventory/nikasi" },
      { id: "takpatti", label: "Takpatti", icon: "file-stack", to: "/inventory/takpatti" },
      { id: "stock-transfer", label: "Stock Transfer", icon: "arrow-right-left", to: "/inventory/stock-transfer" },
    ],
  },
  { id: "chambers", label: "Chambers", icon: "door-open", to: "/chambers" },
  {
    id: "accounts",
    label: "Accounts",
    icon: "indian-rupee",
    children: [
      { id: "party-ledger", label: "Party Ledger", icon: "book-open", to: "/accounts/party-ledger" },
      { id: "chart-of-accounts", label: "Chart of Accounts", icon: "list", to: "/accounts/chart-of-accounts" },
      { id: "vouchers", label: "Vouchers", icon: "receipt", to: "/accounts/vouchers" },
      { id: "daybook", label: "Daybook", icon: "calendar", to: "/accounts/daybook" },
      { id: "interest", label: "Interest", icon: "percent", to: "/accounts/interest" },
    ],
  },
  { id: "billing", label: "Billing", icon: "credit-card", to: "/billing" },
  { id: "trading", label: "Trading", icon: "handshake", to: "/trading" },
];

// OPERATIONS section - Secondary workflows
export const operationsNavItems: NavItem[] = [
  {
    id: "bardana",
    label: "Bardana",
    icon: "package",
    children: [
      { id: "bardana-stock", label: "Stock Summary", icon: "layout-dashboard", to: "/bardana" },
      { id: "bardana-issues", label: "Issue Bardana", icon: "arrow-up-right", to: "/bardana/issues" },
      { id: "bardana-receipts", label: "Return Bardana", icon: "arrow-down-left", to: "/bardana/receipts" },
      { id: "bardana-outstanding", label: "Outstanding", icon: "users", to: "/bardana/outstanding" },
      { id: "bardana-types", label: "Bardana Types", icon: "settings", to: "/bardana/types" },
    ],
  },
  { id: "loans", label: "Loans", icon: "banknote", to: "/loans" },
  { id: "payroll", label: "Payroll", icon: "users", to: "/payroll" },
];

// SYSTEM section - Configuration and administration
export const systemNavItems: NavItem[] = [
  { id: "masters", label: "Masters", icon: "database", to: "/masters" },
  { id: "reports", label: "Reports", icon: "bar-chart-3", to: "/reports" },
  { id: "settings", label: "Settings", icon: "settings", to: "/settings" },
  { id: "help", label: "Help", icon: "help-circle", to: "/help" },
];

// Legacy exports for backwards compatibility
export const navigationItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard", to: "/dashboard" },
  {
    id: "parties",
    label: "Parties",
    icon: "users",
    children: [
      { id: "all-parties", label: "All Parties", icon: "list" },
      { id: "kissan", label: "Kissan", icon: "sprout" },
      { id: "vyapari", label: "Vyapari", icon: "store" },
      { id: "aarti", label: "Aarti", icon: "briefcase" },
    ],
  },
  {
    id: "stock",
    label: "Stock",
    icon: "warehouse",
    children: [
      { id: "amad", label: "Amad", icon: "truck" },
      { id: "nikasi", label: "Nikasi", icon: "package-open" },
      { id: "current-stock", label: "Current Stock", icon: "boxes" },
      { id: "lots", label: "Lots", icon: "layers" },
    ],
  },
  {
    id: "accounts",
    label: "Accounts",
    icon: "indian-rupee",
    badge: 3,
    children: [
      { id: "vouchers", label: "Vouchers", icon: "receipt" },
      { id: "ledger", label: "Ledger", icon: "book-open" },
      { id: "daybook", label: "Day Book", icon: "calendar" },
      { id: "bardana", label: "Bardana", icon: "package" },
    ],
  },
  {
    id: "trading",
    label: "Trading",
    icon: "handshake",
    children: [
      { id: "sauda", label: "Sauda", icon: "file-text" },
      { id: "chitti", label: "Chitti", icon: "ticket" },
      { id: "nikasi-bill", label: "Nikasi Bill", icon: "file-invoice" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: "bar-chart-3",
    children: [
      { id: "stock-report", label: "Stock Report", icon: "clipboard-list" },
      { id: "financial-report", label: "Financial Report", icon: "trending-up" },
      { id: "party-report", label: "Party Report", icon: "user-check" },
    ],
  },
];

export const settingsNavItem: NavItem = {
  id: "settings",
  label: "Settings",
  icon: "settings",
  to: "/settings",
};

export const mobileNavItems: NavItem[] = [
  { id: "dashboard", label: "Home", icon: "home" },
  { id: "parties", label: "Parties", icon: "users" },
  { id: "stock", label: "Stock", icon: "warehouse" },
  { id: "accounts", label: "Accounts", icon: "indian-rupee" },
  { id: "more", label: "More", icon: "menu" },
];
