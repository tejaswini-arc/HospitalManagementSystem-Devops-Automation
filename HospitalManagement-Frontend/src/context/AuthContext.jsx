import { createContext, useState, useEffect } from 'react'
import {
  storeToken, getToken, storeUserId, getUserId,
  storeRoles, getRoles, clearAll,
} from '../utils/tokenStore'
import { decodeJwt } from '../utils/jwtUtils'

export const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken())
  const [user, setUser] = useState(() => {
    const jwt = getToken()
    const userId = getUserId()
    const roles = getRoles()
    if (!jwt || !userId) return null
    const payload = decodeJwt(jwt)
    return { userId, username: payload?.sub || '', roles }
  })

  const login = (jwt, userId, roles) => {
    storeToken(jwt)
    storeUserId(userId)
    storeRoles(roles)
    const payload = decodeJwt(jwt)
    setToken(jwt)
    setUser({ userId, username: payload?.sub || '', roles })
  }

  const logout = () => {
    clearAll()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}
