import { AskConfidence } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { ASK_CONFIDENCE_LABELS } from '../ask-insights.constants';

const BADGE_VARIANTS = {
  [AskConfidence.high]: 'outline',
  [AskConfidence.medium]: 'secondary',
  [AskConfidence.low]: 'warning',
} as const satisfies Record<AskConfidence, 'outline' | 'secondary' | 'warning'>;

export function AskConfidenceBadge({ confidence }: { confidence: AskConfidence }) {
  return <Badge variant={BADGE_VARIANTS[confidence]}>{ASK_CONFIDENCE_LABELS[confidence]}</Badge>;
}
