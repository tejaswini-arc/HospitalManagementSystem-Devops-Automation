import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export default function PatientDashboard() {
  const { user } = useAuth()
  return (
    <div>
      <h2>Welcome, {user?.username} 👋</h2>
      <p style={{ color: '#555' }}>You are logged in as <strong>Patient</strong>.</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <Link to="/patient/profile" style={styles.card}>
          <span style={styles.icon}>👤</span><span>My Profile</span>
        </Link>
        <Link to="/patient/book" style={styles.card}>
          <span style={styles.icon}>📅</span><span>Book Appointment</span>
        </Link>
      </div>
    </div>
  )
}

const styles = {
  card: {
    display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
    background: '#fff', borderRadius: '8px', padding: '1rem 1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textDecoration: 'none', color: '#1a1a2e', fontWeight: 600,
  },
  icon: { fontSize: '1.5rem' },
}
