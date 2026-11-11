import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { tabsListVariants } from '@/components/ui/tabs';
import { isPathWithin } from '@/lib/path-match';
import { cn } from '@/lib/utils';

export interface RouteTab {
  label: string;
  to: string;
  /** Match only this path, not the pages under it. */
  exact?: boolean;
  /** A count or marker after the label, such as items waiting for review. */
  badge?: ReactNode;
}

interface RouteTabsProps {
  tabs: readonly RouteTab[];
  /** Names the navigation for screen readers ("Settings sections"). */
  label: string;
  className?: string;
}

const TAB_CLASSES = cn(
  'inline-flex h-full items-center justify-center gap-1.5 rounded-md border border-transparent px-3 text-sm font-medium whitespace-nowrap text-foreground/60 transition-colors',
  'hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
  'aria-[current=page]:bg-background aria-[current=page]:text-foreground aria-[current=page]:shadow-sm',
  'dark:text-muted-foreground dark:hover:text-foreground dark:aria-[current=page]:border-input dark:aria-[current=page]:bg-input/30 dark:aria-[current=page]:text-foreground',
);

/** The views of a page as tabs that are links, so each view has its own address. */
export function RouteTabs({ tabs, label, className }: RouteTabsProps) {
  const { pathname } = useLocation();
  // The most specific tab wins: `/settings/team/roles` is Team, not a parent tab too.
  const active = tabs
    .filter((tab) => isPathWithin(pathname, tab.to, tab.exact))
    .sort((left, right) => right.to.length - left.to.length)[0];

  return (
    <nav aria-label={label} className={cn('max-w-full overflow-x-auto', className)}>
      <div className={cn(tabsListVariants(), 'h-9')}>
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            aria-current={tab === active ? 'page' : undefined}
            className={TAB_CLASSES}
          >
            {tab.label}
            {tab.badge}
          </Link>
        ))}
      </div>
    </nav>
  );
}
