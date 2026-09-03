import { useEffect, useState } from 'react'
import apiClient from '../../api/apiClient'
import { resolveErrorMessage } from '../../utils/errorHandler'

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setError(null)

    apiClient
      .get('/admin/patients', {
        params: {
          page,
          size: 10,
        },
      })
      .then((r) => {
        setPatients(r.data)
      })
      .catch((e) => {
        setError(resolveErrorMessage(e))
      })
  }

  useEffect(() => {
    load()
  }, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return

    try {
      setError(null)
      setMsg(null)

      await apiClient.delete(`/patients/delete/${id}`)

      setMsg('Patient deleted.')
      load()
    } catch (e) {
      setError(resolveErrorMessage(e))
    }
  }

  const handleEdit = (patient) => {
    setError(null)
    setMsg(null)

    setEditing({
      id: patient.id,
      name: patient.name || '',
      gender: patient.gender || '',
      birthDate: patient.birthDate
        ? String(patient.birthDate).substring(0, 10)
        : '',
      email: patient.email || '',
      bloodGroup: patient.bloodGroup || '',
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    setError(null)
    setMsg(null)

    if (!editing.name.trim()) {
      setError('Name is required.')
      return
    }

    if (!editing.birthDate) {
      setError('Birth date is required.')
      return
    }

    if (!editing.email.trim()) {
      setError('Email is required.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(editing.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    if (!editing.bloodGroup) {
      setError('Blood group is required.')
      return
    }

    try {
      setSaving(true)

      const payload = {
        name: editing.name.trim(),
        gender: editing.gender || '',
        birthDate: editing.birthDate,
        email: editing.email.trim(),
        bloodGroup: editing.bloodGroup,
      }

      console.log('Updating patient with payload:', payload)

      await apiClient.put(
        `/patients/update/${editing.id}`,
        payload
      )

      setMsg('Patient updated successfully.')
      setEditing(null)

      load()
    } catch (e) {
      console.error(
        'Error updating patient:',
        e.response?.data || e.message
      )

      setError(resolveErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2>Patients</h2>

      {error && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </p>
      )}

      {msg && (
        <p style={{ color: 'green', marginBottom: '1rem' }}>
          {msg}
        </p>
      )}

      {editing && (
        <div style={styles.modal}>
          <h3>Edit Patient</h3>

          <form
            onSubmit={handleUpdate}
            style={styles.form}
          >
            {/* NAME */}
            <div style={styles.field}>
              <label style={styles.label}>
                Name <span style={styles.required}>*</span>
              </label>

              <input
                type="text"
                value={editing.name}
                onChange={(e) =>
                  setEditing((previous) => ({
                    ...previous,
                    name: e.target.value,
                  }))
                }
                required
                maxLength={40}
                style={styles.input}
                placeholder="Enter patient name"
              />
            </div>

            {/* GENDER */}
            <div style={styles.field}>
              <label style={styles.label}>
                Gender
              </label>

              <select
                value={editing.gender}
                onChange={(e) =>
                  setEditing((previous) => ({
                    ...previous,
                    gender: e.target.value,
                  }))
                }
                style={styles.input}
              >
                <option value="">
                  Select Gender
                </option>

                <option value="MALE">
                  Male
                </option>

                <option value="FEMALE">
                  Female
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

            {/* BIRTH DATE */}
            <div style={styles.field}>
              <label style={styles.label}>
                Birth Date <span style={styles.required}>*</span>
              </label>

              <input
                type="date"
                value={editing.birthDate}
                onChange={(e) =>
                  setEditing((previous) => ({
                    ...previous,
                    birthDate: e.target.value,
                  }))
                }
                required
                style={styles.input}
              />
            </div>

            {/* EMAIL */}
            <div style={styles.field}>
              <label style={styles.label}>
                Email <span style={styles.required}>*</span>
              </label>

              <input
                type="email"
                value={editing.email}
                onChange={(e) =>
                  setEditing((previous) => ({
                    ...previous,
                    email: e.target.value,
                  }))
                }
                required
                style={styles.input}
                placeholder="Enter email address"
              />
            </div>

            {/* BLOOD GROUP */}
            <div style={styles.field}>
              <label style={styles.label}>
                Blood Group <span style={styles.required}>*</span>
              </label>

              <select
                value={editing.bloodGroup}
                onChange={(e) =>
                  setEditing((previous) => ({
                    ...previous,
                    bloodGroup: e.target.value,
                  }))
                }
                required
                style={styles.input}
              >
                <option value="">
                  Select Blood Group
                </option>

                <option value="A_POSITIVE">
                  A+
                </option>

                <option value="A_NEGATIVE">
                  A-
                </option>

                <option value="B_POSITIVE">
                  B+
                </option>

                <option value="B_NEGATIVE">
                  B-
                </option>

                <option value="AB_POSITIVE">
                  AB+
                </option>

                <option value="AB_NEGATIVE">
                  AB-
                </option>

                <option value="O_POSITIVE">
                  O+
                </option>

                <option value="O_NEGATIVE">
                  O-
                </option>
              </select>
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '0.5rem',
              }}
            >
              <button
                type="submit"
                style={styles.btn}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>

              <button
                type="button"
                onClick={() => setEditing(null)}
                style={styles.cancelBtn}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PATIENT TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            {[
              'ID',
              'Name',
              'Gender',
              'Blood Group',
              'Birth Date',
              'Actions',
            ].map((h) => (
              <th
                key={h}
                style={styles.th}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td style={styles.td}>
                {p.id}
              </td>

              <td style={styles.td}>
                {p.name}
              </td>

              <td style={styles.td}>
                {p.gender}
              </td>

              <td style={styles.td}>
                {p.bloodGroup}
              </td>

              <td style={styles.td}>
                {p.birthDate}
              </td>

              <td style={styles.td}>
                <button
                  onClick={() => handleEdit(p)}
                  style={styles.editBtn}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  style={styles.delBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
        }}
      >
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          style={styles.btn}
        >
          Prev
        </button>

        <span>
          Page {page + 1}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          style={styles.btn}
        >
          Next
        </button>
      </div>
    </div>
  )
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
  },

  th: {
    background: '#1a73e8',
    color: '#fff',
    padding: '0.75rem',
    textAlign: 'left',
  },

  td: {
    padding: '0.65rem',
    borderBottom: '1px solid #e5e7eb',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },

  label: {
    fontWeight: '600',
  },

  required: {
    color: '#ef4444',
  },

  btn: {
    padding: '0.4rem 0.8rem',
    background: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },

  cancelBtn: {
    padding: '0.4rem 0.8rem',
    background: '#6b7280',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },

  editBtn: {
    marginRight: '0.4rem',
    padding: '0.3rem 0.6rem',
    background: '#f59e0b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },

  delBtn: {
    padding: '0.3rem 0.6rem',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },

  modal: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    maxWidth: '500px',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },

  input: {
    padding: '0.6rem',
    border: '1.5px solid #d1d5db',
    borderRadius: '6px',
  },
}