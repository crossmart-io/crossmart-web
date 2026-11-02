import { KeyRound, LayoutDashboard, Package, Share2, Users, type LucideIcon } from 'lucide-react';
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
      { label: 'Channels', to: ROUTES.channels, icon: Share2 },
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
} as const satisfies Record<string, readonly Crumb[]>;
