'use client';

import { getPackageName } from '@/lib/utils/accessControl';

interface PackageBadgeProps {
  packageId: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function PackageBadge({ packageId, size = 'md' }: PackageBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const colorClasses = packageId
    ? 'bg-purple-100 dark:bg-tiktok-lightGray text-purple-700 dark:text-tiktok-cyan border-purple-300 dark:border-tiktok-cyan'
    : 'bg-gray-100 dark:bg-tiktok-lightGray text-gray-600 dark:text-white border-gray-300 dark:border-gray-500';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${colorClasses} ${sizeClasses[size]}`}
    >
      {getPackageName(packageId)}
    </span>
  );
}
