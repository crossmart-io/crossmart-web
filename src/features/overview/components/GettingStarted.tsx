import { CircleCheck, Circle } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from 'cn';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';

interface Step {
  title: string;
  description: string;
  to: string;
  done: boolean;
}

interface GettingStartedProps {
  hasProducts: boolean;
}

/** The first things a new seller does. Each step reflects what is really done. */
export function GettingStarted({ hasProducts }: GettingStartedProps) {
  const steps: Step[] = [
    {
      title: 'Add your products',
      description: 'Import a Shopify export or add a product by hand.',
      to: ROUTES.products,
      done: hasProducts,
    },
    {
      title: 'Connect a channel',
      description: 'Shopify and eBay connections are in development.',
      to: ROUTES.channels,
      done: false,
    },
    {
      title: 'Give your AI agent a key',
      description: 'Let Claude or your own agent work with your catalog.',
      to: ROUTES.apiKeys,
      done: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Getting started</CardTitle>
        <CardDescription>
          {steps.filter((step) => step.done).length} of {steps.length} done
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col divide-y">
          {steps.map((step) => (
            <li key={step.title}>
              <Link to={step.to} className="flex items-start gap-3 py-3 hover:opacity-80">
                {step.done ? (
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-label="Done" />
                ) : (
                  <Circle
                    className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                    aria-label="To do"
                  />
                )}
                <span className="flex flex-col">
                  <span
                    className={cn('font-medium', step.done && 'text-muted-foreground line-through')}
                  >
                    {step.title}
                  </span>
                  <span className="text-sm text-muted-foreground">{step.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
