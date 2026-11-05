import { renderHook, act } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import type { OverrideFormValues } from '../override-form';
import { useOverrideAiWriter } from './useOverrideAiWriter';

const DEFAULTS = {
  title: '',
  customDescription: false,
  descriptionHtml: '<p>Product description.</p>',
} as OverrideFormValues;

function Wrapper({ children }: PropsWithChildren) {
  const form = useForm<OverrideFormValues>({ defaultValues: DEFAULTS });
  return <FormProvider {...form}>{children}</FormProvider>;
}

function setup() {
  return renderHook(
    () => ({ writer: useOverrideAiWriter(), form: useFormContext<OverrideFormValues>() }),
    { wrapper: Wrapper },
  );
}

describe('useOverrideAiWriter', () => {
  it('leaves out fields that follow the product, so the API rewrites what the store shows', () => {
    const { result } = setup();

    expect(result.current.writer.getCurrent()).toEqual({
      title: undefined,
      descriptionHtml: undefined,
    });
  });

  it('writes a draft as a custom description and undoes it', () => {
    const { result } = setup();

    let undo = () => {};
    act(() => {
      undo = result.current.writer.apply({ title: 'Acme Mug', descriptionHtml: '<p>New.</p>' });
    });
    expect(result.current.form.getValues()).toMatchObject({
      title: 'Acme Mug',
      customDescription: true,
      descriptionHtml: '<p>New.</p>',
    });

    act(() => undo());
    expect(result.current.form.getValues()).toMatchObject(DEFAULTS);
  });
});
