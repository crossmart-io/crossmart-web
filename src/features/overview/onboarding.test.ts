import { ChannelSetup } from '@/features/channels';
import { isOnboardingComplete, onboardingSteps, type OnboardingState } from './onboarding';

const DONE: OnboardingState = {
  hasProducts: true,
  hasApiKey: true,
  channelSetup: ChannelSetup.Imported,
};

describe('onboardingSteps', () => {
  it('names every connectable channel, not only Shopify', () => {
    const steps = onboardingSteps({ ...DONE, channelSetup: ChannelSetup.NotConnected });
    expect(steps[1]?.description).toBe(
      'Connect Shopify, eBay or Google Merchant Center to sync products and stock.',
    );
  });

  it('asks a connected store to import its products', () => {
    const steps = onboardingSteps({ ...DONE, channelSetup: ChannelSetup.Connected });
    expect(steps[1]).toMatchObject({ title: 'Import products from your store', done: false });
  });
});

describe('isOnboardingComplete', () => {
  it('is complete only when every step is done', () => {
    expect(isOnboardingComplete(DONE)).toBe(true);
    expect(isOnboardingComplete({ ...DONE, hasApiKey: false })).toBe(false);
    expect(isOnboardingComplete({ ...DONE, channelSetup: ChannelSetup.Connected })).toBe(false);
  });
});
