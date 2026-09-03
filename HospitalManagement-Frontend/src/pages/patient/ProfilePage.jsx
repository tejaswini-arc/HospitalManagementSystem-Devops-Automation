import { useEffect, useState } from 'react'
import apiClient from '../../api/apiClient'
import { useAuth } from '../../hooks/useAuth'
import { resolveErrorMessage } from '../../utils/errorHandler'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    if (!user?.userId) return
    apiClient.get(`/patients/get/profile/${user.userId}`)
      .then((r) => { setProfile(r.data); setForm(r.data) })
      .catch((e) => setError(resolveErrorMessage(e)))
  }, [user])

  const handleUpdate = async (e) => {
    e.preventDefault(); setError(null); setMsg(null)
    try {
      const res = await apiClient.put(`/patients/update/${user.userId}`, form)
      setProfile(res.data); setMsg('Profile updated.'); setEditing(false)
    } catch (e) { setError(resolveErrorMessage(e)) }
  }

  if (!profile) return <p>Loading profile…</p>

  return (
    <div style={{ maxWidth: '500px' }}>
      <h2>My Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {msg && <p style={{ color: 'green' }}>{msg}</p>}

      {!editing ? (
        <div style={styles.card}>
          {[['Name', profile.name], ['Gender', profile.gender], ['Blood Group', profile.bloodGroup], ['Birth Date', profile.birthDate]].map(([l, v]) => (
            <div key={l} style={styles.row}><span style={styles.label}>{l}</span><span>{v || '—'}</span></div>
          ))}
          <button onClick={() => setEditing(true)} style={styles.btn}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} style={styles.form}>
          {['name', 'gender', 'bloodGroup'].map((f) => (
            <div key={f} style={styles.field}>
              <label style={styles.fieldLabel}>{f}</label>
              <input value={form[f] || ''} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))} style={styles.input} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={styles.btn}>Save</button>
            <button type="button" onClick={() => setEditing(false)} style={styles.cancelBtn}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}

const styles = {
  card: { background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  row: { display: 'flex', gap: '1rem', marginBottom: '0.75rem' },
  label: { fontWeight: 600, minWidth: '110px', color: '#555' },
  btn: { marginTop: '1rem', padding: '0.6rem 1.2rem', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  cancelBtn: { marginTop: '1rem', padding: '0.6rem 1.2rem', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  form: { background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  fieldLabel: { fontSize: '0.8rem', fontWeight: 600, color: '#555', textTransform: 'capitalize' },
  input: { padding: '0.6rem', border: '1.5px solid #d1d5db', borderRadius: '6px' },
}
