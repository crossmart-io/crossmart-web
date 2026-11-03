import { CircleCheck, Circle } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from 'cn';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/config/routes';
import { ChannelSetup } from '@/features/channels';

const PERCENT = 100;

interface Step {
  title: string;
  description: string;
  to: string;
  done: boolean;
}

interface GettingStartedProps {
  hasProducts: boolean;
  hasApiKey: boolean;
  channelSetup: ChannelSetup | undefined;
}

/** A connected store whose products were never imported gets its own nudge. */
function channelStep(setup: ChannelSetup | undefined): Step {
  if (setup === ChannelSetup.Connected) {
    return {
      title: 'Import products from your store',
      description: 'Your store is connected. Import its products to link them to your catalog.',
      to: ROUTES.channels,
      done: false,
    };
  }
  return {
    title: 'Connect a channel',
    description: 'Connect your Shopify store to sync products and stock.',
    to: ROUTES.channels,
    done: setup === ChannelSetup.Imported,
  };
}

function toSteps({ hasProducts, hasApiKey, channelSetup }: GettingStartedProps): Step[] {
  return [
    {
      title: 'Add your products',
      description: 'Import a Shopify export or add a product by hand.',
      to: ROUTES.products,
      done: hasProducts,
    },
    channelStep(channelSetup),
    {
      title: 'Give your AI agent a key',
      description: 'Let Claude or your own agent work with your catalog.',
      to: ROUTES.apiKeys,
      done: hasApiKey,
    },
  ];
}

/** The first things a new seller does. Each step reflects what is really done. */
export function GettingStarted(props: GettingStartedProps) {
  const steps = toSteps(props);
  const doneCount = steps.filter((step) => step.done).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Getting started</CardTitle>
        <CardDescription>
          {doneCount} of {steps.length} done
        </CardDescription>
        <Progress
          value={(doneCount / steps.length) * PERCENT}
          className="mt-2 h-1.5"
          aria-label="Getting started progress"
        />
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col divide-y">
          {steps.map((step) => (
            <StepItem key={step.title} step={step} />
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function StepItem({ step }: { step: Step }) {
  const Icon = step.done ? CircleCheck : Circle;
  return (
    <li>
      <Link
        to={step.to}
        className="-mx-2 flex items-start gap-3 rounded-md px-2 py-3 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Icon
          className={cn(
            'mt-0.5 size-5 shrink-0',
            step.done ? 'text-success' : 'text-muted-foreground',
          )}
          aria-hidden="true"
        />
        <span className="flex flex-1 flex-col">
          <span className={cn('font-medium', step.done && 'text-muted-foreground')}>
            <span className="sr-only">{step.done ? 'Done: ' : 'To do: '}</span>
            {step.title}
          </span>
          <span className="text-sm text-muted-foreground">{step.description}</span>
        </span>
      </Link>
    </li>
  );
}
