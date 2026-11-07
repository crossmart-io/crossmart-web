import type { Edge, Node, XYPosition } from '@xyflow/react';
import {
  MAP_EDGE_WIDTH,
  MAP_LAYOUT,
  MAP_STATUS_PRESENTATION,
  type MapStatus,
} from './channel-map.constants';

/**
 * Read-only nodes: nothing is dragged, selected or focused by the canvas itself; the buttons and
 * links inside each node take the focus instead. React Flow lets such nodes ignore the pointer,
 * so they take it back for those buttons and links.
 */
export const STATIC_NODE = {
  draggable: false,
  selectable: false,
  focusable: false,
  style: { pointerEvents: 'all' },
} as const satisfies Partial<Node>;

/** A point on the canvas, in the shape React Flow takes. */
export function canvasPoint(left: number, top: number): XYPosition {
  // oxlint-disable-next-line eslint/id-length -- React Flow names a position's axes x and y.
  return { x: left, y: top };
}

/** Where a node whose place is unknown would go; never reached with a consistent layout. */
export const ORIGIN = canvasPoint(0, 0);

/** Halving a free height centres the hub on the column. */
const CENTRED = 2;

export interface ColumnLayout {
  hub: XYPosition;
  leaves: XYPosition[];
  /** The graph's height at zoom 1. */
  height: number;
}

/**
 * The hub on the left, centred on a column of leaves to its right, top to bottom in the order
 * given. Deterministic: the same nodes always land in the same places.
 */
export function columnLayout(hubHeight: number, leafHeights: readonly number[]): ColumnLayout {
  const leafX = MAP_LAYOUT.hubWidth + MAP_LAYOUT.columnGap;
  const leaves: XYPosition[] = [];
  let nextY = 0;
  for (const height of leafHeights) {
    leaves.push(canvasPoint(leafX, nextY));
    nextY += height + MAP_LAYOUT.rowGap;
  }
  const columnHeight = Math.max(nextY - MAP_LAYOUT.rowGap, 0);
  const height = Math.max(columnHeight, hubHeight);
  return { hub: canvasPoint(0, (height - hubHeight) / CENTRED), leaves, height };
}

/** The canvas height that shows a graph of `height` without crowding or empty space. */
export function canvasHeight(height: number): number {
  return Math.min(
    Math.max(height + MAP_LAYOUT.canvasPadding, MAP_LAYOUT.minCanvasHeight),
    MAP_LAYOUT.maxCanvasHeight,
  );
}

/** A read-only edge from the hub to a leaf, drawn in its status's colour and line. */
export function statusEdge(source: string, target: string, status: MapStatus): Edge {
  const { stroke, dash, animated } = MAP_STATUS_PRESENTATION[status];
  return {
    id: `${source}->${target}`,
    source,
    target,
    animated,
    selectable: false,
    focusable: false,
    data: { status },
    style: { stroke, strokeWidth: MAP_EDGE_WIDTH, strokeDasharray: dash },
  };
}
