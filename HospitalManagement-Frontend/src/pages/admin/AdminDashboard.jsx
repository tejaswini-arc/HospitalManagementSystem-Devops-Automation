import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import apiClient from '../../api/apiClient'
import { resolveErrorMessage } from '../../utils/errorHandler'

const ALL_ROLES = ['ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST']

export default function AdminDashboard() {
  const { user } = useAuth()
  const [userId, setUserId] = useState('')
  const [selectedRoles, setSelectedRoles] = useState([])
  const [msg, setMsg] = useState(null)
  const [error, setError] = useState(null)

  const toggleRole = (role) =>
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )

  const handleRoleUpdate = async (e) => {
    e.preventDefault()
    setMsg(null); setError(null)
    try {
      await apiClient.put('/admin/users/roles', { userId: Number(userId), roles: selectedRoles })
      setMsg('Roles updated successfully.')
    } catch (err) {
      setError(resolveErrorMessage(err))
    }
  }

  return (
    <div>
      <h2>Welcome, {user?.username} 👋</h2>
      <p style={{ color: '#555' }}>You are logged in as <strong>Admin</strong>.</p>

      <div style={styles.section}>
        <h3>Update User Roles</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {msg && <p style={{ color: 'green' }}>{msg}</p>}
        <form onSubmit={handleRoleUpdate} style={styles.form}>
          <input
            type="number" placeholder="User ID" value={userId}
            onChange={(e) => setUserId(e.target.value)} required style={styles.input}
          />
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {ALL_ROLES.map((r) => (
              <label key={r} style={styles.checkLabel}>
                <input type="checkbox" checked={selectedRoles.includes(r)} onChange={() => toggleRole(r)} />
                {r}
              </label>
            ))}
          </div>
          <button type="submit" style={styles.btn}>Update Roles</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  section: { background: '#fff', borderRadius: '8px', padding: '1.5rem', maxWidth: '480px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.6rem 0.9rem', border: '1.5px solid #d1d5db', borderRadius: '6px', fontSize: '0.95rem' },
  btn: { padding: '0.65rem', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' },
}
