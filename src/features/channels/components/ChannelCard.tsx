import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { EXTERNAL_LINKS } from '@/config/links';
import { CHANNEL_STATUS_LABELS, ChannelStatus, type ChannelInfo } from '../channels.constants';
import { ChannelCardHeader } from './ChannelCardHeader';

/** A channel on the roadmap, not connectable yet. */
export function ChannelCard({ channel }: { channel: ChannelInfo }) {
  const inDevelopment = channel.status === ChannelStatus.InDevelopment;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <ChannelCardHeader
          channel={channel}
          badge={
            <Badge variant={inDevelopment ? 'default' : 'outline'}>
              {CHANNEL_STATUS_LABELS[channel.status]}
            </Badge>
          }
        />
      </CardContent>
      <CardFooter className="mt-auto">
        <Button variant="ghost" size="sm" className="-ml-2" asChild>
          <a href={EXTERNAL_LINKS.issues} target="_blank" rel="noreferrer">
            {inDevelopment ? 'Follow on GitHub' : 'Request on GitHub'}
            <ArrowUpRight data-icon="inline-end" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
