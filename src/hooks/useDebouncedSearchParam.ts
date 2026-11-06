import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { setOrDeleteParam } from '@/lib/search-params';
import { useDebouncedValue } from './useDebouncedValue';
import { useSearchParamsUpdater } from './useSearchParamsUpdater';

interface DebouncedSearchParam {
  /** What is in the search box right now. */
  value: string;
  setValue: (value: string) => void;
  /** The trimmed value once typing pauses: what the list is filtered by, and what the URL holds. */
  debouncedValue: string;
}

/** A search box backed by a query parameter. Typing settles into the URL after `delayMs`. */
export function useDebouncedSearchParam(key: string, delayMs: number): DebouncedSearchParam {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const urlValue = searchParams.get(key) ?? '';
  const [value, setValue] = useState(urlValue);
  const debouncedValue = useDebouncedValue(value.trim(), delayMs);

  // Write only once typing has settled. Otherwise clearing the box would put the old
  // debounced value back into the URL until the debounce caught up.
  const isSettled = debouncedValue === value.trim();
  useEffect(() => {
    if (isSettled && debouncedValue !== urlValue) {
      updateParams((params) => setOrDeleteParam(params, key, debouncedValue));
    }
  }, [isSettled, debouncedValue, urlValue, key, updateParams]);

  return { value, setValue, debouncedValue };
}
