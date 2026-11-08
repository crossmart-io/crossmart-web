import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NodeActivityTone } from '../channel-map.constants';
import { NodeOverlayFrame } from './NodeOverlayFrame';

describe('NodeOverlayFrame', () => {
  it('says what the agent does on the node, and opens the changes waiting there', async () => {
    const onOpenProposals = vi.fn<() => void>();
    render(
      <NodeOverlayFrame
        overlay={{
          activity: { label: 'Proposed: 3 changes', tone: NodeActivityTone.Waiting },
          proposals: 3,
          highlighted: false,
          onOpenProposals,
        }}
      >
        <p>North shop</p>
      </NodeOverlayFrame>,
    );

    expect(screen.getByText('Proposed: 3 changes')).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: '3 changes waiting for you. Show them' }),
    );
    expect(onOpenProposals).toHaveBeenCalledOnce();
  });

  it('draws the card alone without an overlay', () => {
    render(
      <NodeOverlayFrame>
        <p>North shop</p>
      </NodeOverlayFrame>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
