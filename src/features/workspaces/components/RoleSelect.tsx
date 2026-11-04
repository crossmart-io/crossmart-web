import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WorkspaceRole } from '@/api/schema';
import type { RoleOption } from '../role-options';

interface RoleSelectProps {
  value: string;
  options: readonly RoleOption[];
  onChange: (option: RoleOption) => void;
  id?: string;
  /** For a select without a visible label, such as one in a table row. */
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

/** Built-in roles, then the workspace's own under their own heading. */
export function RoleSelect({
  value,
  options,
  onChange,
  id,
  ariaLabel,
  disabled,
  className,
}: RoleSelectProps) {
  const builtIn = options.filter((option) => option.assignment.role !== WorkspaceRole.CUSTOM);
  const custom = options.filter((option) => option.assignment.role === WorkspaceRole.CUSTOM);
  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        const option = options.find((candidate) => candidate.value === next);
        if (option) onChange(option);
      }}
    >
      <SelectTrigger id={id} aria-label={ariaLabel} className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <OptionGroup options={builtIn} />
        {custom.length > 0 && <OptionGroup label="This workspace’s roles" options={custom} />}
      </SelectContent>
    </Select>
  );
}

function OptionGroup({ label, options }: { label?: string; options: readonly RoleOption[] }) {
  return (
    <SelectGroup>
      {label && <SelectLabel>{label}</SelectLabel>}
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectGroup>
  );
}
