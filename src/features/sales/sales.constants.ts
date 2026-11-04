import { SalesInterval, SalesRange } from '@/api/schema';

export const SALES_REPORT_ENDPOINT = '/api/v1/workspaces/{workspaceId}/analytics/sales';

/** The overview's period, kept in the URL so a view can be shared. */
export const SALES_RANGE_QUERY = 'range';
export const DEFAULT_SALES_RANGE = SalesRange.last_30_days;

export interface SalesRangeOption {
  value: SalesRange;
  /** Short label on the picker. */
  label: string;
  /** What the period is, for screen readers and comparisons. */
  description: string;
}

export const DEFAULT_SALES_RANGE_OPTION: SalesRangeOption = {
  value: DEFAULT_SALES_RANGE,
  label: '30D',
  description: 'last 30 days',
};

export const SALES_RANGE_OPTIONS: readonly SalesRangeOption[] = [
  { value: SalesRange.last_7_days, label: '7D', description: 'last 7 days' },
  DEFAULT_SALES_RANGE_OPTION,
  { value: SalesRange.last_90_days, label: '3M', description: 'last 3 months' },
  { value: SalesRange.last_12_months, label: '12M', description: 'last 12 months' },
];

/** How a bucket's first day is written on the axis, per bucket size. */
export const BUCKET_LABEL_FORMATS: Record<SalesInterval, Intl.DateTimeFormatOptions> = {
  [SalesInterval.day]: { month: 'short', day: 'numeric' },
  [SalesInterval.week]: { month: 'short', day: 'numeric' },
  [SalesInterval.month]: { month: 'short', year: 'numeric' },
};

/** How a bucket is named in the tooltip, per bucket size. */
export const BUCKET_TOOLTIP_PREFIX: Record<SalesInterval, string> = {
  [SalesInterval.day]: '',
  [SalesInterval.week]: 'Week of ',
  [SalesInterval.month]: '',
};

export const PERCENT = 100;
/** Changes smaller than this read as flat. */
export const FLAT_CHANGE_PERCENT = 0.5;

/** Sales chart geometry: thin 2px lines, a dashed comparison, a light area under this period. */
export const SALES_CHART = {
  lineWidth: 2,
  comparisonDash: '4 4',
  areaOpacity: 0.12,
  yAxisWidth: 64,
  xTickGap: 24,
} as const;
