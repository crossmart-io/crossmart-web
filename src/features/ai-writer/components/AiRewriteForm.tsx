import { CircleAlert } from 'lucide-react';
import { useId, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { AI_WRITER_COPY, INSTRUCTION_MAX_LENGTH, QUICK_INSTRUCTIONS } from '../ai-writer.constants';

interface AiRewriteFormProps {
  isWriting: boolean;
  error: Error | null;
  onSubmit: (instruction: string) => void;
}

/** An optional instruction, typed or picked, then Rewrite. */
export function AiRewriteForm({ isWriting, error, onSubmit }: AiRewriteFormProps) {
  const [instruction, setInstruction] = useState('');
  const inputId = useId();
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSubmit(instruction);
      }}
    >
      <Field>
        <FieldLabel htmlFor={inputId}>{AI_WRITER_COPY.instructionLabel}</FieldLabel>
        <Textarea
          id={inputId}
          rows={2}
          maxLength={INSTRUCTION_MAX_LENGTH}
          placeholder={AI_WRITER_COPY.instructionPlaceholder}
          value={instruction}
          disabled={isWriting}
          onChange={(event) => setInstruction(event.target.value)}
        />
      </Field>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_INSTRUCTIONS.map((quick) => (
          <Button
            key={quick}
            type="button"
            variant="secondary"
            size="xs"
            disabled={isWriting}
            onClick={() => onSubmit(quick)}
          >
            {quick}
          </Button>
        ))}
      </div>
      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" size="sm" className="self-end" disabled={isWriting}>
        {isWriting && <Spinner data-icon="inline-start" />}
        {isWriting ? AI_WRITER_COPY.writing : AI_WRITER_COPY.submit}
      </Button>
    </form>
  );
}
