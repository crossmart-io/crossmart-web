import { z } from 'zod';
import { OutOfStockPolicy, ProductStatus } from '@/api/schema';

/** Mirrors the API: up to 10 integer digits and 2 decimals. */
const AMOUNT_PATTERN = /^\d{1,10}(\.\d{1,2})?$/;
const INTEGER_PATTERN = /^-?\d+$/;
const NON_NEGATIVE_INTEGER_PATTERN = /^\d+$/;

export const MAX_OPTIONS = 3;
export const MAX_VARIANTS = 250;
export const MAX_TEXT_LENGTH = 255;

const AMOUNT_MESSAGE = 'Enter an amount like 19.90';

const amount = z.string().trim().regex(AMOUNT_PATTERN, AMOUNT_MESSAGE);
const optionalAmount = z
  .string()
  .trim()
  .refine((value) => value === '' || AMOUNT_PATTERN.test(value), AMOUNT_MESSAGE);
const optionalText = z.string().trim().max(MAX_TEXT_LENGTH);

export const variantFormSchema = z.object({
  id: z.string().optional(),
  optionValues: z.array(z.string()),
  sku: optionalText,
  barcode: optionalText,
  price: amount,
  compareAtPrice: optionalAmount,
  cost: optionalAmount,
  weightGrams: z
    .string()
    .trim()
    .refine((value) => value === '' || NON_NEGATIVE_INTEGER_PATTERN.test(value), 'Whole grams'),
  requiresShipping: z.boolean(),
  taxable: z.boolean(),
  outOfStockPolicy: z.enum(OutOfStockPolicy),
  tracked: z.boolean(),
  quantity: z.string().trim().regex(INTEGER_PATTERN, 'Enter a whole number'),
});

export const optionFormSchema = z.object({
  name: z.string().trim().min(1, 'Name the option').max(MAX_TEXT_LENGTH),
  values: z.array(z.string()).min(1, 'Add at least one value'),
});

export const productFormSchema = z
  .object({
    title: z.string().trim().min(1, 'A product needs a title').max(MAX_TEXT_LENGTH),
    handle: z.string().trim().max(MAX_TEXT_LENGTH),
    descriptionHtml: z.string(),
    status: z.enum(ProductStatus),
    vendor: optionalText,
    productType: optionalText,
    tags: z.array(z.string()),
    media: z.array(z.object({ url: z.string(), altText: z.string() })),
    options: z.array(optionFormSchema).max(MAX_OPTIONS),
    variants: z.array(variantFormSchema).min(1).max(MAX_VARIANTS),
  })
  .superRefine(({ options }, context) => {
    const names = options.map((option) => option.name.trim().toLowerCase());
    names.forEach((name, index) => {
      if (name && names.indexOf(name) !== index) {
        context.addIssue({
          code: 'custom',
          path: ['options', index, 'name'],
          message: 'Option names must be different',
        });
      }
    });
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type VariantFormValues = z.infer<typeof variantFormSchema>;
export type OptionFormValues = z.infer<typeof optionFormSchema>;
