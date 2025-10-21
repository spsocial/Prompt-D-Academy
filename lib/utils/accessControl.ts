import { UserData } from '@/lib/hooks/useAuth';

/**
 * Check if user can access content based on package hierarchy
 */
export function canAccessContent(
  userPackage: string | null,
  requiredPackage: string
): boolean {
  if (!userPackage) return false;

  const hierarchy: Record<string, number> = {
    free: 0,
    basic: 1,
    allinone: 2,
    pro: 3,
  };

  return hierarchy[userPackage] >= hierarchy[requiredPackage];
}

/**
 * Check if user can access the platform (is authenticated and active)
 */
export function canUserAccess(userData: UserData | null): boolean {
  // Must have user data
  if (!userData) return false;

  // Must be active (approved by admin)
  if (!userData.isActive) return false;

  // Must have a package assigned
  if (!userData.package) return false;

  // Check if package is expired
  if (userData.packageExpiry && userData.packageExpiry < new Date()) {
    return false;
  }

  return true;
}

/**
 * Check if user is admin
 */
export function isAdmin(userData: UserData | null): boolean {
  return userData?.isAdmin === true;
}

/**
 * Get package display name
 */
export function getPackageName(packageId: string | null): string {
  const packageNames: Record<string, string> = {
    free: 'Free',
    basic: 'โฆษณาโปร',
    allinone: 'All-in-One',
    pro: 'Pro Developer',
  };

  return packageId ? packageNames[packageId] || 'ไม่มีแพ็คเกจ' : 'ไม่มีแพ็คเกจ';
}

/**
 * Get provider display name
 */
export function getProviderName(provider: 'email' | 'google'): string {
  return provider === 'google' ? 'Google' : 'Email/Password';
}

/**
 * Get provider icon
 */
export function getProviderIcon(provider: 'email' | 'google'): string {
  return provider === 'google' ? '🌐' : '🔒';
}
