import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { MultiValueInput, TextValueInput } from './ItemSpecificInputs';

function Values({ initial = [] as string[] }) {
  const [values, setValues] = useState(initial);
  return (
    <MultiValueInput
      id="features"
      label="Features"
      options={['Dishwasher Safe', 'Microwave Safe']}
      values={values}
      onChange={setValues}
      selectionOnly={false}
    />
  );
}

describe('MultiValueInput', () => {
  it('adds each value on Enter or comma, once, without submitting the form', async () => {
    const onSubmit = vi.fn<(event: Event) => void>((event) => event.preventDefault());
    render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent)}>
        <Values />
      </form>,
    );

    await userEvent.type(
      screen.getByRole('combobox', { name: 'Features' }),
      'Dishwasher Safe{Enter}Handmade,Handmade{Enter}',
    );

    expect(onSubmit).not.toHaveBeenCalled();
    const chips = screen.getByRole('list', { name: 'Features values' });
    expect(chips).toHaveTextContent('Dishwasher Safe');
    expect(chips).toHaveTextContent('Handmade');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('removes a value', async () => {
    render(<Values initial={['Handmade', 'Vintage']} />);

    await userEvent.click(screen.getByRole('button', { name: 'Remove Handmade' }));

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('list', { name: 'Features values' })).toHaveTextContent('Vintage');
  });
});

describe('TextValueInput', () => {
  it('suggests eBay’s values while typing', () => {
    render(
      <TextValueInput
        id="brand"
        label="Brand"
        options={['Acme']}
        value=""
        onChange={vi.fn<(value: string) => void>()}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Brand' });
    expect(input).toHaveAttribute('list', 'brand-values');
    expect(document.querySelector('#brand-values option')).toHaveAttribute('value', 'Acme');
  });
});
