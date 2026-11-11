import { zodResolver } from '@hookform/resolvers/zod';
import type { FormEvent } from 'react';
import {
  type DefaultValues,
  type FieldValues,
  type Mode,
  useForm,
  type UseFormReturn,
} from 'react-hook-form';
import type { z } from 'zod';

interface SaveableFormOptions<Values extends FieldValues, Output, Saved> {
  /** Parses what the form holds (`Values`) into what is saved (`Output`). */
  schema: z.ZodType<Output, Values>;
  /** The values the form starts from, usually the saved record's. */
  defaults: Values;
  /** Saves the parsed values, usually a mutation's `mutateAsync`; its error shows inline. */
  save: (values: Output) => Promise<Saved>;
  /** The values to start over from once saved, or `null` to leave the form as it is. */
  toForm: (saved: Saved) => Values | null;
  /** When to validate, as `useForm` takes it. */
  mode?: Mode;
}

interface SaveableForm<Values extends FieldValues, Output> {
  form: UseFormReturn<Values, unknown, Output>;
  /**
   * The form's `onSubmit`, resolved once the save settled. A failed save leaves the form as it
   * was, never an unhandled rejection.
   */
  submit: (event?: FormEvent<HTMLFormElement>) => Promise<void>;
  /** Validates and saves outside a form's submit; resolves to whether it was saved. */
  saveNow: () => Promise<boolean>;
}

/**
 * A form that validates with a zod schema, saves, and restarts from what the API saved, so
 * it is no longer dirty. The caller shows the save's error, from its mutation.
 */
export function useSaveableForm<Values extends FieldValues, Output, Saved>({
  schema,
  defaults,
  save,
  toForm,
  mode,
}: SaveableFormOptions<Values, Output, Saved>): SaveableForm<Values, Output> {
  const form = useForm<Values, unknown, Output>({
    resolver: zodResolver<Values, unknown, Output>(schema),
    // A full set of values is a valid partial one; TypeScript cannot see that for a generic type.
    defaultValues: defaults as DefaultValues<Values>,
    mode,
  });

  async function saveAndReset(values: Output): Promise<boolean> {
    let saved: Saved;
    try {
      saved = await save(values);
    } catch {
      // The mutation holds the error, and the form shows it inline.
      return false;
    }
    const next = toForm(saved);
    if (next) form.reset(next);
    return true;
  }

  /** Resolves to false for invalid values, which `handleSubmit` never passes on. */
  function saveNow(): Promise<boolean> {
    return new Promise((resolve) => {
      void form.handleSubmit(
        async (values) => resolve(await saveAndReset(values)),
        () => resolve(false),
      )();
    });
  }

  return {
    form,
    submit: async (event) => {
      await form.handleSubmit(saveAndReset)(event);
    },
    saveNow,
  };
}
