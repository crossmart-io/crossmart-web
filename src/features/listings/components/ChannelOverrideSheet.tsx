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
import { ChannelType } from '@/api/schema';
import { AI_WRITER_COPY, ALL_CONTENT_FIELDS, AiRewriteButton } from '@/features/ai-writer';
import { useOverrideAiWriter } from '../hooks/useOverrideAiWriter';
import {
  useAddToStore,
  useClearListingOverride,
  useSaveListingOverride,
} from '../hooks/useProductChannels';
import { OverrideSheetMode } from '../listings.constants';
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
import { MediaOverrideField, TagsOverrideField } from './OverrideTagsAndMediaFields';
import { ChannelCategoryField } from './ChannelCategoryField';
import type { ProductChannelRef } from '../hooks/useProductChannels';

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
  /** Adding saves any overrides first, then adds the product, so it is published with them. */
  mode?: OverrideSheetMode;
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
  submitLabel: string;
}

function OverrideSheetFooter({
  canClear,
  isClearing,
  isSaving,
  onClear,
  submitLabel,
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
        {submitLabel}
      </Button>
    </SheetFooter>
  );
}

interface OverrideSheetHeaderProps {
  isAdding: boolean;
  store: string;
  channelRef: ProductChannelRef;
}

function OverrideSheetHeader({ isAdding, store, channelRef }: OverrideSheetHeaderProps) {
  return (
    <SheetHeader className="pr-12">
      <SheetTitle>{isAdding ? `Add to ${store}` : `Override for ${store}`}</SheetTitle>
      <SheetDescription>
        {isAdding
          ? 'It is published there once you add it. Change anything this store should show differently; empty fields follow the product.'
          : 'Only this store changes. Empty fields follow the product.'}
      </SheetDescription>
      <WriteWithAi channelRef={channelRef} />
    </SheetHeader>
  );
}

/** Rewrites this store's title and description into the form, unsaved. */
function WriteWithAi({ channelRef }: { channelRef: ProductChannelRef }) {
  const writer = useOverrideAiWriter();
  return (
    <div>
      <AiRewriteButton
        target={channelRef}
        fields={ALL_CONTENT_FIELDS}
        label={AI_WRITER_COPY.writeAll}
        prominent
        {...writer}
      />
    </div>
  );
}

/** Every field the store can show differently, in the order a merchant reads the listing. */
function OverrideFieldList({
  channelRef,
  product,
  channel,
  error,
}: {
  channelRef: ProductChannelRef;
  product: OverrideProduct;
  channel: ProductChannel;
  error: Error | null;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4">
      {channel.connection.channel === ChannelType.ebay && (
        <>
          <ChannelCategoryField
            channelRef={channelRef}
            category={channel.listing?.category ?? null}
          />
          <Separator />
        </>
      )}
      <ContentOverrideFields productTitle={product.title} aiTarget={channelRef} />
      <TagsOverrideField />
      <MediaOverrideField imageUrls={product.media.map(({ url }) => url)} />
      <Separator />
      <PriceOverrideFields variants={channel.variants} currency={channel.connection.currencyCode} />
      <Separator />
      <VisibilityField />
      <StockOverrideFields />
      <SaveError error={error} />
    </div>
  );
}

/** What this product shows differently on one channel. Saving queues an update when it is listed. */
export function ChannelOverrideSheet({
  workspaceId,
  product,
  channel,
  open,
  onOpenChange,
  mode = OverrideSheetMode.Edit,
}: ChannelOverrideSheetProps) {
  const ref = { workspaceId, productId: product.id, connectionId: channel.connection.id };
  const isAdding = mode === OverrideSheetMode.Add;
  const store = channel.connection.displayName;
  const form = useForm<OverrideFormValues>({
    resolver: zodResolver(overrideFormSchema),
    defaultValues: toOverrideForm(channel, product),
  });
  const save = useSaveListingOverride(ref);
  const clear = useClearListingOverride(ref);
  const add = useAddToStore(ref);
  const submit = form.handleSubmit(async (values) => {
    if (!isAdding || form.formState.isDirty) {
      await save.mutateAsync(toOverrideBody(values));
    }
    if (isAdding) await add.mutateAsync();
    onOpenChange(false);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
        <FormProvider {...form}>
          <OverrideSheetHeader isAdding={isAdding} store={store} channelRef={ref} />
          <form
            onSubmit={(event) => void submit(event)}
            noValidate
            className="flex min-h-0 flex-1 flex-col"
          >
            <OverrideFieldList
              channelRef={ref}
              product={product}
              channel={channel}
              error={save.error ?? add.error}
            />
            <OverrideSheetFooter
              canClear={Boolean(channel.override)}
              isClearing={clear.isPending}
              isSaving={form.formState.isSubmitting}
              onClear={() => void clear.mutateAsync().then(() => onOpenChange(false))}
              submitLabel={isAdding ? 'Add to store' : 'Save'}
            />
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
