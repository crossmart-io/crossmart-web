import type { NodeProps } from '@xyflow/react';
import type { ProductChannelNode as ProductChannelNodeType } from '../channel-map.types';
import { MapHandleSide } from '../channel-map.constants';
import { MapHandle } from './MapHandle';
import { ProductChannelCard } from './ProductChannelCard';

/** A store on the product's map: the card, with the anchor its edge ends at. */
export function ProductChannelNode({ data }: NodeProps<ProductChannelNodeType>) {
  return (
    <>
      <MapHandle side={MapHandleSide.Leaf} />
      <ProductChannelCard {...data} />
    </>
  );
}
