import { ApiRequestError, HttpStatus, OFFLINE_ERROR_MESSAGE } from '@/api/api-error';
import { toAskFailure } from './ask-failure';
import { ASK_RATE_LIMITED_DETAIL } from './ask.constants';
import { AskFailure } from './ask.types';
import { isWebUrl } from './citation-url';

describe('toAskFailure', () => {
  it('calls a 429 rate limited, with a wait-and-retry message', () => {
    expect(toAskFailure(new ApiRequestError('Too many', HttpStatus.TooManyRequests))).toEqual({
      failure: AskFailure.RateLimited,
      message: ASK_RATE_LIMITED_DETAIL,
    });
  });

  it('keeps the API’s reason for a 503', () => {
    const reason = 'Ask Crossmart is turned off on this server.';
    expect(toAskFailure(new ApiRequestError(reason, HttpStatus.ServiceUnavailable))).toEqual({
      failure: AskFailure.Unavailable,
      message: reason,
    });
  });

  it('tells a network failure apart from an API error', () => {
    expect(toAskFailure(new TypeError('Failed to fetch'))).toEqual({
      failure: AskFailure.Offline,
      message: OFFLINE_ERROR_MESSAGE,
    });
    expect(toAskFailure(new ApiRequestError('Boom', 500)).failure).toBe(AskFailure.Failed);
  });
});

describe('isWebUrl', () => {
  it('accepts http(s) pages only', () => {
    expect(isWebUrl('https://docs.crossmart.io/channels/shopify/')).toBe(true);
    expect(isWebUrl('javascript:alert(1)')).toBe(false);
    expect(isWebUrl('not a url')).toBe(false);
  });
});
