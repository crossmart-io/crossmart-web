import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useFormState } from 'react-hook-form';
import { useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { MORE_DETAILS_COPY } from '../../catalog.constants';
import { hasMoreDetailsError, linksIntoMoreDetails } from '../more-details';
import type { ProductFormValues } from '../product-form.schema';
import { InventorySection } from './InventorySection';
import { OrganizationSection } from './OrganizationSection';
import { PriceExtrasSection } from './PriceExtrasSection';
import { ShippingSection } from './ShippingSection';
import { VariantsSection } from './VariantsSection';

interface MoreDetailsCardProps {
  currency: string;
  /** With options, every variant's price and stock is here, so it starts open. */
  hasOptions: boolean;
}

/** Opens by itself for variants, an invalid field inside, or a link to a section inside. */
function useForcedOpen(hasOptions: boolean): boolean {
  const { errors } = useFormState<ProductFormValues>();
  const { hash } = useLocation();
  return hasOptions || hasMoreDetailsError(errors) || linksIntoMoreDetails(hash);
}

/** Everything a one-of-a-kind listing rarely needs, folded away until asked for. */
export function MoreDetailsCard({ currency, hasOptions }: MoreDetailsCardProps) {
  const [opened, setOpened] = useState(false);
  const forcedOpen = useForcedOpen(hasOptions);
  const open = opened || forcedOpen;
  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpened}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <Button type="button" variant="ghost" className="group -mx-2 w-fit gap-2 px-2">
              <span className="text-sm font-semibold">{MORE_DETAILS_COPY.title}</span>
              <span className="hidden font-normal text-muted-foreground sm:inline">
                {MORE_DETAILS_COPY.summary}
              </span>
              <ChevronDown
                data-icon="inline-end"
                className="transition-transform group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="flex flex-col gap-6 pt-4">
            {!hasOptions && (
              <>
                <PriceExtrasSection currency={currency} />
                <Separator />
                <InventorySection />
                <Separator />
                <ShippingSection />
                <Separator />
              </>
            )}
            <OrganizationSection />
            <Separator />
            <VariantsSection currency={currency} />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
