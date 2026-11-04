import { Page } from '@/components/layout/Page';
import { ChannelCard, CHANNELS } from '@/features/channels';

export function ChannelsPage() {
  return (
    <Page
      name="Channels"
      description="Connect the marketplaces and stores you sell on. Each one gets listings written for it."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHANNELS.map((channel) => (
          <ChannelCard key={channel.name} channel={channel} />
        ))}
      </div>
    </Page>
  );
}
