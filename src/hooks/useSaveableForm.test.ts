import { act, renderHook, waitFor } from '@testing-library/react';
import { z } from 'zod';
import { useSaveableForm } from './useSaveableForm';

const schema = z.object({ name: z.string().trim().min(1, 'Name it') });
type NameForm = z.input<typeof schema>;

interface SavedRecord {
  name: string;
}

function renderSaveableForm(save: (values: NameForm) => Promise<SavedRecord>) {
  return renderHook(() =>
    useSaveableForm({
      schema,
      defaults: { name: 'Old' },
      save,
      toForm: (saved: SavedRecord) => ({ name: saved.name.toUpperCase() }),
    }),
  );
}

describe('useSaveableForm', () => {
  it('saves the parsed values and starts over from what was saved', async () => {
    const save = vi.fn<(values: NameForm) => Promise<SavedRecord>>().mockResolvedValue({
      name: 'saved',
    });
    const { result } = renderSaveableForm(save);

    act(() => result.current.form.setValue('name', '  New  ', { shouldDirty: true }));
    act(() => void result.current.submit());

    await waitFor(() => expect(result.current.form.getValues('name')).toBe('SAVED'));
    expect(save).toHaveBeenCalledWith({ name: 'New' });
    expect(result.current.form.formState.defaultValues).toEqual({ name: 'SAVED' });
  });

  it('keeps the edits when the save fails, without an unhandled rejection', async () => {
    const save = vi
      .fn<(values: NameForm) => Promise<SavedRecord>>()
      .mockRejectedValue(new Error('The API is down'));
    const { result } = renderSaveableForm(save);

    act(() => result.current.form.setValue('name', 'New', { shouldDirty: true }));
    act(() => void result.current.submit());

    await waitFor(() => expect(save).toHaveBeenCalledOnce());
    await act(() => Promise.resolve());
    expect(result.current.form.getValues('name')).toBe('New');
    expect(result.current.form.formState.defaultValues).toEqual({ name: 'Old' });
  });

  it('does not save invalid values', async () => {
    const save = vi.fn<(values: NameForm) => Promise<SavedRecord>>();
    const { result } = renderSaveableForm(save);

    act(() => result.current.form.setValue('name', ' '));
    act(() => void result.current.submit());

    await waitFor(() => expect(result.current.form.formState.errors.name?.message).toBe('Name it'));
    expect(save).not.toHaveBeenCalled();
  });
});
