import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { detectRole } from '../utils/roleDetection'
import { getRoleDashboardPath } from '../utils/jwtUtils'
import { storeToken } from '../utils/tokenStore'
import { resolveErrorMessage } from '../utils/errorHandler'

/**
 * Handles the Google OAuth2 callback.
 * The Spring Boot OAuth2SuccessHandler writes { jwt, userId } as JSON to the response body.
 * We fetch the callback URL to read that JSON.
 */
export default function OAuthCallbackPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const jwt = params.get('jwt')
    const userId = params.get('userId')

    if (jwt && userId) {
      // Backend redirected with query params (alternative flow)
      handleCredentials(jwt, Number(userId))
    } else {
      // Try to fetch the current page body as JSON (direct response body flow)
      fetch(window.location.href)
        .then((r) => r.json())
        .then((data) => {
          if (data.jwt && data.userId) {
            handleCredentials(data.jwt, data.userId)
          } else {
            setError('Google login failed: no credentials received.')
          }
        })
        .catch(() => setError('Google login failed. Please try again.'))
    }
  }, [])

  const handleCredentials = async (jwt, userId) => {
    try {
      storeToken(jwt)
      const roles = await detectRole()
      login(jwt, userId, roles)
      navigate(getRoleDashboardPath(roles), { replace: true })
    } catch (err) {
      setError(resolveErrorMessage(err))
    }
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={{ color: '#c0392b' }}>⚠️ {error}</p>
          <a href="/login" style={{ color: '#1a73e8' }}>Back to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p>Completing Google sign-in…</p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #e3f0ff 0%, #f0f4ff 100%)',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: '#fff', borderRadius: '12px', padding: '2rem',
    textAlign: 'center', boxShadow: '0 4px 24px rgba(26,115,232,0.12)',
  },
}
