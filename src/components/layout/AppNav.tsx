import { NavLink } from 'react-router';
import { cn } from 'cn';
import { ROUTES } from '@/config/routes';

const NAV_ITEMS = [
  { to: ROUTES.home, label: 'Overview', end: true },
  { to: ROUTES.products, label: 'Products', end: false },
] as const;

export function AppNav() {
  return (
    <nav aria-label="Main" className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
              isActive && 'bg-muted text-foreground',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
