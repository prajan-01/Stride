import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { sanitizeRole, getRedirectForUnauthorizedRole } from '../../lib/auth';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
  redirectTo?: string;
  deniedMessage?: string;
}

/**
 * Route protection wrapper that enforces role-based access control.
 * If the active user role is not within `allowedRoles`, the user is immediately
 * redirected to their role-appropriate home or the designated fallback route.
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children,
  redirectTo,
  deniedMessage,
}) => {
  const { role, isAuthenticated, showToast } = useApp();
  const location = useLocation();
  const lastBlockedRef = useRef<string | null>(null);

  const safeRole = sanitizeRole(role);
  const isRoleAllowed = allowedRoles.includes(safeRole);

  useEffect(() => {
    if (!isAuthenticated) {
      const blockKey = `unauth:${location.pathname}`;
      if (lastBlockedRef.current !== blockKey) {
        lastBlockedRef.current = blockKey;
        showToast('Please sign in to access the sports assessment platform.', 'info');
      }
    } else if (!isRoleAllowed) {
      const blockKey = `${safeRole}:${location.pathname}`;
      if (lastBlockedRef.current !== blockKey) {
        lastBlockedRef.current = blockKey;
        const msg =
          deniedMessage ||
          (safeRole === 'scout'
            ? 'Access Restricted: The Opportunities catalog is exclusively available to athletes. Redirected to Scout HQ.'
            : 'Access Restricted: This portal is reserved for verified coaches and talent scouts.');
        showToast(msg, 'warning');
      }
    } else {
      lastBlockedRef.current = null;
    }
  }, [isAuthenticated, isRoleAllowed, safeRole, location.pathname, deniedMessage, showToast]);

  if (!isAuthenticated) {
    return <Navigate to={`/?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isRoleAllowed) {
    const targetRedirect = redirectTo || getRedirectForUnauthorizedRole(safeRole, location.pathname);
    return <Navigate to={targetRedirect} replace />;
  }

  return children;
};
