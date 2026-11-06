import { Fragment } from 'react';
import { Link } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from './useBreadcrumbs';

/** Where the current page sits. Parents link back; the last crumb is the page itself. */
export function HeaderBreadcrumbs() {
  const { crumbs } = useBreadcrumbs();
  const lastIndex = crumbs.length - 1;

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {crumbs.map((crumb, index) => (
          <Fragment key={`${index}-${crumb.label}`}>
            {index > 0 && <BreadcrumbSeparator className="hidden sm:block" />}
            <BreadcrumbItem className={index < lastIndex ? 'hidden sm:inline-flex' : 'min-w-0'}>
              {index === lastIndex ? (
                <BreadcrumbPage dir="auto" title={crumb.label} className="block truncate">
                  {crumb.label}
                </BreadcrumbPage>
              ) : crumb.to ? (
                <BreadcrumbLink asChild>
                  <Link to={crumb.to}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <span>{crumb.label}</span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
