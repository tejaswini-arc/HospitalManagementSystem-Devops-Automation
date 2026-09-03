const KEYS = {
  JWT: 'hms_jwt',
  USER_ID: 'hms_userId',
  ROLES: 'hms_roles',
}

export const storeToken = (jwt) => localStorage.setItem(KEYS.JWT, jwt)
export const getToken = () => localStorage.getItem(KEYS.JWT)
export const removeToken = () => localStorage.removeItem(KEYS.JWT)

export const storeUserId = (id) => localStorage.setItem(KEYS.USER_ID, String(id))
export const getUserId = () => {
  const v = localStorage.getItem(KEYS.USER_ID)
  return v ? Number(v) : null
}

export const storeRoles = (roles) => localStorage.setItem(KEYS.ROLES, JSON.stringify(roles))
export const getRoles = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.ROLES)) || []
  } catch {
    return []
  }
}

export const clearAll = () => {
  localStorage.removeItem(KEYS.JWT)
  localStorage.removeItem(KEYS.USER_ID)
  localStorage.removeItem(KEYS.ROLES)
}
