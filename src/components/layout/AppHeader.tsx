import { Link } from 'react-router';
import { ROUTES } from '@/config/routes';

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-4 sm:px-6">
        <Link to={ROUTES.home} className="font-heading text-lg font-semibold tracking-tight">
          crossmart
        </Link>
      </div>
    </header>
  );
}
