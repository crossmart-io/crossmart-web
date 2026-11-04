import type { PropsWithChildren, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AuthCardProps extends PropsWithChildren {
  title: string;
  description: string;
  footer: ReactNode;
}

export function AuthCard({ title, description, footer, children }: AuthCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          <h1>{title}</h1>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">{footer}</CardFooter>
    </Card>
  );
}
