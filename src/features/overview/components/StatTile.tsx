import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';

interface StatTileProps {
  label: string;
  value: number | undefined;
  detail: string;
  icon: LucideIcon;
  to: string;
}

export function StatTile({ label, value, detail, icon: Icon, to }: StatTileProps) {
  return (
    <Link
      to={to}
      className="rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <Card className="h-full transition-colors hover:bg-muted/40">
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {label}
            <Icon className="size-4" aria-hidden="true" />
          </div>
          <p className="font-heading text-3xl font-semibold tabular-nums tracking-tight">
            {value === undefined ? '–' : value.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">{detail}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
