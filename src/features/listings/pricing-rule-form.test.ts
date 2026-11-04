import { CompareAtMode, PriceRounding } from '@/api/schema';
import { toPreviewRule, toPricingRule, toPricingRuleForm } from './pricing-rule-form';

const RULE = {
  adjustmentPercent: '15',
  fixedAmount: '-2.50',
  rounding: PriceRounding.ending_99,
  floor: { minMarginPercent: '30' },
  compareAt: CompareAtMode.keep,
};

describe('pricing rule form', () => {
  it('round-trips a saved rule', () => {
    expect(toPricingRule(toPricingRuleForm(RULE))).toEqual(RULE);
  });

  it('starts from a rule that changes nothing, with the floor off', () => {
    const form = toPricingRuleForm(null);

    expect(form).toMatchObject({ adjustmentPercent: '0', floorEnabled: false });
    expect(toPricingRule(form).floor).toBeNull();
  });

  it('previews only valid rules', () => {
    const form = toPricingRuleForm(RULE);

    expect(toPreviewRule({ ...form, adjustmentPercent: '-95' })).toBeNull();
    expect(toPreviewRule({ ...form, fixedAmount: '1.005' })).toBeNull();
    expect(toPreviewRule(form)).toEqual(RULE);
  });
});
