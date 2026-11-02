import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CHANNEL_STATUS_LABELS, ChannelStatus, type ChannelInfo } from '../channels.constants';

export function ChannelCard({ channel }: { channel: ChannelInfo }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span
            className="grid size-10 place-items-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: channel.color }}
            aria-hidden="true"
          >
            {channel.name.charAt(0)}
          </span>
          <Badge variant={channel.status === ChannelStatus.InDevelopment ? 'secondary' : 'outline'}>
            {CHANNEL_STATUS_LABELS[channel.status]}
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-medium">{channel.name}</h2>
          <p className="text-sm text-muted-foreground">{channel.description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" disabled>
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
}
