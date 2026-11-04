import { Wordmark } from '@/components/brand/Wordmark';
import { UserMenu } from '@/features/auth';
import { AppNav } from './AppNav';

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-4 sm:px-6">
        <Wordmark />
        <AppNav />
        <div className="ml-auto">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
