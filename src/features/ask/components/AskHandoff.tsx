import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ASK_COPY } from '../ask.constants';

interface AskHandoffProps {
  supportEmail: string;
}

/** A way to a person when the docs do not answer the question. */
export function AskHandoff({ supportEmail }: AskHandoffProps) {
  return (
    <Button asChild variant="outline" size="sm" className="self-start">
      <a href={`mailto:${supportEmail}`}>
        <Mail data-icon="inline-start" />
        {ASK_COPY.handoff}
        <span className="text-muted-foreground">{supportEmail}</span>
      </a>
    </Button>
  );
}
