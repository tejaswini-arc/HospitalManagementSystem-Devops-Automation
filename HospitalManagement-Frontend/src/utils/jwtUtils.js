/**
 * Decode the payload of a JWT without verifying the signature.
 * @param {string} token
 * @returns {{ sub: string, userId: number, exp: number } | null}
 */
export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * Returns true if the token is expired or invalid.
 * @param {string} token
 */
export function isTokenExpired(token) {
  const payload = decodeJwt(token)
  if (!payload || !payload.exp) return true
  return Date.now() / 1000 > payload.exp
}

/**
 * Returns the dashboard path for the given roles array.
 * @param {string[]} roles
 * @returns {string}
 */
export function getRoleDashboardPath(roles) {
  if (roles.includes('ADMIN')) return '/admin'
  if (roles.includes('DOCTOR')) return '/doctor'
  return '/patient'
}
