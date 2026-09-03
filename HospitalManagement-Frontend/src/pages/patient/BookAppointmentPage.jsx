import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/apiClient'
import { useAuth } from '../../hooks/useAuth'
import { resolveErrorMessage } from '../../utils/errorHandler'

export default function BookAppointmentPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ doctorId: '', appointmentTime: '', reason: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    apiClient.get('/public/doctors')
      .then((r) => setDoctors(r.data))
      .catch((e) => setError(resolveErrorMessage(e)))
  }, [])

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null); setLoading(true)
    try {
      await apiClient.post('/patients/appointments', {
        doctorId: Number(form.doctorId),
        patientId: user.userId,
        appointmentTime: new Date(form.appointmentTime).toISOString(),
        reason: form.reason,
      })
      navigate('/patient/profile')
    } catch (e) {
      setError(resolveErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '480px' }}>
      <h2>Book Appointment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Select Doctor</label>
          <select name="doctorId" value={form.doctorId} onChange={handleChange} required style={styles.input}>
            <option value="">Choose a doctor…</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Appointment Date & Time</label>
          <input name="appointmentTime" type="datetime-local" value={form.appointmentTime}
            onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Reason for Visit</label>
          <textarea name="reason" value={form.reason} onChange={handleChange} required
            rows={3} placeholder="Describe your symptoms or reason…" style={{ ...styles.input, resize: 'vertical' }} />
        </div>
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Booking…' : 'Book Appointment'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  form: { background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { fontSize: '0.875rem', fontWeight: 600, color: '#333' },
  input: { padding: '0.65rem 0.9rem', border: '1.5px solid #d1d5db', borderRadius: '6px', fontSize: '0.95rem' },
  btn: { padding: '0.75rem', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
}
