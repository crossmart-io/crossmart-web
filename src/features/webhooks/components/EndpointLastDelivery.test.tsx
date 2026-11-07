import { render, screen } from '@testing-library/react';
import { WebhookAttemptOutcome } from '@/api/schema';
import { EndpointLastDelivery } from './EndpointLastDelivery';

const ATTEMPTED_AT = '2026-11-06T10:00:01Z';

describe('EndpointLastDelivery', () => {
  it('says so before the first delivery', () => {
    render(<EndpointLastDelivery endpoint={{ lastDelivery: null, consecutiveFailures: 0 }} />);

    expect(screen.getByText('No deliveries yet')).toBeInTheDocument();
  });

  it('shows a delivered attempt with its time and no failures', () => {
    render(
      <EndpointLastDelivery
        endpoint={{
          consecutiveFailures: 0,
          lastDelivery: {
            attemptedAt: ATTEMPTED_AT,
            outcome: WebhookAttemptOutcome.SUCCEEDED,
            responseStatus: 200,
            error: null,
          },
        }}
      />,
    );

    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.queryByText(/HTTP/)).not.toBeInTheDocument();
    expect(screen.getByRole('time')).toHaveAttribute('dateTime', ATTEMPTED_AT);
    expect(screen.queryByText(/in a row/)).not.toBeInTheDocument();
  });

  it('shows a failed attempt with the HTTP status, why it failed and the failures in a row', () => {
    render(
      <EndpointLastDelivery
        endpoint={{
          consecutiveFailures: 3,
          lastDelivery: {
            attemptedAt: ATTEMPTED_AT,
            outcome: WebhookAttemptOutcome.FAILED,
            responseStatus: 503,
            error: 'The endpoint answered with HTTP 503',
          },
        }}
      />,
    );

    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('· HTTP 503')).toBeInTheDocument();
    expect(screen.getByTitle('The endpoint answered with HTTP 503')).toBeInTheDocument();
    expect(screen.getByText('3 failed attempts in a row')).toBeInTheDocument();
  });

  it('shows no HTTP status when the endpoint never answered', () => {
    render(
      <EndpointLastDelivery
        endpoint={{
          consecutiveFailures: 1,
          lastDelivery: {
            attemptedAt: ATTEMPTED_AT,
            outcome: WebhookAttemptOutcome.FAILED,
            responseStatus: null,
            error: 'The endpoint did not answer in time',
          },
        }}
      />,
    );

    expect(screen.queryByText(/HTTP/)).not.toBeInTheDocument();
    expect(screen.getByText('1 failed attempt in a row')).toBeInTheDocument();
  });
});
