import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { BillingPlan } from '../billing.types';
import { PlanAction } from './PlanAction';

const STARTER = { code: 'starter', name: 'Starter', selfServe: true } as BillingPlan;
const ENTERPRISE = { code: 'enterprise', name: 'Enterprise', selfServe: false } as BillingPlan;
const BASE = {
  current: false,
  subscribed: false,
  trialAvailable: true,
  salesEmail: 'hello@crossmart.io',
  pending: false,
};

describe('PlanAction', () => {
  it('starts a free trial the first time', async () => {
    const onChoose = vi.fn<(plan: BillingPlan) => void>();
    render(<PlanAction {...BASE} plan={STARTER} onChoose={onChoose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Start free trial' }));
    expect(onChoose).toHaveBeenCalledWith(STARTER);
  });

  it('subscribes without a trial once one was used', () => {
    render(
      <PlanAction
        {...BASE}
        trialAvailable={false}
        plan={STARTER}
        onChoose={vi.fn<(plan: BillingPlan) => void>()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  it('sends Enterprise to sales', () => {
    render(
      <PlanAction {...BASE} plan={ENTERPRISE} onChoose={vi.fn<(plan: BillingPlan) => void>()} />,
    );
    expect(screen.getByRole('link', { name: 'Contact sales' })).toHaveAttribute(
      'href',
      'mailto:hello@crossmart.io',
    );
  });

  it('points a paying organization to the billing portal for other plans', () => {
    render(
      <PlanAction
        {...BASE}
        subscribed
        plan={STARTER}
        onChoose={vi.fn<(plan: BillingPlan) => void>()}
      />,
    );
    expect(screen.getByText('Change your plan in Manage billing.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
