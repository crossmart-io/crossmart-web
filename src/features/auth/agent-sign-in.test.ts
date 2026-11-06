import { isAgentAuthorization } from './agent-sign-in';

describe('isAgentAuthorization', () => {
  it('is true only on a query Better Auth signed', () => {
    expect(isAgentAuthorization('?client_id=abc&scope=catalog%3Aread&sig=xyz')).toBe(true);
    expect(isAgentAuthorization('?scope=catalog%3Aread')).toBe(false);
    expect(isAgentAuthorization('')).toBe(false);
  });
});
