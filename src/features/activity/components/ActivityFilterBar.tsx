import { useId } from 'react';
import { ActivityAction } from '@/api/schema';
import { SortSelect } from '@/components/lists/SortSelect';
import { TIME_SORTS } from '@/components/lists/sort-options';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { parseEnum } from '@/lib/enum';
import { ALL_ACTIONS } from '../activity.constants';
import { ACTIVITY_ACTION_LABELS } from '../activity-action';
import type { ActivityFilters } from '../hooks/useActivityFilters';

/** Filter by action, or show only what failed. Both live in the URL. */
export function ActivityFilterBar({ filters }: { filters: ActivityFilters }) {
  const failuresId = useId();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Select
        value={filters.action ?? ALL_ACTIONS}
        onValueChange={(value) => filters.setAction(parseEnum(ActivityAction, value))}
      >
        <SelectTrigger className="w-full sm:w-56" aria-label="Filter by action">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_ACTIONS}>All actions</SelectItem>
          {Object.values(ActivityAction).map((action) => (
            <SelectItem key={action} value={action}>
              {ACTIVITY_ACTION_LABELS[action]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id={failuresId}
            checked={filters.failuresOnly}
            onCheckedChange={filters.setFailuresOnly}
          />
          <Label htmlFor={failuresId}>Failures only</Label>
        </div>
        <SortSelect options={TIME_SORTS} value={filters.sort.value} onChange={filters.setSort} />
      </div>
    </div>
  );
}
