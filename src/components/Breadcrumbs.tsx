"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="text-sm mb-4">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            Home
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          return (
            <li key={segment} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-500">{segment}</span>
              ) : (
                <Link href={href} className="text-blue-500 hover:text-blue-700">
                  {segment}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}