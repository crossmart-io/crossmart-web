import { MS_PER_SECOND } from '@/lib/time';

export const WORKSPACE_EVENTS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/events';
export const WORKSPACE_EVENTS_STREAM_ENDPOINT = '/api/v1/workspaces/{workspaceId}/events/stream';

/** The stream's event names, as the API sends them. */
export enum WorkspaceStreamEvent {
  Event = 'workspace_event',
  Ready = 'ready',
}

export const LAST_EVENT_ID_HEADER = 'Last-Event-ID';
export const EVENT_STREAM_ACCEPT = 'text/event-stream';

/** How the page follows the workspace: over the stream, or by polling when the stream fails. */
export enum EventFeedStatus {
  Connecting = 'connecting',
  Live = 'live',
  Reconnecting = 'reconnecting',
  Polling = 'polling',
}

const RECONNECT_SECONDS = 3;
const MAX_RECONNECT_SECONDS = 30;
const POLL_SECONDS = 5;
const ANNOUNCE_SECONDS = 5;
const REFRESH_SECONDS = 2;
const RECENT_CHANGE_SECONDS = 20;
const MIN_PULSE_SECONDS = 6;
const STREAM_FAILURES_BEFORE_POLLING = 3;
const POLLS_BEFORE_STREAM_RETRY = 12;
const EVENT_BUFFER_SIZE = 200;

export const EVENT_FEED = {
  /** Events kept on the page; older ones are in the activity log. */
  bufferSize: EVENT_BUFFER_SIZE,
  /** The first wait before reconnecting, doubled after each failure up to the cap. */
  reconnectMs: RECONNECT_SECONDS * MS_PER_SECOND,
  maxReconnectMs: MAX_RECONNECT_SECONDS * MS_PER_SECOND,
  /** After this many failed streams in a row, poll the list instead for a while. */
  streamFailuresBeforePolling: STREAM_FAILURES_BEFORE_POLLING,
  pollMs: POLL_SECONDS * MS_PER_SECOND,
  /** Polls before trying the stream again. */
  pollsBeforeStreamRetry: POLLS_BEFORE_STREAM_RETRY,
  /** New events are announced to screen readers at most this often, together. */
  announceEveryMs: ANNOUNCE_SECONDS * MS_PER_SECOND,
  /** Pages that show what the events change are refetched at most this often. */
  refreshEveryMs: REFRESH_SECONDS * MS_PER_SECOND,
} as const;

/** How long a change Crossmart Agent made stays lit on the map, and its edge pulses at least. */
export const RECENT_CHANGE_MS = RECENT_CHANGE_SECONDS * MS_PER_SECOND;
export const MIN_PULSE_MS = MIN_PULSE_SECONDS * MS_PER_SECOND;

/** The three columns side by side from Tailwind's `xl` up; tabs below. */
export const CONSOLE_COLUMNS_MEDIA_QUERY = '(min-width: 80rem)';

/** The tabs of the page on narrow screens. */
export enum ConsoleTab {
  Chat = 'chat',
  Map = 'map',
  Events = 'events',
}

/** What the event stream shows. */
export enum EventFilter {
  All = 'all',
  Agent = 'agent',
  Stores = 'stores',
  Orders = 'orders',
  Errors = 'errors',
}

export const EVENT_FILTERS: readonly { value: EventFilter; label: string }[] = [
  { value: EventFilter.All, label: 'All' },
  { value: EventFilter.Agent, label: 'Agent' },
  { value: EventFilter.Stores, label: 'Stores' },
  { value: EventFilter.Orders, label: 'Orders' },
  { value: EventFilter.Errors, label: 'Errors' },
];

/** Where Crossmart Agent stands, for the status bar. */
export enum AgentState {
  Idle = 'idle',
  Running = 'running',
  Waiting = 'waiting',
  Unavailable = 'unavailable',
}

export const AGENT_CONSOLE_TEST_IDS = {
  statusBar: 'agent-console-status',
  map: 'agent-console-map',
  events: 'agent-console-events',
  eventItem: 'agent-console-event',
  tabs: 'agent-console-tabs',
  hideEvents: 'agent-console-hide-events',
  showEvents: 'agent-console-show-events',
} as const;

/** The Events column, which the buttons that hide and show it control. */
export const EVENTS_COLUMN_ID = 'agent-console-events-column';

export const AGENT_CONSOLE_COPY = {
  name: 'Crossmart Agent',
  tabs: { [ConsoleTab.Chat]: 'Chat', [ConsoleTab.Map]: 'Map', [ConsoleTab.Events]: 'Events' },
  mapTitle: 'Live map',
  mapActive: 'Crossmart Agent is working on the map',
  eventsTitle: 'Events',
  hideEvents: 'Hide events',
  showEvents: (unseen: number) =>
    unseen > 0 ? `Show events, ${unseen === 1 ? '1 new' : `${unseen} new`}` : 'Show events',
  eventsLabel: 'What happens in the workspace, newest first',
  filterLabel: 'Show events',
  noEvents:
    'Nothing has happened yet. Events from Crossmart Agent, your stores and orders appear here.',
  noMatches: 'No events of this kind yet.',
  newEvents: (count: number) => (count === 1 ? '1 new event' : `${count} new events`),
  announce: (count: number, latest: string) =>
    count === 1 ? `New event: ${latest}` : `${count} new events. Latest: ${latest}`,
  system: 'Crossmart',
  onBehalfOf: (agent: string, person: string) => `${agent} for ${person}`,
  feed: {
    connecting: 'Connecting',
    live: 'Live',
    reconnecting: 'Reconnecting',
    polling: 'Updating every few seconds',
  },
  status: {
    label: 'Workspace status',
    stores: 'Stores',
    storesValue: (healthy: number, total: number) => `${healthy} of ${total} healthy`,
    listings: 'Listings',
    listingsValue: (live: number) => `${live.toLocaleString()} live`,
    failed: (count: number) => `${count.toLocaleString()} failed`,
    agent: 'Agent',
    lastSync: 'Last sync',
    never: 'Never',
  },
  agentStates: {
    idle: 'Idle',
    running: 'Working',
    waiting: 'Waiting for approval',
    unavailable: 'Not available',
  },
  activity: {
    reading: (tool: string) => `Reading: ${tool}`,
    read: (tool: string, outcome: string | null) =>
      outcome ? `Read: ${tool} · ${outcome}` : `Read: ${tool}`,
    proposed: (count: number) =>
      count === 1 ? 'Proposed: 1 change' : `Proposed: ${count} changes`,
    updating: (change: string) => `Updating: ${change}`,
    applied: (change: string) => `Applied: ${change}`,
    failed: (change: string) => `Failed: ${change}`,
  },
  chatUnavailableTitle: 'Crossmart Agent is not part of your role',
  chatUnavailable:
    'You can follow the map and the events. Ask an owner or admin for a role that may use Crossmart Agent.',
} as const;
