import { ROUTES } from '@/config/routes';
import { ChannelSetup } from '@/features/channels';
import { CONNECT_CHANNEL_PROMPT } from './overview.constants';

export interface OnboardingStep {
  title: string;
  description: string;
  to: string;
  done: boolean;
}

/** What a new seller has done so far. `channelSetup` is undefined until it is known. */
export interface OnboardingState {
  hasProducts: boolean;
  hasApiKey: boolean;
  channelSetup: ChannelSetup | undefined;
}

/** A connected store whose products were never imported gets its own nudge. */
function channelStep(setup: ChannelSetup | undefined): OnboardingStep {
  if (setup === ChannelSetup.Connected) {
    return {
      title: 'Import products from your store',
      description: 'Your store is connected. Import its products to link them to your catalog.',
      to: ROUTES.channels,
      done: false,
    };
  }
  return {
    title: 'Connect a channel',
    description: `${CONNECT_CHANNEL_PROMPT}.`,
    to: ROUTES.channels,
    done: setup === ChannelSetup.Imported,
  };
}

/** The first things a new seller does. Each step reflects what is really done. */
export function onboardingSteps({
  hasProducts,
  hasApiKey,
  channelSetup,
}: OnboardingState): OnboardingStep[] {
  return [
    {
      title: 'Add your products',
      description: 'Import a Shopify export or add a product by hand.',
      to: ROUTES.products,
      done: hasProducts,
    },
    channelStep(channelSetup),
    {
      title: 'Give your AI agent a key',
      description: 'Let Claude or your own agent work with your catalog.',
      to: ROUTES.apiKeys,
      done: hasApiKey,
    },
  ];
}

export function isOnboardingComplete(state: OnboardingState): boolean {
  return onboardingSteps(state).every((step) => step.done);
}
