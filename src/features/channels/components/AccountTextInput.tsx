import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import type { TextAccountPrompt } from '../channels.constants';

interface AccountTextInputProps {
  id: string;
  prompt: TextAccountPrompt;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

/** A typed account, such as a store domain, with an optional suffix after it. */
export function AccountTextInput({ id, prompt, value, onChange, disabled }: AccountTextInputProps) {
  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={prompt.placeholder}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        required
        disabled={disabled}
      />
      {prompt.suffix && (
        <InputGroupAddon align="inline-end">
          <InputGroupText>{prompt.suffix}</InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
