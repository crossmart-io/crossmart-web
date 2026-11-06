import type { FormEvent, ReactNode } from 'react';
import { type FieldValues, FormProvider, type UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CardSaveFooter } from './CardSaveFooter';

interface SettingsFormCardProps<Values extends FieldValues, Output> {
  title: string;
  /** Lets a link scroll straight to this card (`#id`). */
  id?: string;
  description: ReactNode;
  form: UseFormReturn<Values, unknown, Output>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
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

/** A settings card holding one form: its heading, fields, and a save button with the last error. */
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
  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <FormProvider {...form}>
        <form onSubmit={onSubmit} noValidate>
          <CardContent className={cn('flex flex-col gap-6', contentClassName)}>
            {before}
            <fieldset disabled={!canManage} className="flex min-w-0 flex-col gap-5">
              {children}
            </fieldset>
            {after}
          </CardContent>
          {canManage && (
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
