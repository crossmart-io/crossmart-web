import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGenerateContent } from '../hooks/useGenerateContent';
import type * as GenerateAvailabilityHooks from '../hooks/useGenerateAvailability';
import { GenerateAvailability, useGenerateAvailability } from '../hooks/useGenerateAvailability';
import { GenerateWithAiButton } from './GenerateWithAiButton';

vi.mock('../hooks/useGenerateContent', () => ({
  useGenerateContent: vi.fn<typeof useGenerateContent>(),
}));
vi.mock('../hooks/useGenerateAvailability', async (importOriginal) => ({
  ...(await importOriginal<typeof GenerateAvailabilityHooks>()),
  useGenerateAvailability: vi.fn<typeof useGenerateAvailability>(),
}));

function renderButton(availability: GenerateAvailability) {
  const mutate = vi.fn<(input: unknown) => void>();
  vi.mocked(useGenerateAvailability).mockReturnValue(availability);
  vi.mocked(useGenerateContent).mockReturnValue({
    mutate,
    isPending: false,
  } as unknown as ReturnType<typeof useGenerateContent>);
  render(
    <TooltipProvider>
      <GenerateWithAiButton workspaceId="ws-1" connectionId="c-1" productId="p-1" />
    </TooltipProvider>,
  );
  return { mutate };
}

describe('GenerateWithAiButton', () => {
  it('asks AI for this product on this store', async () => {
    const { mutate } = renderButton(GenerateAvailability.Ready);

    await userEvent.click(screen.getByRole('button', { name: 'Generate with AI' }));

    expect(mutate).toHaveBeenCalledWith({ connectionId: 'c-1', productIds: ['p-1'] });
  });

  it('is disabled while AI is not configured', () => {
    renderButton(GenerateAvailability.NotConfigured);

    expect(screen.getByRole('button', { name: 'Generate with AI' })).toBeDisabled();
  });

  it('is not shown without the permission', () => {
    renderButton(GenerateAvailability.Hidden);

    expect(screen.queryByRole('button', { name: 'Generate with AI' })).not.toBeInTheDocument();
  });
});
