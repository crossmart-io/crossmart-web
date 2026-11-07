import { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ChannelMapView, GRAPH_MEDIA_QUERY } from '../channel-map.constants';

export interface ChannelMapViewState {
  /** What is shown: the list on narrow screens, whatever was chosen otherwise. */
  view: ChannelMapView;
  setView: (view: ChannelMapView) => void;
  /** Whether the screen has room for the graph, so the choice is offered. */
  canShowGraph: boolean;
}

/** The map as a graph where there is room for it, else as a list of the same nodes. */
export function useChannelMapView(): ChannelMapViewState {
  const canShowGraph = useMediaQuery(GRAPH_MEDIA_QUERY);
  const [chosen, setView] = useState(ChannelMapView.Graph);
  return { view: canShowGraph ? chosen : ChannelMapView.List, setView, canShowGraph };
}
