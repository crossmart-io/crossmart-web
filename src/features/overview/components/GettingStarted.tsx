import { CircleCheck, Circle } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type OnboardingState, type OnboardingStep, onboardingSteps } from '../onboarding';

const PERCENT = 100;

/** The first things a new seller does. Each step reflects what is really done. */
export function GettingStarted(props: OnboardingState) {
  const steps = onboardingSteps(props);
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

function StepItem({ step }: { step: OnboardingStep }) {
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
