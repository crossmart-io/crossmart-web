import { Handle, Position } from '@xyflow/react';

import { MapHandleSide } from '../channel-map.constants';

/** An invisible anchor for the edges: the map is read-only, so nothing can be connected. */
export function MapHandle({ side }: { side: MapHandleSide }) {
  const isHub = side === MapHandleSide.Hub;
  return (
    <Handle
      type={isHub ? 'source' : 'target'}
      position={isHub ? Position.Right : Position.Left}
      isConnectable={false}
      className="pointer-events-none! size-1! min-h-0! min-w-0! border-0! bg-transparent!"
    />
  );
}
