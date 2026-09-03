import { useEffect, useState } from 'react'
import apiClient from '../../api/apiClient'
import { resolveErrorMessage } from '../../utils/errorHandler'

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)

  const load = () => {
    apiClient.get('/admin/patients', { params: { page, size: 10 } })
      .then((r) => setPatients(r.data))
      .catch((e) => setError(resolveErrorMessage(e)))
  }

  useEffect(() => { load() }, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return
    try {
      await apiClient.delete(`/patients/delete/${id}`)
      setMsg('Patient deleted.'); load()
    } catch (e) { setError(resolveErrorMessage(e)) }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/patients/update/${editing.id}`, editing)
      setMsg('Patient updated.'); setEditing(null); load()
    } catch (e) { setError(resolveErrorMessage(e)) }
  }

  return (
    <div>
      <h2>Patients</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {msg && <p style={{ color: 'green' }}>{msg}</p>}

      {editing && (
        <div style={styles.modal}>
          <h3>Edit Patient</h3>
          <form onSubmit={handleUpdate} style={styles.form}>
            {['name', 'gender', 'bloodGroup'].map((f) => (
              <input key={f} placeholder={f} value={editing[f] || ''} style={styles.input}
                onChange={(e) => setEditing((p) => ({ ...p, [f]: e.target.value }))} />
            ))}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={styles.btn}>Save</button>
              <button type="button" onClick={() => setEditing(null)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>{['ID', 'Name', 'Gender', 'Blood Group', 'Birth Date', 'Actions'].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td style={styles.td}>{p.id}</td>
              <td style={styles.td}>{p.name}</td>
              <td style={styles.td}>{p.gender}</td>
              <td style={styles.td}>{p.bloodGroup}</td>
              <td style={styles.td}>{p.birthDate}</td>
              <td style={styles.td}>
                <button onClick={() => setEditing(p)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(p.id)} style={styles.delBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} style={styles.btn}>Prev</button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage((p) => p + 1)} style={styles.btn}>Next</button>
      </div>
    </div>
  )
}

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' },
  th: { background: '#1a73e8', color: '#fff', padding: '0.75rem', textAlign: 'left' },
  td: { padding: '0.65rem', borderBottom: '1px solid #e5e7eb' },
  btn: { padding: '0.4rem 0.8rem', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  cancelBtn: { padding: '0.4rem 0.8rem', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  editBtn: { marginRight: '0.4rem', padding: '0.3rem 0.6rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  delBtn: { padding: '0.3rem 0.6rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  modal: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', maxWidth: '400px' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: { padding: '0.6rem', border: '1.5px solid #d1d5db', borderRadius: '6px' },
}
