import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpdatePricing } from '../hooks/useConnectionRules';
import type { PricingRule } from '../listings.types';
import {
  pricingRuleFormSchema,
  type PricingRuleFormValues,
  toPreviewRule,
  toPricingRule,
  toPricingRuleForm,
} from '../pricing-rule-form';
import { CardSaveFooter } from './CardSaveFooter';
import { PricingExample } from './PricingExample';
import {
  AdjustmentFields,
  CompareAtField,
  ConversionField,
  FloorField,
  RoundingField,
} from './PricingRuleFields';

const PRICING_DESCRIPTION =
  'Prices in this store follow the rule unless a product sets its own price for it. Saving ' +
  'sends the new prices to the store at once.';

interface PricingRuleCardProps {
  workspaceId: string;
  connectionId: string;
  /** The store's currency. */
  currency: string;
  /** The workspace's currency, which catalog prices are in. */
  catalogCurrency: string;
  rule: PricingRule | null;
  canManage: boolean;
}

/** How this channel prices products: the rule's fields, and the rule applied live to a product. */
export function PricingRuleCard({
  workspaceId,
  connectionId,
  currency,
  catalogCurrency,
  rule,
  canManage,
}: PricingRuleCardProps) {
  const form = useForm<PricingRuleFormValues>({
    resolver: zodResolver(pricingRuleFormSchema),
    defaultValues: toPricingRuleForm(rule),
    // The live example depends on a valid rule, so say what is wrong as the merchant types.
    mode: 'onChange',
  });
  const values = useWatch({ control: form.control }) as PricingRuleFormValues;
  const save = useUpdatePricing({ workspaceId, connectionId });
  const submit = form.handleSubmit(async (submitted) => {
    const saved = await save.mutateAsync(toPricingRule(submitted));
    form.reset(toPricingRuleForm(saved.pricing));
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Pricing</h2>
        </CardTitle>
        <CardDescription>{PRICING_DESCRIPTION}</CardDescription>
      </CardHeader>
      <FormProvider {...form}>
        <form onSubmit={(event) => void submit(event)} noValidate>
          <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <fieldset disabled={!canManage} className="flex min-w-0 flex-col gap-5">
              {catalogCurrency !== currency && (
                <ConversionField from={catalogCurrency} to={currency} />
              )}
              <AdjustmentFields currency={currency} />
              <RoundingField />
              <FloorField />
              <CompareAtField />
            </fieldset>
            <PricingExample
              workspaceId={workspaceId}
              connectionId={connectionId}
              rule={toPreviewRule(values)}
            />
          </CardContent>
          {canManage && (
            <CardSaveFooter
              label="Save and apply"
              error={save.error}
              isSaving={form.formState.isSubmitting}
              disabled={!form.formState.isDirty}
            />
          )}
        </form>
      </FormProvider>
    </Card>
  );
}
