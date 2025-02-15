'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/app/components/breadcrumb';
import { usePathname } from 'next/navigation';

const Breadcrumbs = ({}) => {
  let pathname = usePathname();
  const links = pathname.split('/').slice(1);

  if (links.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-primary-foreground justify-start">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {links.map((link, index) => {
          const href = `/${links.slice(0, index + 1).join('/')}`;

          return (
            <div className="flex items-center" key={link + index}>
              <BreadcrumbSeparator>
                <div className="w-1.5 h-1.5 rounded-full bg-customPrimary m-2"></div>
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={href}>{link}</BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
