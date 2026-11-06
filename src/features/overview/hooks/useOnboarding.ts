import { useApiKeys } from '@/features/api-keys';
import { useCatalogStats } from '@/features/catalog';
import { useChannelSetup } from '@/features/channels';
import { isOnboardingComplete, type OnboardingState } from '../onboarding';

interface Onboarding {
  state: OnboardingState;
  /** Undefined until everything it depends on has loaded. */
  isComplete: boolean | undefined;
}

/** How far the seller is with getting started, from the catalog, keys and stores. */
export function useOnboarding(workspaceId: string): Onboarding {
  const { data: stats } = useCatalogStats(workspaceId);
  const { data: apiKeys } = useApiKeys(workspaceId);
  const channelSetup = useChannelSetup(workspaceId);
  const state: OnboardingState = {
    hasProducts: (stats?.products ?? 0) > 0,
    hasApiKey: (apiKeys?.length ?? 0) > 0,
    channelSetup,
  };
  const isLoaded = stats !== undefined && apiKeys !== undefined && channelSetup !== undefined;
  return { state, isComplete: isLoaded ? isOnboardingComplete(state) : undefined };
}
