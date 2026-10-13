import { UserRole } from '../types';

/**
 * ============================================================================
 * STRIDE CENTRALIZED ROLE & AUTHORIZATION MODULE (DEMO-ONLY SIMULATION)
 * ============================================================================
 *
 * NOTE: Roles and session states managed in this file are for DEMO / PROTOTYPE
 * purposes only. In a production environment:
 * 1. Roles and claims MUST be issued as cryptographically signed JWT tokens or
 *    verified via secure HTTP-only session cookies from the backend.
 * 2. All protected actions (e.g., viewing athlete directories, applying to schemes)
 *    MUST be enforced server-side via trusted API middleware.
 * 3. Client-side route checks provide user UX gating and must never be treated
 *    as absolute security barriers without backend enforcement.
 */

export const DEMO_ROLES = {
  ATHLETE: 'athlete' as const,
  SCOUT: 'scout' as const,
} as const;

export const VALID_ROLES: readonly UserRole[] = ['athlete', 'scout'] as const;

export const DEFAULT_ROLE: UserRole = 'athlete';

/**
 * Validates whether an untrusted value matches an allowed system role.
 * Prevents arbitrary injection of roles via localStorage or frontend tampering.
 */
export function isValidRole(role: unknown): role is UserRole {
  return typeof role === 'string' && (VALID_ROLES as readonly string[]).includes(role);
}

/**
 * Sanitizes an untrusted role string, defaulting to 'athlete' if invalid.
 */
export function sanitizeRole(role: unknown): UserRole {
  if (isValidRole(role)) {
    return role;
  }
  return DEFAULT_ROLE;
}

/**
 * Centralized permissions descriptor for demo roles.
 */
export interface RolePermissions {
  canAccessOpportunities: boolean;
  canApplyToOpportunities: boolean;
  canAccessScoutHQ: boolean;
  canAccessAthleteDirectory: boolean;
  canManageSavedAthletes: boolean;
  canAccessAthleteDashboard: boolean;
  canAccessAssessments: boolean;
  canAccessVerification: boolean;
  homePath: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  athlete: {
    canAccessOpportunities: true,
    canApplyToOpportunities: true,
    canAccessScoutHQ: false,
    canAccessAthleteDirectory: false,
    canManageSavedAthletes: false,
    canAccessAthleteDashboard: true,
    canAccessAssessments: true,
    canAccessVerification: true,
    homePath: '/dashboard',
  },
  scout: {
    canAccessOpportunities: false,
    canApplyToOpportunities: false,
    canAccessScoutHQ: true,
    canAccessAthleteDirectory: true,
    canManageSavedAthletes: true,
    canAccessAthleteDashboard: false,
    canAccessAssessments: false,
    canAccessVerification: false,
    homePath: '/scout/dashboard',
  },
};

/**
 * Centralized authorization check for routes.
 * Checks whether the given role is authorized to view a specific pathname.
 */
export function isRouteAllowedForRole(role: unknown, pathname: string): boolean {
  const safeRole = sanitizeRole(role);

  // Opportunities routes are exclusively accessible to athletes
  if (pathname === '/opportunities' || pathname.startsWith('/opportunities/')) {
    return safeRole === 'athlete';
  }

  // Coach/Scout portal routes are exclusively accessible to coaches/scouts
  if (pathname.startsWith('/scout')) {
    return safeRole === 'scout';
  }

  // Common routes: /, /login, /register, /profile, /settings, /notifications, etc.
  return true;
}

/**
 * Computes the target redirect route when a user attempts an unauthorized navigation.
 */
export function getRedirectForUnauthorizedRole(role: unknown, _targetPath?: string): string {
  const safeRole = sanitizeRole(role);

  if (safeRole === 'scout') {
    // If a coach/scout attempts to access athlete-only routes like /opportunities,
    // redirect them to Scout HQ
    return '/scout/dashboard';
  }

  // If an athlete attempts to access coach/scout routes, redirect to Athlete Dashboard
  return '/dashboard';
}
