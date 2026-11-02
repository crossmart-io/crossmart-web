import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { htmlToText } from '@/lib/html-to-text';
import type { Product } from '../catalog.types';
import { ProductThumbnail } from './ProductThumbnail';

/** Base content as it will go to every channel, before per-channel overrides. */
export function ProductOverview({ product }: { product: Product }) {
  const description = htmlToText(product.descriptionHtml);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Base content</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <p className={description ? undefined : 'text-muted-foreground'}>
          {description || 'No description yet.'}
        </p>
        <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2">
          <dt className="text-muted-foreground">Vendor</dt>
          <dd>{product.vendor ?? '—'}</dd>
          <dt className="text-muted-foreground">Type</dt>
          <dd>{product.productType ?? '—'}</dd>
          <dt className="text-muted-foreground">Handle</dt>
          <dd className="font-mono text-xs">{product.handle}</dd>
        </dl>
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {product.media.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.media.map((media) => (
              <ProductThumbnail
                key={media.id}
                url={media.url}
                alt={media.altText ?? product.title}
                className="size-20"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
