import { useSearchParams } from 'react-router';
import type { SalesRange } from '@/api/schema';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { setOrDeleteParam } from '@/lib/search-params';
import {
  DEFAULT_SALES_RANGE,
  DEFAULT_SALES_RANGE_OPTION,
  SALES_RANGE_OPTIONS,
  SALES_RANGE_QUERY,
  type SalesRangeOption,
} from '../sales.constants';

function toRangeOption(value: string | null): SalesRangeOption {
  return SALES_RANGE_OPTIONS.find((option) => option.value === value) ?? DEFAULT_SALES_RANGE_OPTION;
}

/** The overview's period, from the URL; the default range keeps the URL clean. */
export function useSalesRange(): [SalesRangeOption, (range: SalesRange) => void] {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const setRange = (range: SalesRange) =>
    updateParams((params) =>
      setOrDeleteParam(params, SALES_RANGE_QUERY, range === DEFAULT_SALES_RANGE ? '' : range),
    );
  return [toRangeOption(searchParams.get(SALES_RANGE_QUERY)), setRange];
}
