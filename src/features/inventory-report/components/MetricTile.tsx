import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function MetricTile({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
          {value}
        </p>
        <div className="text-xs text-muted-foreground">{detail}</div>
      </CardContent>
    </Card>
  );
}
