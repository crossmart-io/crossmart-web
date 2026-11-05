import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductThumbnailProps {
  url: string | null;
  alt: string;
  className?: string;
}

export function ProductThumbnail({ url, alt, className }: ProductThumbnailProps) {
  return (
    <div
      className={cn(
        'grid size-10 shrink-0 place-items-center overflow-hidden rounded-md border bg-muted',
        className,
      )}
    >
      {url ? (
        <img src={url} alt={alt} loading="lazy" className="size-full object-cover" />
      ) : (
        <Package className="size-4 text-muted-foreground" aria-hidden="true" />
      )}
    </div>
  );
}
