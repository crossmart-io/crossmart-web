import {
  FileUp,
  History,
  KeyRound,
  LayoutDashboard,
  Package,
  Share2,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Match only this exact path (the overview), not its children. */
  end?: boolean;
}

export interface NavGroup {
  label: string;
  items: readonly NavItem[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: 'Catalog',
    items: [
      { label: 'Overview', to: ROUTES.home, icon: LayoutDashboard, end: true },
      { label: 'Products', to: ROUTES.products, icon: Package },
      { label: 'Inventory', to: ROUTES.inventory, icon: Warehouse },
      { label: 'Imports', to: ROUTES.imports, icon: FileUp },
      { label: 'Channels', to: ROUTES.channels, icon: Share2 },
      { label: 'Activity', to: ROUTES.activity, icon: History },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Members', to: ROUTES.members, icon: Users },
      { label: 'API keys', to: ROUTES.apiKeys, icon: KeyRound },
    ],
  },
];

export interface Crumb {
  label: string;
  /** Omit for a group without its own page. */
  to?: string;
}

/** The pages above each page, for its breadcrumbs. Module constants keep them stable across renders. */
export const PAGE_PARENTS = {
  topLevel: [],
  products: [{ label: 'Products', to: ROUTES.products }],
  settings: [{ label: 'Settings' }],
  imports: [{ label: 'Imports', to: ROUTES.imports }],
  channels: [{ label: 'Channels', to: ROUTES.channels }],
} as const satisfies Record<string, readonly Crumb[]>;
