import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export default function DoctorDashboard() {
  const { user } = useAuth()
  return (
    <div>
      <h2>Welcome, Dr. {user?.username} 👋</h2>
      <p style={{ color: '#555' }}>You are logged in as <strong>Doctor</strong>.</p>
      <Link to="/doctor/appointments" style={styles.card}>
        <span style={styles.icon}>📅</span>
        <span>View My Appointments</span>
      </Link>
    </div>
  )
}

const styles = {
  card: {
    display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
    background: '#fff', borderRadius: '8px', padding: '1rem 1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textDecoration: 'none', color: '#1a1a2e',
    fontWeight: 600, marginTop: '1rem',
  },
  icon: { fontSize: '1.5rem' },
}
