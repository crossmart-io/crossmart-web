import { ExternalLink, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { EXTERNAL_LINKS } from '@/config/links';
import { WEBHOOK_COPY } from '../webhooks.constants';
import { CreateWebhookEndpointButton } from './CreateWebhookEndpointButton';

/** What webhooks are, with a way to add the first endpoint and the developer guide. */
export function WebhooksEmptyState({ workspaceId }: { workspaceId: string }) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Webhook />
        </EmptyMedia>
        <EmptyTitle>{WEBHOOK_COPY.emptyTitle}</EmptyTitle>
        <EmptyDescription>{WEBHOOK_COPY.emptyDescription}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row flex-wrap justify-center">
        <CreateWebhookEndpointButton workspaceId={workspaceId} />
        <Button asChild variant="outline">
          <a href={EXTERNAL_LINKS.webhooksGuide} target="_blank" rel="noreferrer">
            {WEBHOOK_COPY.readGuide}
            <ExternalLink data-icon="inline-end" />
          </a>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
