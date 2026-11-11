import type { FormEvent, ReactNode } from 'react';
import { type FieldValues, FormProvider, type UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FormError } from '@/components/feedback/FormError';
import { CardSaveFooter } from './CardSaveFooter';
import { useSaveGroupMember } from './save-group';

interface SettingsFormCardProps<Values extends FieldValues, Output> {
  title: string;
  /** Lets a link scroll straight to this card (`#id`). */
  id?: string;
  /** A short line under the title; leave it out when the fields speak for themselves. */
  description?: ReactNode;
  form: UseFormReturn<Values, unknown, Output>;
  /** Saves the form; awaited when the card is part of a save group. */
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void | Promise<void>;
  /** Without it the fields are read-only and there is no save button. */
  canManage: boolean;
  saveLabel: string;
  saveError: Error | null;
  /** Save only once something changed. Off when saving the defaults finishes a setup. */
  requireChanges?: boolean;
  /** Before the fields, such as a warning. */
  before?: ReactNode;
  /** After the fields, such as a live preview or related actions. */
  after?: ReactNode;
  /** Layout of the card's content: the fields, with `before` and `after`. */
  contentClassName?: string;
  /** The fields, disabled together without `canManage`. */
  children: ReactNode;
}

/**
 * A settings card holding one form: its heading, fields, and a save button with the last error.
 * Inside a `SaveGroupProvider` the group's bar saves it instead, and the card has no button.
 */
export function SettingsFormCard<Values extends FieldValues, Output>({
  title,
  id,
  description,
  form,
  onSubmit,
  canManage,
  saveLabel,
  saveError,
  requireChanges = true,
  before,
  after,
  contentClassName,
  children,
}: SettingsFormCardProps<Values, Output>) {
  const { isDirty, isSubmitting } = form.formState;
  const inGroup = useSaveGroupMember({
    dirty: canManage && isDirty,
    pending: canManage && !requireChanges,
    save: async () => onSubmit(),
    discard: () => form.reset(),
  });
  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <FormProvider {...form}>
        <form onSubmit={(event) => void onSubmit(event)} noValidate>
          <CardContent className={cn('flex flex-col gap-6', contentClassName)}>
            {before}
            <fieldset disabled={!canManage} className="flex min-w-0 flex-col gap-5">
              {children}
            </fieldset>
            {after}
            {inGroup && <FormError error={saveError} className="col-span-full" />}
          </CardContent>
          {canManage && !inGroup && (
            <CardSaveFooter
              label={saveLabel}
              error={saveError}
              isSaving={isSubmitting}
              disabled={requireChanges && !isDirty}
            />
          )}
        </form>
      </FormProvider>
    </Card>
  );
}
