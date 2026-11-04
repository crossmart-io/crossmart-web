import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { OverrideFormValues } from '../override-form';
import { MediaOverrideField, TagsOverrideField } from './OverrideTagsAndMediaFields';

const IMAGES = ['https://cdn.example.com/a.jpg', 'https://cdn.example.com/b.jpg'];
/** Holds the form's values getter, so tests can read what the fields wrote. */
const formRef: { values?: () => OverrideFormValues } = {};
const values = () => formRef.values?.();

function Form({ children }: { children: ReactNode }) {
  const form = useForm<OverrideFormValues>({
    defaultValues: { customTags: false, tags: ['linen'], customMedia: false, mediaUrls: IMAGES },
  });
  useEffect(() => {
    formRef.values = form.getValues;
  }, [form.getValues]);
  return <FormProvider {...form}>{children}</FormProvider>;
}

describe('store tags and images', () => {
  it('edits tags for the store only once asked to', async () => {
    render(
      <Form>
        <TagsOverrideField />
      </Form>,
    );
    expect(screen.queryByLabelText('Tags in this store')).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Use different tags in this store'));
    await userEvent.type(screen.getByLabelText('Tags in this store'), 'summer{Enter}');

    expect(values()).toMatchObject({ customTags: true, tags: ['linen', 'summer'] });
  });

  it('chooses which product images the store shows, keeping their order', async () => {
    render(
      <Form>
        <MediaOverrideField imageUrls={IMAGES} />
      </Form>,
    );

    await userEvent.click(screen.getByLabelText('Show only some images in this store'));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Show picture 1 of 2' }));

    expect(values()).toMatchObject({ customMedia: true, mediaUrls: [IMAGES[1]] });
  });

  it('offers no image choice for a product without images', () => {
    render(
      <Form>
        <MediaOverrideField imageUrls={[]} />
      </Form>,
    );

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
