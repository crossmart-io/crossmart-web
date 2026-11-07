import '@xyflow/react/dist/base.css';
import './channel-map.css';
import { useEffect } from 'react';
import {
  type Edge,
  type Node,
  type NodeTypes,
  ReactFlow,
  useNodesInitialized,
  useReactFlow,
  useStore,
} from '@xyflow/react';
import { useTheme } from '@/components/theme/useTheme';
import { MAP_LAYOUT } from '../channel-map.constants';
import { canvasHeight } from '../map-layout';

interface ChannelMapCanvasProps<TNode extends Node> {
  nodes: TNode[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  /** The graph's height at zoom 1, which sizes the canvas. */
  graphHeight: number;
  label: string;
}

const FIT_VIEW_OPTIONS = {
  padding: MAP_LAYOUT.fitPadding,
  maxZoom: MAP_LAYOUT.maxZoom,
  minZoom: MAP_LAYOUT.minZoom,
} as const;

/** Fits the graph again whenever the canvas changes size or the nodes are measured anew. */
function FitOnResize() {
  const { fitView } = useReactFlow();
  const width = useStore((state) => state.width);
  const height = useStore((state) => state.height);
  const measured = useNodesInitialized();
  useEffect(() => {
    if (measured) void fitView(FIT_VIEW_OPTIONS);
  }, [fitView, width, height, measured]);
  return null;
}

/**
 * A read-only React Flow canvas fitted to its graph: no dragging, connecting, selecting, panning
 * or zooming, so the page scrolls over it as over any card. The nodes' own buttons and links
 * are what a keyboard reaches.
 */
export function ChannelMapCanvas<TNode extends Node>({
  nodes,
  edges,
  nodeTypes,
  graphHeight,
  label,
}: ChannelMapCanvasProps<TNode>) {
  const { resolvedTheme } = useTheme();
  return (
    <section
      aria-label={label}
      className="channel-map w-full overflow-hidden rounded-lg border bg-muted/30"
      style={{ height: canvasHeight(graphHeight) }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        colorMode={resolvedTheme}
        fitView
        fitViewOptions={FIT_VIEW_OPTIONS}
        minZoom={MAP_LAYOUT.minZoom}
        maxZoom={MAP_LAYOUT.maxZoom}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        disableKeyboardA11y
      >
        <FitOnResize />
      </ReactFlow>
    </section>
  );
}
