import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import { useAuth } from '../hooks/useAuth'
import { getRoleDashboardPath } from '../utils/jwtUtils'
import { resolveErrorMessage } from '../utils/errorHandler'

export default function SignupPage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && user) {
    return <Navigate to={getRoleDashboardPath(user.roles)} replace />
  }

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await apiClient.post('/auth/signup', {
        name: form.name,
        username: form.username,
        password: form.password,
        roles: ['PATIENT'],
      })
      navigate('/login')
    } catch (err) {
      setError(resolveErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.logo}>🏥</span>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Register as a patient</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} style={styles.closeBtn}>✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="name" style={styles.label}>Full Name</label>
            <input id="name" name="name" type="text" value={form.name}
              onChange={handleChange} placeholder="Your full name" required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label htmlFor="username" style={styles.label}>Username / Email</label>
            <input id="username" name="username" type="text" value={form.username}
              onChange={handleChange} placeholder="Username or email" required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input id="password" name="password" type="password" value={form.password}
              onChange={handleChange} placeholder="Create a password" required style={styles.input} />
          </div>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.footerLink}>Sign in</Link>
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
    width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(26,115,232,0.12)',
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
    fontSize: '0.95rem', outline: 'none',
  },
  submitBtn: {
    marginTop: '0.5rem', padding: '0.75rem', background: '#1a73e8', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
  },
  footer: { textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#666' },
  footerLink: { color: '#1a73e8', fontWeight: 600, textDecoration: 'none' },
}
