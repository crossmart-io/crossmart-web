import { useWatch } from 'react-hook-form';
import { SettingsFormCard } from '@/components/forms/SettingsFormCard';
import { useSaveableForm } from '@/hooks/useSaveableForm';
import { useUpdatePricing } from '../hooks/useConnectionRules';
import type { PricingRule } from '../listings.types';
import {
  pricingRuleFormSchema,
  type PricingRuleFormValues,
  toPreviewRule,
  toPricingRule,
  toPricingRuleForm,
} from '../pricing-rule-form';
import { PricingExample } from './PricingExample';
import {
  AdjustmentFields,
  CompareAtField,
  ConversionField,
  FloorField,
  RoundingField,
} from './PricingRuleFields';
import { PRICING_RULE_COPY } from '../listings.constants';

interface PricingRuleCardProps {
  workspaceId: string;
  /** Lets a link scroll straight to the rule (`#pricing`). */
  id?: string;
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
  id,
  connectionId,
  currency,
  catalogCurrency,
  rule,
  canManage,
}: PricingRuleCardProps) {
  const save = useUpdatePricing({ workspaceId, connectionId });
  const { form, submit } = useSaveableForm({
    schema: pricingRuleFormSchema,
    defaults: toPricingRuleForm(rule),
    save: (values) => save.mutateAsync(toPricingRule(values)),
    toForm: (saved) => toPricingRuleForm(saved.pricing),
    // The live example depends on a valid rule, so say what is wrong as the merchant types.
    mode: 'onChange',
  });
  const values = useWatch({ control: form.control }) as PricingRuleFormValues;

  return (
    <SettingsFormCard
      id={id}
      title={PRICING_RULE_COPY.title}
      description={PRICING_RULE_COPY.description}
      form={form}
      onSubmit={submit}
      canManage={canManage}
      saveLabel={PRICING_RULE_COPY.save}
      saveError={save.error}
      contentClassName="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"
      after={
        <PricingExample
          workspaceId={workspaceId}
          connectionId={connectionId}
          rule={toPreviewRule(values)}
        />
      }
    >
      {catalogCurrency !== currency && <ConversionField from={catalogCurrency} to={currency} />}
      <AdjustmentFields currency={currency} />
      <RoundingField />
      <FloorField />
      <CompareAtField />
    </SettingsFormCard>
  );
}
