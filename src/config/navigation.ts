import type { NavItem } from "@/types/navigation";

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
