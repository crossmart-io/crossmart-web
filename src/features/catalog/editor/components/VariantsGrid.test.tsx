import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { emptyVariant } from '../variant-sync';
import type { ProductFormValues, VariantFormValues } from '../product-form.schema';
import { emptyProductForm } from '../product-form.mappers';
import { VariantsGrid } from './VariantsGrid';

const COLORS = ['Red', 'Blue', 'Green', 'Black'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

function bigProduct(): ProductFormValues {
  const variants: VariantFormValues[] = COLORS.flatMap((color, colorIndex) =>
    SIZES.map((size) => ({
      ...emptyVariant(),
      optionValues: [color, size],
      price: `${10 + colorIndex}.00`,
      quantity: '2',
    })),
  );
  return {
    ...emptyProductForm(),
    options: [
      { name: 'Color', values: COLORS },
      { name: 'Size', values: SIZES },
    ],
    variants,
  };
}

/** The form under test, to read its values after the user's actions. */
const formHandle: { current: UseFormReturn<ProductFormValues> | null } = { current: null };

function latestValues(): ProductFormValues {
  if (!formHandle.current) throw new Error('The grid is not rendered');
  return formHandle.current.getValues();
}

function Harness({ defaults }: { defaults: ProductFormValues }) {
  const form = useForm<ProductFormValues>({ defaultValues: defaults });
  useEffect(() => {
    formHandle.current = form;
  });
  return (
    <FormProvider {...form}>
      <span data-testid="dirty">{String(form.formState.isDirty)}</span>
      <VariantsGrid currency="USD" />
    </FormProvider>
  );
}

function renderGrid(defaults = bigProduct()) {
  const user = userEvent.setup();
  render(<Harness defaults={defaults} />);
  return user;
}

function groupToggle(color: string) {
  return screen.getByRole('button', { name: new RegExp(`^Color ${color}`) });
}

async function bulkSet(
  user: ReturnType<typeof userEvent.setup>,
  trigger: HTMLElement,
  fieldName: string,
  value: string,
) {
  await user.click(trigger);
  const dialog = await screen.findByRole('dialog');
  await user.click(within(dialog).getByRole('radio', { name: fieldName }));
  await user.type(within(dialog).getByLabelText(/New value/), value);
  await user.click(within(dialog).getByRole('button', { name: 'Apply' }));
}

describe('VariantsGrid', () => {
  it('groups a big product by its first option, closed, with a summary', () => {
    renderGrid();

    const red = groupToggle('Red');
    expect(red).toHaveAttribute('aria-expanded', 'false');
    expect(red).toHaveAccessibleName('Color Red, 5 variants, $10.00, 10 in stock');
    expect(red).toHaveTextContent('Red5 variants · $10.00 · 10 in stock');
    expect(screen.queryByLabelText('Price of Red / XS')).not.toBeVisible();
  });

  it('opens and closes a group as a disclosure', async () => {
    const user = renderGrid();
    const red = groupToggle('Red');

    await user.click(red);
    expect(red).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById(red.getAttribute('aria-controls') ?? '')).toBeVisible();
    expect(screen.getByLabelText('Price of Red / XS')).toBeVisible();

    red.focus();
    await user.keyboard('{Enter}');
    expect(red).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps a small product as one flat list', () => {
    const product = bigProduct();
    renderGrid({ ...product, variants: product.variants.slice(0, 5) });

    expect(screen.queryByRole('button', { name: /^Color Red/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Price of Red / XS')).toBeVisible();
    expect(screen.queryByLabelText('Filter variants')).not.toBeInTheDocument();
  });

  it('sets a price for one group in the form, marking it dirty without saving', async () => {
    const user = renderGrid();
    expect(screen.getByTestId('dirty')).toHaveTextContent('false');

    await bulkSet(
      user,
      screen.getByRole('button', { name: 'Set for this group, Color Blue' }),
      'Price',
      '25.50',
    );

    const prices = latestValues().variants.map((variant) => variant.price);
    expect(prices.slice(5, 10)).toEqual(Array(5).fill('25.50'));
    expect(prices[0]).toBe('10.00');
    expect(prices[10]).toBe('12.00');
    expect(screen.getByTestId('dirty')).toHaveTextContent('true');
    expect(groupToggle('Blue')).toHaveTextContent('$25.50');
  });

  it('is no longer dirty once a bulk edit puts the saved values back', async () => {
    const user = renderGrid();
    const setForRed = () => screen.getByRole('button', { name: 'Set for this group, Color Red' });

    await bulkSet(user, setForRed(), 'Price', '99');
    expect(screen.getByTestId('dirty')).toHaveTextContent('true');
    await bulkSet(user, setForRed(), 'Price', '10.00');

    expect(screen.getByTestId('dirty')).toHaveTextContent('false');
  });

  it('refuses a value the form would reject', async () => {
    const user = renderGrid();

    await user.click(screen.getByRole('button', { name: 'Set for all' }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('radio', { name: 'Available' }));
    await user.type(within(dialog).getByLabelText(/New value/), '1.5{Enter}');

    expect(within(dialog).getByRole('alert')).toHaveTextContent('Enter a whole number');
    expect(latestValues().variants.every((variant) => variant.quantity === '2')).toBe(true);
    expect(screen.getByTestId('dirty')).toHaveTextContent('false');
  });

  it('filters by option and bulk-sets only the variants shown', async () => {
    const user = renderGrid();

    await user.type(screen.getByLabelText('Filter variants'), 'xl');
    expect(screen.getAllByRole('button', { name: /^Color / })).toHaveLength(COLORS.length);
    expect(screen.getByLabelText('Price of Red / XL')).toBeVisible();
    expect(screen.queryByLabelText('Price of Red / XS')).not.toBeInTheDocument();

    await bulkSet(user, screen.getByRole('button', { name: 'Set for shown' }), 'Available', '7');

    const quantities = latestValues().variants.map((variant) => variant.quantity);
    expect(quantities.filter((quantity) => quantity === '7')).toHaveLength(COLORS.length);
    expect(quantities[4]).toBe('7');
    expect(quantities[0]).toBe('2');
  });

  it('says so when nothing matches the filter', async () => {
    const user = renderGrid();

    await user.type(screen.getByLabelText('Filter variants'), 'purple');

    expect(screen.getByText('No variants match this filter.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Set for shown' })).toBeDisabled();
  });
});
