import {
  CircleUser,
  House,
  MessageCircleQuestionMark,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Match only this exact path (Home), not the pages under it. */
  end?: boolean;
  /** Other sections that belong to this item, so it stays highlighted there (Imports → Products). */
  also?: readonly string[];
  /** A count shown on the item, such as listings that need attention. */
  badge?: NavBadge;
}

/** Counts the sidebar can show on an item; `AppSidebar` maps each to its component. */
export enum NavBadge {
  ChannelErrors = 'channel_errors',
  PendingReview = 'pending_review',
}

/** The whole sidebar: what a seller does every day. Everything else lives inside these pages. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', to: ROUTES.home, icon: House, end: true, also: [ROUTES.activity] },
  { label: 'Products', to: ROUTES.products, icon: Package, also: [ROUTES.imports] },
  { label: 'Orders', to: ROUTES.orders, icon: ShoppingBag },
  { label: 'Stores', to: ROUTES.stores, icon: Store, badge: NavBadge.ChannelErrors },
  { label: 'Agent', to: ROUTES.agent, icon: Sparkles, badge: NavBadge.PendingReview },
  { label: 'Settings', to: ROUTES.settings, icon: Settings },
];

/** Pages about the signed-in person rather than the workspace, in the user menu. */
export interface UserMenuLink {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Shown only to the people who run this Crossmart instance (`me.platformAdmin`). */
  platformAdminOnly?: boolean;
}

export const USER_MENU_LINKS: readonly UserMenuLink[] = [
  { label: 'Account', to: ROUTES.account, icon: CircleUser },
  {
    label: 'Ask insights',
    to: ROUTES.askInsights,
    icon: MessageCircleQuestionMark,
    platformAdminOnly: true,
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
  billing: [{ label: 'Settings' }, { label: 'Billing', to: ROUTES.billing }],
  developers: [{ label: 'Settings' }, { label: 'Developers', to: ROUTES.developers }],
  imports: [
    { label: 'Products', to: ROUTES.products },
    { label: 'Imports', to: ROUTES.imports },
  ],
  stores: [{ label: 'Stores', to: ROUTES.stores }],
  orders: [{ label: 'Orders', to: ROUTES.orders }],
  agent: [{ label: 'Agent', to: ROUTES.agent }],
  platform: [{ label: 'Platform' }],
  askInsights: [{ label: 'Platform' }, { label: 'Ask insights', to: ROUTES.askInsights }],
} as const satisfies Record<string, readonly Crumb[]>;
