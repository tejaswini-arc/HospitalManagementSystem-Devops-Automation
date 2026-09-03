import { useEffect, useState } from 'react'
import apiClient from '../../api/apiClient'
import { resolveErrorMessage } from '../../utils/errorHandler'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [assignForm, setAssignForm] = useState({ departmentId: '', doctorIds: '' })
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    apiClient.get('/admin/departments/getAll').then((r) => setDepartments(r.data)).catch((e) => setError(resolveErrorMessage(e)))
    apiClient.get('/admin/doctors').then((r) => setDoctors(r.data)).catch(() => {})
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setError(null); setMsg(null)
    try {
      const res = await apiClient.post('/admin/departmentsAdd', form)
      setDepartments((p) => [...p, res.data]); setMsg('Department created.'); setForm({ name: '', description: '' })
    } catch (e) { setError(resolveErrorMessage(e)) }
  }

  const handleAssign = async (e) => {
    e.preventDefault(); setError(null); setMsg(null)
    try {
      const ids = assignForm.doctorIds.split(',').map((s) => Number(s.trim())).filter(Boolean)
      await apiClient.patch(`/admin/departments/${assignForm.departmentId}/assign-doctors`, ids)
      setMsg('Doctors assigned.')
    } catch (e) { setError(resolveErrorMessage(e)) }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      <div>
        <h2>Departments</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {msg && <p style={{ color: 'green' }}>{msg}</p>}
        {departments.map((d) => (
          <div key={d.id} style={styles.card}>
            <strong>{d.name}</strong>
            <p style={{ margin: '0.25rem 0 0', color: '#555', fontSize: '0.875rem' }}>{d.description}</p>
          </div>
        ))}
      </div>

      <div>
        <div style={styles.formCard}>
          <h3>Create Department</h3>
          <form onSubmit={handleCreate} style={styles.form}>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required style={styles.input} />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} style={styles.input} />
            <button type="submit" style={styles.btn}>Create</button>
          </form>
        </div>

        <div style={styles.formCard}>
          <h3>Assign Doctors to Department</h3>
          <form onSubmit={handleAssign} style={styles.form}>
            <select value={assignForm.departmentId} onChange={(e) => setAssignForm((p) => ({ ...p, departmentId: e.target.value }))} required style={styles.input}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input placeholder="Doctor IDs (comma-separated)" value={assignForm.doctorIds}
              onChange={(e) => setAssignForm((p) => ({ ...p, doctorIds: e.target.value }))} required style={styles.input} />
            <button type="submit" style={styles.btn}>Assign</button>
          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#fff', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem', boxShadow: '0 2px 6px rgba(0,0,0,0.07)' },
  formCard: { background: '#fff', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.07)' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: { padding: '0.6rem', border: '1.5px solid #d1d5db', borderRadius: '6px' },
  btn: { padding: '0.6rem', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
}
