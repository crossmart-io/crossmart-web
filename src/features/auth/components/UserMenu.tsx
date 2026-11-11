import { LogOut } from 'lucide-react';
import { Link } from 'react-router';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeSubMenu } from '@/components/theme/ThemeSubMenu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserMenuLink } from '@/config/navigation';
import { useSession } from '../hooks/useSession';
import { useSignOut } from '../hooks/useSignOut';
import { toInitials } from '../initials';

function UserMenuLinks({ links }: { links: readonly UserMenuLink[] }) {
  if (links.length === 0) return null;
  return (
    <>
      <DropdownMenuGroup>
        {links.map((link) => (
          <DropdownMenuItem key={link.to} asChild>
            <Link to={link.to}>
              <link.icon />
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
    </>
  );
}

/** The signed-in person's menu: their own pages (`links`), the theme, and signing out. */
export function UserMenu({ links = [] }: { links?: readonly UserMenuLink[] }) {
  const { data: session } = useSession();
  const signOut = useSignOut();
  if (!session) return null;

  const { name, email } = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
          <Avatar className="size-8">
            <AvatarFallback>{toInitials(name || email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate font-medium text-foreground">{name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserMenuLinks links={links} />
        <DropdownMenuGroup>
          <ThemeSubMenu />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={signOut.isPending} onSelect={() => signOut.mutate()}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
