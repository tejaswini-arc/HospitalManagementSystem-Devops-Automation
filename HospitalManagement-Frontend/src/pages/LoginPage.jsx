import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import { useAuth } from '../hooks/useAuth'
import { detectRole } from '../utils/roleDetection'
import { getRoleDashboardPath } from '../utils/jwtUtils'
import { resolveErrorMessage } from '../utils/errorHandler'
import { storeToken } from '../utils/tokenStore'

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Already logged in → redirect to dashboard
  if (isAuthenticated && user) {
    return <Navigate to={getRoleDashboardPath(user.roles)} replace />
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await apiClient.post('/auth/login', {
        username: form.username,
        password: form.password,
      })
      const { jwt, userId } = res.data

      // Temporarily store token so role detection calls can use it
      storeToken(jwt)

      const roles = await detectRole()
      login(jwt, userId, roles)
      navigate(getRoleDashboardPath(roles), { replace: true })
    } catch (err) {
      setError(resolveErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.logo}>🏥</span>
          <h1 style={styles.title}>Hospital Management</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} style={styles.closeBtn}>✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="username" style={styles.label}>Username / Email</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username or email"
              required
              autoComplete="username"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine} />
        </div>

        <button onClick={handleGoogleLogin} style={styles.googleBtn}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={{ width: 20, height: 20 }}
          />
          Continue with Google
        </button>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.footerLink}>Sign up</Link>
        </p>
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
    background: '#fff', borderRadius: '12px', padding: '2.5rem',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 4px 24px rgba(26,115,232,0.12)',
  },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  logo: { fontSize: '2.5rem' },
  title: { margin: '0.5rem 0 0.25rem', fontSize: '1.5rem', color: '#1a1a2e', fontWeight: 700 },
  subtitle: { margin: 0, color: '#666', fontSize: '0.9rem' },
  errorBox: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#fff3f3', border: '1px solid #f5c6cb', borderRadius: '6px',
    padding: '0.75rem 1rem', marginBottom: '1rem', color: '#c0392b', fontSize: '0.875rem',
  },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontSize: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { fontSize: '0.875rem', fontWeight: 600, color: '#333' },
  input: {
    padding: '0.65rem 0.9rem', border: '1.5px solid #d1d5db', borderRadius: '6px',
    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
  },
  submitBtn: {
    marginTop: '0.5rem', padding: '0.75rem', background: '#1a73e8', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 600,
    cursor: 'pointer', transition: 'background 0.2s',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0',
  },
  dividerLine: { flex: 1, height: '1px', background: '#e5e7eb' },
  dividerText: { color: '#9ca3af', fontSize: '0.85rem' },
  googleBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
    width: '100%', padding: '0.7rem', background: '#fff',
    border: '1.5px solid #d1d5db', borderRadius: '6px',
    fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer',
    transition: 'background 0.2s', color: '#333',
  },
  footer: { textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#666' },
  footerLink: { color: '#1a73e8', fontWeight: 600, textDecoration: 'none' },
}
