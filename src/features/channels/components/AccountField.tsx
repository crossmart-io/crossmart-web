import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { type AccountPrompt, AccountPromptKind } from '../channels.constants';
import { AccountSelect } from './AccountSelect';
import { AccountTextInput } from './AccountTextInput';

const ACCOUNT_FIELD_ID = 'connect-channel-account';

interface AccountFieldProps {
  prompt: AccountPrompt;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

/** The account to connect: a store's myshopify.com domain, or an eBay marketplace. */
export function AccountField({ prompt, value, onChange, disabled }: AccountFieldProps) {
  const control = { id: ACCOUNT_FIELD_ID, value, onChange, disabled };
  return (
    <Field>
      <FieldLabel htmlFor={ACCOUNT_FIELD_ID}>{prompt.label}</FieldLabel>
      {prompt.kind === AccountPromptKind.Select ? (
        <AccountSelect prompt={prompt} {...control} />
      ) : (
        <AccountTextInput prompt={prompt} {...control} />
      )}
      <FieldDescription>{prompt.description}</FieldDescription>
    </Field>
  );
}
