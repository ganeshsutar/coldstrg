export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  to?: string;
  children?: NavItem[];
  badge?: number;
}

export interface QuickCreateItem {
  id: string;
  label: string;
  shortcut?: string;
  separator?: boolean;
}
