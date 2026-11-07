import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { parseEnum } from '@/lib/enum';
import { CHANNEL_MAP_COPY, CHANNEL_MAP_VIEWS, ChannelMapView } from '../channel-map.constants';

interface MapViewToggleProps {
  value: ChannelMapView;
  onChange: (view: ChannelMapView) => void;
}

/** Map or list: the list shows the same stores, for screen readers and for reading row by row. */
export function MapViewToggle({ value, onChange }: MapViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      spacing={0}
      value={value}
      onValueChange={(next) => {
        const view = parseEnum(ChannelMapView, next);
        if (view) onChange(view);
      }}
      aria-label={CHANNEL_MAP_COPY.viewLabel}
    >
      {CHANNEL_MAP_VIEWS.map(({ value: view, label, icon: Icon }) => (
        <ToggleGroupItem key={view} value={view} aria-label={label}>
          <Icon aria-hidden="true" />
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
