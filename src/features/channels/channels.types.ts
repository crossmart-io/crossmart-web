import type { components } from '@/api/schema';

export type ChannelConnection = components['schemas']['ChannelConnectionDto'];
export type StartedAuthorization = components['schemas']['StartedAuthorizationDto'];
export type AuthorizationRequest = components['schemas']['StartAuthorizationDto'];
/** The query parameters the API's OAuth callback sends the merchant back with. */
export type ConnectRedirect = components['schemas']['ChannelConnectRedirectDto'];
export type EbaySettings = components['schemas']['EbaySettingsDto'];
export type EbayListingDefaults = components['schemas']['EbayListingDefaultsDto'];
export type EbayListingDefaultsBody = components['schemas']['UpdateEbayListingDefaultsDto'];
export type EbayPolicy = components['schemas']['EbayPolicyDto'];
