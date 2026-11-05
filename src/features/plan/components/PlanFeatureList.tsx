import { Check, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FEATURE_LABELS } from '../plan.constants';
import type { FeatureUsage } from '../plan.types';
import { flagFeatures } from '../usage';

/** The plan's on-or-off features, said in words as well as with an icon. */
export function PlanFeatureList({ features }: { features: readonly FeatureUsage[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Features</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {flagFeatures(features).map(({ feature, enabled }) => {
            const Icon = enabled ? Check : Minus;
            return (
              <li key={feature} className="flex items-start gap-3">
                <Icon
                  aria-hidden="true"
                  className={
                    enabled ? 'mt-0.5 size-4 text-success' : 'mt-0.5 size-4 text-muted-foreground'
                  }
                />
                <div className="flex flex-col">
                  <span className="font-medium">{FEATURE_LABELS[feature].label}</span>
                  <span className="text-xs text-muted-foreground">
                    {enabled ? 'Included' : 'Not included'} · {FEATURE_LABELS[feature].description}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
