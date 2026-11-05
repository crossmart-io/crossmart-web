import { ApiRequestError } from './api-error';
import { unwrap } from './unwrap';

function response(status: number): Response {
  return new Response(null, { status });
}

describe('unwrap', () => {
  it('resolves to the success body', async () => {
    const request = Promise.resolve({ data: { id: 'p1' }, response: response(200) });

    await expect(unwrap(request)).resolves.toEqual({ id: 'p1' });
  });

  it('throws the error body as an ApiRequestError with its message and status', async () => {
    const error = { statusCode: 422, message: ['title is too long', 'price is invalid'] };
    const request = Promise.resolve({ error, response: response(422) });

    const thrown = await unwrap(request).catch((reason: unknown) => reason);

    expect(thrown).toBeInstanceOf(ApiRequestError);
    expect(thrown).toMatchObject({
      message: 'title is too long. price is invalid',
      statusCode: 422,
    });
  });

  it('throws when an error response has no body', async () => {
    const request = Promise.resolve({ error: undefined, response: response(404) });

    await expect(unwrap(request)).rejects.toMatchObject({ statusCode: 404 });
  });
});
