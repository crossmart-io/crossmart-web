import { useMatches } from 'react-router';

/** How the app shell lays a page out: in the reading column, or across the whole window. */
export enum PageLayout {
  Column = 'column',
  /** The page fills the space under the header and scrolls inside its own panels. */
  Full = 'full',
}

/** What a route may tell the shell, as its `handle`. */
export interface RouteHandle {
  layout?: PageLayout;
}

function isRouteHandle(handle: unknown): handle is RouteHandle {
  return typeof handle === 'object' && handle !== null && 'layout' in handle;
}

/** The layout the deepest route asks for; the reading column by default. */
export function usePageLayout(): PageLayout {
  const matches = useMatches();
  const handle = matches.map((match) => match.handle).findLast(isRouteHandle);
  return handle?.layout ?? PageLayout.Column;
}
