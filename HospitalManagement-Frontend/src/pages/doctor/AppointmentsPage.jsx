import { useEffect, useState } from 'react'
import apiClient from '../../api/apiClient'
import { resolveErrorMessage } from '../../utils/errorHandler'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient.get('/doctors/appointments')
      .then((r) => setAppointments(r.data))
      .catch((e) => setError(resolveErrorMessage(e)))
  }, [])

  return (
    <div>
      <h2>My Appointments</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {appointments.length === 0 && !error && <p style={{ color: '#888' }}>No appointments found.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {appointments.map((a) => (
          <div key={a.id} style={styles.card}>
            <div style={styles.row}>
              <span style={styles.label}>Date & Time</span>
              <span>{new Date(a.appointmentTime).toLocaleString()}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Reason</span>
              <span>{a.reason}</span>
            </div>
            {a.doctor && (
              <div style={styles.row}>
                <span style={styles.label}>Doctor</span>
                <span>{a.doctor.name} — {a.doctor.specialization}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#fff', borderRadius: '8px', padding: '1rem 1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  row: { display: 'flex', gap: '1rem', marginBottom: '0.35rem' },
  label: { fontWeight: 600, minWidth: '110px', color: '#555', fontSize: '0.875rem' },
}
