import type { NodeProps } from '@xyflow/react';
import type { StoreNode as StoreNodeType } from '../channel-map.types';
import { MapHandleSide } from '../channel-map.constants';
import { MapHandle } from './MapHandle';
import { StoreCard } from './StoreCard';

/** A store on the account's map: the card, with the anchor its edge ends at. */
export function StoreNode({ data }: NodeProps<StoreNodeType>) {
  return (
    <>
      <MapHandle side={MapHandleSide.Leaf} />
      <StoreCard {...data} />
    </>
  );
}
