import { Link } from 'react-router';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AgentWorkerContextView } from '@/api/schema';
import { PageSection, ROUTES } from '@/config/routes';
import { AGENT_WORKER_TEST_IDS, AskAgentWorkerButton } from '@/features/agent-worker';
import { CHANNEL_MAP_COPY, ChannelMapView, MapNodeType } from '../channel-map.constants';
import type { ProductHub } from '../channel-map.types';
import { useChannelMapView } from '../hooks/useChannelMapView';
import { useProductChannelMap } from '../hooks/useProductChannelMap';
import { buildProductMap, type ProductMapInput } from '../product-map-graph';
import { ChannelMapCanvas } from './ChannelMapCanvas';
import { MapViewToggle } from './MapViewToggle';
import { ProductChannelList } from './ProductChannelList';
import { ProductChannelNode } from './ProductChannelNode';
import { ProductChannelSheet } from './ProductChannelSheet';
import { ProductHubNode } from './ProductHubNode';

const NODE_TYPES = {
  [MapNodeType.Product]: ProductHubNode,
  [MapNodeType.ProductChannel]: ProductChannelNode,
};

interface ProductChannelMapProps {
  workspaceId: string;
  productId: string;
  product: ProductHub;
  canEdit: boolean;
}

function NoStores() {
  return (
    <p className="text-sm text-muted-foreground">
      {CHANNEL_MAP_COPY.noStores}{' '}
      <Link to={ROUTES.channels} className="font-medium text-foreground underline">
        {CHANNEL_MAP_COPY.connectStore}
      </Link>
    </p>
  );
}

function ProductMapGraphView(props: ProductMapInput) {
  const graph = buildProductMap(props);
  return (
    <ChannelMapCanvas
      nodes={graph.nodes}
      edges={graph.edges}
      nodeTypes={NODE_TYPES}
      graphHeight={graph.height}
      label={CHANNEL_MAP_COPY.productGraphLabel(props.product.title)}
    />
  );
}

interface MapBodyProps {
  input: ProductMapInput | undefined;
  isPending: boolean;
  view: ChannelMapView;
}

/** The map, or the list of the same stores, once the stores have loaded. */
function ProductMapBody({ input, isPending, view }: MapBodyProps) {
  if (isPending) return <Skeleton className="h-64 w-full" />;
  if (!input) return null;
  if (input.channels.length === 0) return <NoStores />;
  return view === ChannelMapView.Graph ? (
    <ProductMapGraphView {...input} />
  ) : (
    <ProductChannelList {...input} />
  );
}

type ProductChannelMapState = ReturnType<typeof useProductChannelMap>;

/** The panel of the store opened on the map, if one is. */
function OpenChannelSheet({
  map,
  workspaceId,
  productId,
  canEdit,
}: Omit<ProductChannelMapProps, 'product'> & { map: ProductChannelMapState }) {
  const channel = map.openChannel;
  if (!channel) return null;
  const connectionId = channel.connection.id;
  return (
    <ProductChannelSheet
      listingRef={{ workspaceId, productId, connectionId }}
      channel={channel}
      suggestions={map.suggestionsByStore.get(connectionId) ?? []}
      canEdit={canEdit}
      onEditOverrides={() => map.editOverrides(connectionId)}
      onClose={map.close}
    />
  );
}

/**
 * The product in the middle of the stores it is, or could be, listed on: each store with the
 * product's state there, its price and stock, and a panel of details and fixes on a click.
 */
export function ProductChannelMap({ product, ...props }: ProductChannelMapProps) {
  const map = useProductChannelMap(props.workspaceId, props.productId);
  const { view, setView, canShowGraph } = useChannelMapView();
  const channels = map.channels.data;
  const input = channels && {
    product,
    channels,
    suggestionCounts: map.suggestionCounts,
    onOpen: map.open,
  };
  return (
    <Card id={PageSection.ProductChannelMap}>
      <CardHeader>
        <CardTitle>
          <h2 className="text-sm font-semibold">{CHANNEL_MAP_COPY.productTitle}</h2>
        </CardTitle>
        <CardDescription>{CHANNEL_MAP_COPY.productDescription}</CardDescription>
        <CardAction className="flex flex-wrap items-center justify-end gap-2">
          <AskAgentWorkerButton
            context={{ view: AgentWorkerContextView.product_map, productId: props.productId }}
            testId={AGENT_WORKER_TEST_IDS.productMapButton}
          />
          {canShowGraph && Boolean(channels?.length) && (
            <MapViewToggle value={view} onChange={setView} />
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <ProductMapBody input={input} isPending={map.channels.isPending} view={view} />
        <OpenChannelSheet map={map} {...props} />
      </CardContent>
    </Card>
  );
}
