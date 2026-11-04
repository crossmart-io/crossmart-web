import type { components } from '@/api/schema';

export type ChannelConnection = components['schemas']['ChannelConnectionDto'];
export type StartedAuthorization = components['schemas']['StartedAuthorizationDto'];
export type AuthorizationRequest = components['schemas']['StartAuthorizationDto'];
/** The query parameters the API's OAuth callback sends the merchant back with. */
export type ConnectRedirect = components['schemas']['ChannelConnectRedirectDto'];
