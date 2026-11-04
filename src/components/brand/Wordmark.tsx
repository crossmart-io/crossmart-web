import { Link } from 'react-router';
import { ROUTES } from '@/config/routes';
import { BrandMark } from './BrandMark';

export function Wordmark() {
  return (
    <Link
      to={ROUTES.home}
      className="inline-flex items-center gap-2 font-heading text-lg font-bold tracking-tight"
    >
      <BrandMark />
      crossmart
    </Link>
  );
}
