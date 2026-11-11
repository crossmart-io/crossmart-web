import '@xyflow/react/dist/base.css';
import './channel-map.css';
import { useEffect } from 'react';
import {
  Controls,
  type Edge,
  type Node,
  type NodeTypes,
  ReactFlow,
  type ReactFlowState,
  useNodesInitialized,
  useNodesState,
  useReactFlow,
  useStore,
} from '@xyflow/react';
import { useTheme } from '@/components/theme/useTheme';
import { cn } from '@/lib/utils';
import { CHANNEL_MAP_COPY, MAP_LAYOUT } from '../channel-map.constants';
import { canvasHeight } from '../map-layout';

interface ChannelMapCanvasProps<TNode extends Node> {
  nodes: TNode[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  /** The graph's height at zoom 1, which sizes the canvas. */
  graphHeight: number;
  label: string;
  /** Fill the parent's height instead of sizing the canvas to the graph. */
  fill?: boolean;
}

const FIT_VIEW_OPTIONS = {
  padding: MAP_LAYOUT.fitPadding,
  maxZoom: MAP_LAYOUT.maxZoom,
  minZoom: MAP_LAYOUT.minZoom,
} as const;

/** A map filling a column: fitted tighter, and shrunk as far as it takes to show it whole. */
const FILL_FIT_VIEW_OPTIONS = {
  padding: MAP_LAYOUT.fillPadding,
  maxZoom: MAP_LAYOUT.fillMaxZoom,
  minZoom: MAP_LAYOUT.fillMinZoom,
  duration: MAP_LAYOUT.fitDurationMs,
} as const;

type FitOptions = typeof FIT_VIEW_OPTIONS | typeof FILL_FIT_VIEW_OPTIONS;

const SHAPE_SEPARATOR = '|';

/** Which nodes there are and how big each was measured: it changes when the graph's shape does. */
function graphShape(state: ReactFlowState): string {
  return state.nodes
    .map((node) => `${node.id}:${node.measured?.width ?? 0}x${node.measured?.height ?? 0}`)
    .join(SHAPE_SEPARATOR);
}

/**
 * Fits the graph again whenever the canvas changes size, or nodes are added, removed or measured
 * anew, so the whole map stays in view.
 */
function FitOnChange({ options }: { options: FitOptions }) {
  const { fitView } = useReactFlow();
  const width = useStore((state) => state.width);
  const height = useStore((state) => state.height);
  const shape = useStore(graphShape);
  const measured = useNodesInitialized();
  useEffect(() => {
    if (measured) void fitView(options);
  }, [fitView, options, width, height, shape, measured]);
  return null;
}

/**
 * The nodes as React Flow keeps them: new data (a live overlay, fresh counts) replaces the old,
 * but each node keeps the size React Flow measured, so it is not hidden to be measured again.
 */
function useMeasuredNodes<TNode extends Node>(nodes: TNode[]) {
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<TNode>(nodes);
  useEffect(() => {
    setFlowNodes((previous) => {
      const measured = new Map(previous.map((node) => [node.id, node.measured]));
      return nodes.map((node) => ({ ...node, measured: measured.get(node.id) ?? node.measured }));
    });
  }, [nodes, setFlowNodes]);
  return { flowNodes, onNodesChange };
}

/**
 * A read-only React Flow canvas fitted to its graph: no dragging, connecting, selecting, panning
 * or zooming, so the page scrolls over it as over any card. Filling a column, it is fitted whole
 * and offers zoom and fit controls, and may be dragged once zoomed in. The nodes' own buttons and
 * links are what a keyboard reaches.
 */
export function ChannelMapCanvas<TNode extends Node>({
  nodes,
  edges,
  nodeTypes,
  graphHeight,
  label,
  fill = false,
}: ChannelMapCanvasProps<TNode>) {
  const { resolvedTheme } = useTheme();
  const { flowNodes, onNodesChange } = useMeasuredNodes(nodes);
  const fitOptions = fill ? FILL_FIT_VIEW_OPTIONS : FIT_VIEW_OPTIONS;
  return (
    <section
      aria-label={label}
      className={cn(
        'channel-map w-full overflow-hidden rounded-lg border bg-muted/30',
        fill && 'h-full min-h-64',
      )}
      style={fill ? undefined : { height: canvasHeight(graphHeight) }}
    >
      <ReactFlow
        nodes={flowNodes}
        onNodesChange={onNodesChange}
        edges={edges}
        nodeTypes={nodeTypes}
        colorMode={resolvedTheme}
        fitView
        fitViewOptions={fitOptions}
        minZoom={fitOptions.minZoom}
        maxZoom={fitOptions.maxZoom}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        panOnDrag={fill}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        disableKeyboardA11y
      >
        <FitOnChange options={fitOptions} />
        {fill && (
          <Controls
            showInteractive={false}
            fitViewOptions={fitOptions}
            orientation="horizontal"
            aria-label={CHANNEL_MAP_COPY.controlsLabel}
          />
        )}
      </ReactFlow>
    </section>
  );
}
