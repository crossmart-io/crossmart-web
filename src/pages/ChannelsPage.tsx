import { PageHeader } from '@/components/layout/PageHeader';
import { ChannelCard, CHANNELS } from '@/features/channels';

export function ChannelsPage() {
  return (
    <>
      <PageHeader
        title="Channels"
        description="Connect the marketplaces and stores you sell on. Each one gets listings written for it."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHANNELS.map((channel) => (
          <ChannelCard key={channel.name} channel={channel} />
        ))}
      </div>
    </>
  );
}
