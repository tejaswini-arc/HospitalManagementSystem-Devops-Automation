import { useEffect, useState } from 'react'
import apiClient from '../../api/apiClient'
import { resolveErrorMessage } from '../../utils/errorHandler'

const EMPTY_FORM = { userId: '', name: '', email: '', specialization: '', experience: '', consultationFee: '', degree: '', registrationNumber: '', hospitalName: '' }

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    apiClient.get('/admin/doctors')
      .then((r) => setDoctors(r.data))
      .catch((e) => setError(resolveErrorMessage(e)))
  }, [])

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null); setMsg(null)
    try {
      const res = await apiClient.post('/admin/onBoardNewDoctor', {
        ...form,
        userId: Number(form.userId),
        experience: Number(form.experience),
        consultationFee: Number(form.consultationFee),
      })
      setDoctors((p) => [...p, res.data])
      setMsg('Doctor onboarded successfully.'); setForm(EMPTY_FORM); setShowForm(false)
    } catch (e) { setError(resolveErrorMessage(e)) }
  }

  const fields = [
    { name: 'userId', label: 'User ID', type: 'number' },
    { name: 'name', label: 'Name' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'specialization', label: 'Specialization' },
    { name: 'experience', label: 'Experience (years)', type: 'number' },
    { name: 'consultationFee', label: 'Consultation Fee', type: 'number' },
    { name: 'degree', label: 'Degree' },
    { name: 'registrationNumber', label: 'Registration Number' },
    { name: 'hospitalName', label: 'Hospital Name' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Doctors</h2>
        <button onClick={() => setShowForm((p) => !p)} style={styles.btn}>
          {showForm ? 'Cancel' : '+ Onboard Doctor'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {msg && <p style={{ color: 'green' }}>{msg}</p>}

      {showForm && (
        <div style={styles.formCard}>
          <h3>Onboard New Doctor</h3>
          <form onSubmit={handleSubmit} style={styles.grid}>
            {fields.map((f) => (
              <div key={f.name} style={styles.field}>
                <label style={styles.label}>{f.label}</label>
                <input name={f.name} type={f.type || 'text'} value={form[f.name]}
                  onChange={handleChange} required style={styles.input} />
              </div>
            ))}
            <button type="submit" style={{ ...styles.btn, gridColumn: '1 / -1' }}>Onboard</button>
          </form>
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>{['ID', 'Name', 'Email', 'Specialization'].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id}>
              <td style={styles.td}>{d.id}</td>
              <td style={styles.td}>{d.name}</td>
              <td style={styles.td}>{d.email}</td>
              <td style={styles.td}>{d.specialization}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  btn: { padding: '0.5rem 1rem', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  formCard: { background: '#fff', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: '#555' },
  input: { padding: '0.6rem', border: '1.5px solid #d1d5db', borderRadius: '6px' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' },
  th: { background: '#1a73e8', color: '#fff', padding: '0.75rem', textAlign: 'left' },
  td: { padding: '0.65rem', borderBottom: '1px solid #e5e7eb' },
}
