import { SunMoon } from 'lucide-react';
import {
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { parseEnum } from '@/lib/enum';
import { THEME_OPTIONS, Theme } from './theme.constants';
import { useTheme } from './useTheme';

/** Light, dark or system, for menus that already hold account settings. */
export function ThemeSubMenu() {
  const { theme, setTheme } = useTheme();

  function selectTheme(value: string) {
    const next = parseEnum(Theme, value);
    if (next) setTheme(next);
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SunMoon />
        Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={theme} onValueChange={selectTheme}>
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                <Icon />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
