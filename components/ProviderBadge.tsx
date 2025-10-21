'use client';

import { getProviderIcon, getProviderName } from '@/lib/utils/accessControl';

interface ProviderBadgeProps {
  provider: 'email' | 'google';
  size?: 'sm' | 'md' | 'lg';
}

export function ProviderBadge({ provider, size = 'md' }: ProviderBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const colorClasses = provider === 'google'
    ? 'bg-blue-100 text-blue-700 border-blue-300'
    : 'bg-gray-100 text-gray-700 border-gray-300';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${colorClasses} ${sizeClasses[size]}`}
    >
      <span>{getProviderIcon(provider)}</span>
      <span>{getProviderName(provider)}</span>
    </span>
  );
}
