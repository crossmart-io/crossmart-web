import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { EXTERNAL_LINKS } from '@/config/links';
import {
  CHANNEL_ROADMAP_ACTION_LABELS,
  CHANNEL_STATUS_LABELS,
  ChannelStatus,
  type RoadmapChannelInfo,
} from '../channels.constants';
import { ChannelCardHeader } from './ChannelCardHeader';

/** A channel on the roadmap, not connectable yet. */
export function ChannelCard({ channel }: { channel: RoadmapChannelInfo }) {
  const comingSoon = channel.status === ChannelStatus.ComingSoon;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <ChannelCardHeader
          channel={channel}
          badge={
            <Badge variant={comingSoon ? 'default' : 'outline'}>
              {CHANNEL_STATUS_LABELS[channel.status]}
            </Badge>
          }
        />
      </CardContent>
      <CardFooter className="mt-auto">
        <Button variant="ghost" size="sm" className="-ml-2" asChild>
          <a href={EXTERNAL_LINKS.issues} target="_blank" rel="noreferrer">
            {CHANNEL_ROADMAP_ACTION_LABELS[channel.status]}
            <ArrowUpRight data-icon="inline-end" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
