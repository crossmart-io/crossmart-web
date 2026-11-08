import { renderHook } from '@testing-library/react';
import { workspaceEventFixture } from '../testing/workspace-event.fixture';
import { useUnseenCount } from './useUnseenCount';

const history = [workspaceEventFixture({ id: 'a' })];
const later = [...history, workspaceEventFixture({ id: 'b' }), workspaceEventFixture({ id: 'c' })];

describe('useUnseenCount', () => {
  it('counts what arrived after the history while the events are not shown', () => {
    const { result, rerender } = renderHook(
      ({ events, isViewing }) => useUnseenCount(events, isViewing),
      { initialProps: { events: history, isViewing: false } },
    );
    expect(result.current).toBe(0);

    rerender({ events: later, isViewing: false });
    expect(result.current).toBe(2);

    rerender({ events: later, isViewing: true });
    expect(result.current).toBe(0);
    rerender({ events: later, isViewing: false });
    expect(result.current).toBe(0);
  });
});
