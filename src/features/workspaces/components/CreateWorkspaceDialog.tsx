import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/config/routes';
import { useCreateWorkspace } from '../hooks/useWorkspaceMutations';
import {
  CURRENCY_CHOICES,
  DEFAULT_CURRENCY,
  WORKSPACE_NAME_MAX_LENGTH,
} from '../workspaces.constants';

const FORM_ID = 'create-workspace-form';
const NAME_FIELD_ID = 'workspace-name';
const CURRENCY_FIELD_ID = 'workspace-currency';

interface CreateWorkspaceDialogProps {
  organizationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** A new, empty workspace in the same organization, such as one per client or brand. */
export function CreateWorkspaceDialog({
  organizationId,
  open,
  onOpenChange,
}: CreateWorkspaceDialogProps) {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const create = useCreateWorkspace(organizationId);
  const navigate = useNavigate();

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setName('');
      setCurrency(DEFAULT_CURRENCY);
      create.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    create.mutate(
      { name: name.trim(), currency },
      {
        onSuccess: () => {
          handleOpenChange(false);
          void navigate(ROUTES.home);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a workspace</DialogTitle>
          <DialogDescription>
            A separate catalog, stores and team, such as one per client or brand. You own it.
          </DialogDescription>
        </DialogHeader>
        <FormError error={create.error} />
        <form id={FORM_ID} onSubmit={handleSubmit}>
          <WorkspaceFields
            name={name}
            onNameChange={setName}
            currency={currency}
            onCurrencyChange={setCurrency}
          />
        </form>
        <DialogFooter>
          <Button type="submit" form={FORM_ID} disabled={!name.trim() || create.isPending}>
            {create.isPending && <Spinner data-icon="inline-start" />}
            Create workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface WorkspaceFieldsProps {
  name: string;
  onNameChange: (name: string) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

function WorkspaceFields({ name, onNameChange, currency, onCurrencyChange }: WorkspaceFieldsProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={NAME_FIELD_ID}>Name</FieldLabel>
        <Input
          id={NAME_FIELD_ID}
          value={name}
          maxLength={WORKSPACE_NAME_MAX_LENGTH}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="EU store"
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={CURRENCY_FIELD_ID}>Catalog currency</FieldLabel>
        <Select value={currency} onValueChange={onCurrencyChange}>
          <SelectTrigger id={CURRENCY_FIELD_ID} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_CHOICES.map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>Product prices are in it. It cannot change later.</FieldDescription>
      </Field>
    </FieldGroup>
  );
}
