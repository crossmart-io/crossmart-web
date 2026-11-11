import { ProductCondition } from '@/api/schema';

/** The item's condition in a reseller's words; each store maps it to its own conditions. */
export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = {
  [ProductCondition.NEW]: 'New',
  [ProductCondition.NEW_OTHER]: 'New (other)',
  [ProductCondition.NEW_WITH_DEFECTS]: 'New with defects',
  [ProductCondition.LIKE_NEW]: 'Like new',
  [ProductCondition.REFURBISHED]: 'Refurbished',
  [ProductCondition.USED_EXCELLENT]: 'Used – excellent',
  [ProductCondition.USED_VERY_GOOD]: 'Used – very good',
  [ProductCondition.USED_GOOD]: 'Used – good',
  [ProductCondition.USED_FAIR]: 'Used – fair',
  [ProductCondition.FOR_PARTS]: 'For parts / not working',
};

/** The select's value for no condition: each store then uses its default. */
export const CONDITION_NOT_SET = 'not_set';
export const CONDITION_NOT_SET_LABEL = 'Not set';
