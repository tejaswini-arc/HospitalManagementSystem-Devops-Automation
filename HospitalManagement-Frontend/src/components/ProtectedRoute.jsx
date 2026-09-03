import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getRoleDashboardPath } from '../utils/jwtUtils'

/**
 * @param {{ allowedRoles?: string[] }} props
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user?.roles) {
    const hasRole = user.roles.some((r) => allowedRoles.includes(r))
    if (!hasRole) {
      return <Navigate to={getRoleDashboardPath(user.roles)} replace />
    }
  }

  return <Outlet />
}
