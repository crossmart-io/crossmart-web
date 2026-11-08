import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConsoleTab, EventFeedStatus } from '../agent-console.constants';
import type { AgentConsoleState } from '../hooks/useAgentConsole';
import { useEventsColumn } from '../hooks/useEventsColumn';
import { workspaceEventFixture } from '../testing/workspace-event.fixture';
import { ConsoleColumns } from './ConsoleColumns';
import { HideEventsButton } from './EventsColumnToggle';

function Columns({ events }: { events: AgentConsoleState['feed']['events'] }) {
  const column = useEventsColumn();
  const state = { feed: { events, status: EventFeedStatus.Live } } as AgentConsoleState;
  const panels = {
    [ConsoleTab.Chat]: <p>Chat</p>,
    [ConsoleTab.Map]: <p>Map</p>,
    [ConsoleTab.Events]: <HideEventsButton onHide={() => column.setCollapsed(true)} />,
  };
  return <ConsoleColumns panels={panels} state={state} events={column} />;
}

describe('ConsoleColumns', () => {
  afterEach(() => localStorage.clear());

  it('hides the Events column to a rail that counts new events and shows it again', async () => {
    const history = [workspaceEventFixture({ id: 'a' })];
    const { rerender } = render(<Columns events={history} />);

    const hide = screen.getByRole('button', { name: 'Hide events' });
    expect(hide).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(hide);

    rerender(<Columns events={[...history, workspaceEventFixture({ id: 'b' })]} />);
    const show = screen.getByRole('button', { name: 'Show events, 1 new' });
    expect(show).toHaveAttribute('aria-expanded', 'false');

    show.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Hide events' })).toBeInTheDocument();
  });
});
