import { Wordmark } from '@/components/brand/Wordmark';
import { UserMenu } from '@/features/auth';

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Wordmark />
        <UserMenu />
      </div>
    </header>
  );
}
