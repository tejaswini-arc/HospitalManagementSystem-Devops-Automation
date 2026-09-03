import { useEffect, useState } from 'react'
import apiClient from '../api/apiClient'
import { resolveErrorMessage } from '../utils/errorHandler'

export default function PublicDoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient.get('/public/doctors')
      .then((r) => setDoctors(r.data))
      .catch((e) => setError(resolveErrorMessage(e)))
  }, [])

  return (
    <div>
      <h2>Available Doctors</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '1rem' }}>
        {doctors.map((d) => (
          <div key={d.id} style={styles.card}>
            <h3 style={{ margin: '0 0 0.5rem' }}>{d.name}</h3>
            <p style={styles.spec}>{d.specialization}</p>
            <p style={styles.info}>📧 {d.email}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#fff', borderRadius: '8px', padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  spec: { color: '#1a73e8', fontWeight: 600, margin: '0 0 0.5rem' },
  info: { margin: '0.25rem 0', color: '#555', fontSize: '0.875rem' },
}
