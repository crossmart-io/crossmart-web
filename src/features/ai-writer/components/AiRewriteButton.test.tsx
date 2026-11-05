import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { ContentField } from '@/api/schema';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GenerateAvailability, useGenerateAvailability } from '@/features/suggestions';
import type * as Suggestions from '@/features/suggestions';
import type { ContentDraft } from '../ai-writer.types';
import { useContentDraft } from '../hooks/useContentDraft';
import { AiRewriteButton } from './AiRewriteButton';

vi.mock('../hooks/useContentDraft', () => ({ useContentDraft: vi.fn<typeof useContentDraft>() }));
vi.mock('@/features/suggestions', async (importOriginal) => ({
  ...(await importOriginal<typeof Suggestions>()),
  useGenerateAvailability: vi.fn<typeof useGenerateAvailability>(),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn<typeof toast.success>() } }));

const DRAFT: ContentDraft = { title: 'Acme Stoneware Mug', descriptionHtml: null };

type MutateOptions = { onSuccess: (draft: ContentDraft) => void };

function renderButton(availability = GenerateAvailability.Ready) {
  const undo = vi.fn<() => void>();
  const apply = vi.fn<(draft: ContentDraft) => () => void>().mockReturnValue(undo);
  const mutate = vi.fn<(input: unknown, options: MutateOptions) => void>((_input, options) =>
    options.onSuccess(DRAFT),
  );
  vi.mocked(useGenerateAvailability).mockReturnValue(availability);
  vi.mocked(useContentDraft).mockReturnValue({
    mutate,
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof useContentDraft>);
  render(
    <TooltipProvider>
      <AiRewriteButton
        target={{ workspaceId: 'ws-1', productId: 'p-1' }}
        fields={[ContentField.title]}
        getCurrent={() => ({ title: 'Mug' })}
        apply={apply}
      />
    </TooltipProvider>,
  );
  return { mutate, apply, undo };
}

describe('AiRewriteButton', () => {
  it('rewrites with the typed instruction and the text being edited, then offers Undo', async () => {
    const { mutate, apply, undo } = renderButton();

    await userEvent.click(screen.getByRole('button', { name: 'Rewrite with AI' }));
    await userEvent.type(screen.getByLabelText('What should change?'), 'Mention the glaze');
    await userEvent.click(screen.getByRole('button', { name: 'Rewrite' }));

    expect(mutate).toHaveBeenCalledWith(
      { fields: [ContentField.title], instruction: 'Mention the glaze', current: { title: 'Mug' } },
      expect.anything(),
    );
    expect(apply).toHaveBeenCalledWith(DRAFT);
    expect(toast.success).toHaveBeenCalledWith('Title rewritten. Review it, then save.', {
      action: { label: 'Undo', onClick: undo },
    });
  });

  it('rewrites in one click with a quick instruction', async () => {
    const { mutate } = renderButton();

    await userEvent.click(screen.getByRole('button', { name: 'Rewrite with AI' }));
    await userEvent.click(screen.getByRole('button', { name: 'Shorter' }));

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ instruction: 'Shorter' }),
      expect.anything(),
    );
  });

  it('is disabled while AI is not configured', () => {
    renderButton(GenerateAvailability.NotConfigured);
    expect(screen.getByRole('button', { name: 'Rewrite with AI' })).toBeDisabled();
  });

  it('is not shown without the permission', () => {
    renderButton(GenerateAvailability.Hidden);
    expect(screen.queryByRole('button', { name: 'Rewrite with AI' })).not.toBeInTheDocument();
  });
});
