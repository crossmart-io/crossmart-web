import type { ReactNode } from 'react';
import { DESKTOP_MEDIA_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';
import { EssentialsCard } from './EssentialsCard';
import { MediaCard } from './MediaCard';
import { MoreDetailsCard } from './MoreDetailsCard';
import { StatusCard } from './StatusCard';
import { TitleDescriptionCard } from './TitleDescriptionCard';

interface ProductEditorLayoutProps {
  workspaceId: string;
  /** The saved product; AI writing and the status card need one. Absent while creating. */
  productId?: string;
  currency: string;
  /** With options, price and stock are edited per variant under More details. */
  hasOptions: boolean;
  onPendingUploadsChange: (count: number) => void;
  /** Extra cards for the side column, such as the product's recent activity. */
  aside?: ReactNode;
  /** Where the product is listed, or the stores to publish a new one to. */
  channels?: ReactNode;
  /** Disables the product's own fields; the channels and side cards keep their links. */
  readOnly?: boolean;
}

/** The product's own fields, disabled together for roles that may not edit them. */
function FieldGroup({ readOnly, children }: { readOnly: boolean; children: ReactNode }) {
  return (
    <fieldset disabled={readOnly} className="flex min-w-0 flex-col gap-6">
      {children}
    </fieldset>
  );
}

/**
 * Photos, words, price, condition and quantity first, the rest folded under More details;
 * status and stores on the right. A new product has no status card: its save buttons choose.
 */
export function ProductEditorLayout(props: ProductEditorLayoutProps) {
  const { workspaceId, productId, currency, hasOptions, readOnly = false } = props;
  // On one column, status comes first: it is what sellers check before anything else.
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const status = productId && (
    <FieldGroup readOnly={readOnly}>
      <StatusCard />
    </FieldGroup>
  );
  return (
    // minmax(0, 1fr) on one column too: otherwise the widest card sets the page width on phones.
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <FieldGroup readOnly={readOnly}>
        {!isDesktop && status}
        <MediaCard workspaceId={workspaceId} onPendingChange={props.onPendingUploadsChange} />
        <TitleDescriptionCard aiTarget={productId ? { workspaceId, productId } : undefined} />
        <EssentialsCard currency={currency} hasOptions={hasOptions} />
        <MoreDetailsCard currency={currency} hasOptions={hasOptions} />
      </FieldGroup>
      <div className="flex min-w-0 flex-col gap-6">
        {isDesktop && status}
        {props.channels}
        {props.aside}
      </div>
    </div>
  );
}
