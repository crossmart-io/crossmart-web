import type { PropsWithChildren, ReactNode } from 'react';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EditorCardProps extends PropsWithChildren {
  title: string;
  action?: ReactNode;
  /** Lets a link scroll straight to this card (`#id`). */
  id?: string;
}

export function EditorCard({ title, action, id, children }: EditorCardProps) {
  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>
          <h2 className="text-sm font-semibold">{title}</h2>
        </CardTitle>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}
