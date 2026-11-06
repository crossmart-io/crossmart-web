import {
  Bot,
  FileUp,
  Gauge,
  History,
  Inbox,
  KeyRound,
  CircleUser,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Share2,
  ShieldCheck,
  Store,
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
  /** A count shown on the item, such as listings that need attention. */
  badge?: NavBadge;
}

/** Counts the sidebar can show on an item; `AppSidebar` maps each to its component. */
export enum NavBadge {
  ChannelErrors = 'channel_errors',
  PendingSuggestions = 'pending_suggestions',
}

interface NavGroup {
  label: string;
  items: readonly NavItem[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: 'Catalog',
    items: [
      { label: 'Overview', to: ROUTES.home, icon: LayoutDashboard, end: true },
      { label: 'Products', to: ROUTES.products, icon: Package },
      { label: 'Orders', to: ROUTES.orders, icon: ShoppingBag },
      { label: 'Inventory', to: ROUTES.inventory, icon: Warehouse },
      { label: 'Imports', to: ROUTES.imports, icon: FileUp },
      { label: 'Channels', to: ROUTES.channels, icon: Share2, badge: NavBadge.ChannelErrors },
      {
        label: 'Suggestions',
        to: ROUTES.suggestions,
        icon: Inbox,
        badge: NavBadge.PendingSuggestions,
      },
      { label: 'Activity', to: ROUTES.activity, icon: History },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Workspace', to: ROUTES.workspaceSettings, icon: Store },
      { label: 'Plan & usage', to: ROUTES.plan, icon: Gauge },
      { label: 'Members', to: ROUTES.members, icon: Users },
      { label: 'Roles', to: ROUTES.roles, icon: ShieldCheck },
      { label: 'API keys', to: ROUTES.apiKeys, icon: KeyRound },
      { label: 'Connected agents', to: ROUTES.agentConnections, icon: Bot },
      { label: 'Account', to: ROUTES.account, icon: CircleUser },
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
  orders: [{ label: 'Orders', to: ROUTES.orders }],
} as const satisfies Record<string, readonly Crumb[]>;
