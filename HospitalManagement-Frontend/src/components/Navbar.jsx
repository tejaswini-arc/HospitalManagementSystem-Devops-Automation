import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  const isAdmin = user.roles.includes('ADMIN')
  const isDoctor = user.roles.includes('DOCTOR')
  const isPatient = user.roles.includes('PATIENT')

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>🏥 Hospital MS</span>
      <div style={styles.links}>
        {isAdmin && (
          <>
            <Link to="/admin" style={styles.link}>Dashboard</Link>
            <Link to="/admin/patients" style={styles.link}>Patients</Link>
            <Link to="/admin/doctors" style={styles.link}>Doctors</Link>
            <Link to="/admin/departments" style={styles.link}>Departments</Link>
          </>
        )}
        {isDoctor && (
          <>
            <Link to="/doctor" style={styles.link}>Dashboard</Link>
            <Link to="/doctor/appointments" style={styles.link}>My Appointments</Link>
          </>
        )}
        {isPatient && (
          <>
            <Link to="/patient" style={styles.link}>Dashboard</Link>
            <Link to="/patient/profile" style={styles.link}>My Profile</Link>
            <Link to="/patient/book" style={styles.link}>Book Appointment</Link>
          </>
        )}
      </div>
      <div style={styles.right}>
        <span style={styles.username}>{user.username}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.75rem 1.5rem', background: '#1a73e8', color: '#fff',
  },
  brand: { fontWeight: 700, fontSize: '1.1rem' },
  links: { display: 'flex', gap: '1rem' },
  link: { color: '#fff', textDecoration: 'none', fontWeight: 500 },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  username: { fontSize: '0.9rem', opacity: 0.9 },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)',
    color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer',
  },
}
