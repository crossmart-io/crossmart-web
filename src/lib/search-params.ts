/** Sets a query parameter, or removes it when the value is empty, so URLs stay short. */
export function setOrDeleteParam(params: URLSearchParams, key: string, value: string): void {
  if (value) params.set(key, value);
  else params.delete(key);
}
