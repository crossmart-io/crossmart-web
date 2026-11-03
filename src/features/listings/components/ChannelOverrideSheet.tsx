import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { useClearListingOverride, useSaveListingOverride } from '../hooks/useProductChannels';
import type { ProductChannel } from '../listings.types';
import {
  overrideFormSchema,
  type OverrideFormValues,
  type ProductDefaults,
  toOverrideBody,
  toOverrideForm,
} from '../override-form';
import {
  ContentOverrideFields,
  PriceOverrideFields,
  StockOverrideFields,
  VisibilityField,
} from './OverrideFields';

export interface OverrideProduct extends ProductDefaults {
  id: string;
  title: string;
}

interface ChannelOverrideSheetProps {
  workspaceId: string;
  product: OverrideProduct;
  channel: ProductChannel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SaveError({ error }: { error: Error | null }) {
  if (!error) return null;
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}

interface OverrideSheetFooterProps {
  canClear: boolean;
  isClearing: boolean;
  isSaving: boolean;
  onClear: () => void;
}

function OverrideSheetFooter({
  canClear,
  isClearing,
  isSaving,
  onClear,
}: OverrideSheetFooterProps) {
  return (
    <SheetFooter className="flex-row justify-between border-t">
      {canClear ? (
        <Button type="button" variant="ghost" disabled={isClearing} onClick={onClear}>
          Remove overrides
        </Button>
      ) : (
        <span />
      )}
      <Button type="submit" disabled={isSaving}>
        {isSaving && <Spinner data-icon="inline-start" />}
        Save
      </Button>
    </SheetFooter>
  );
}

/** What this product shows differently on one channel. Saving queues an update when it is listed. */
export function ChannelOverrideSheet({
  workspaceId,
  product,
  channel,
  open,
  onOpenChange,
}: ChannelOverrideSheetProps) {
  const ref = { workspaceId, productId: product.id, connectionId: channel.connection.id };
  const form = useForm<OverrideFormValues>({
    resolver: zodResolver(overrideFormSchema),
    defaultValues: toOverrideForm(channel, product),
  });
  const save = useSaveListingOverride(ref);
  const clear = useClearListingOverride(ref);
  const submit = form.handleSubmit(async (values) => {
    await save.mutateAsync(toOverrideBody(values, channel.override));
    onOpenChange(false);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
        <SheetHeader className="pr-12">
          <SheetTitle>Override for {channel.connection.displayName}</SheetTitle>
          <SheetDescription>
            Only this channel changes. Empty fields follow the product.
          </SheetDescription>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            onSubmit={(event) => void submit(event)}
            noValidate
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4">
              <ContentOverrideFields productTitle={product.title} />
              <Separator />
              <PriceOverrideFields
                variants={channel.variants}
                currency={channel.connection.currencyCode}
              />
              <Separator />
              <VisibilityField />
              <StockOverrideFields />
              <SaveError error={save.error} />
            </div>
            <OverrideSheetFooter
              canClear={Boolean(channel.override)}
              isClearing={clear.isPending}
              isSaving={form.formState.isSubmitting}
              onClear={() => void clear.mutateAsync().then(() => onOpenChange(false))}
            />
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
