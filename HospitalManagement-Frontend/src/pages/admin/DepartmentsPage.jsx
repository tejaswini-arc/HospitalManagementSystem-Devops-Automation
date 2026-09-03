import { useEffect, useState } from 'react'

import apiClient from '../../api/apiClient'

import { resolveErrorMessage } from '../../utils/errorHandler'

export default function DepartmentsPage() {

  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])

  const [form, setForm] = useState({
    name: '',
    description: '',
    headDoctorId: '',
  })

  const [assignForm, setAssignForm] = useState({
    departmentId: '',
    doctorIds: '',
  })

  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadDepartments = async () => {

    try {

      const response =
        await apiClient.get('/admin/departments/getAll')

      setDepartments(response.data)

    } catch (e) {

      setError(resolveErrorMessage(e))
    }
  }

  const loadDoctors = async () => {

    try {

      const response =
        await apiClient.get('/admin/doctors')

      setDoctors(response.data)

    } catch (e) {

      console.error('Unable to load doctors:', e)
    }
  }

  useEffect(() => {

    loadDepartments()
    loadDoctors()

  }, [])

  const handleCreate = async (e) => {

    e.preventDefault()

    setError(null)
    setMsg(null)
    setLoading(true)

    try {

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        headDoctorId:
          form.headDoctorId
            ? Number(form.headDoctorId)
            : null,
        doctorIds: [],
      }

      console.log(
        'Creating department payload:',
        payload
      )

      const response =
        await apiClient.post(
          '/admin/departments',
          payload
        )

      setDepartments((previous) => [
        ...previous,
        response.data,
      ])

      setMsg('Department created successfully.')

      setForm({
        name: '',
        description: '',
        headDoctorId: '',
      })

    } catch (e) {

      console.error(
        'Department creation failed:',
        e.response?.data || e
      )

      setError(
        resolveErrorMessage(e)
      )

    } finally {

      setLoading(false)
    }
  }

  const handleAssign = async (e) => {

    e.preventDefault()

    setError(null)
    setMsg(null)

    try {

      const ids =
        assignForm.doctorIds
          .split(',')
          .map((value) => Number(value.trim()))
          .filter((value) => !Number.isNaN(value))

      await apiClient.patch(
        `/admin/departments/${assignForm.departmentId}/assign-doctors`,
        ids
      )

      setMsg('Doctors assigned successfully.')

      await loadDepartments()

    } catch (e) {

      console.error(
        'Doctor assignment failed:',
        e.response?.data || e
      )

      setError(
        resolveErrorMessage(e)
      )
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
      }}
    >

      <div>

        <h2>Departments</h2>

        {error && (
          <p style={{ color: 'red' }}>
            {error}
          </p>
        )}

        {msg && (
          <p style={{ color: 'green' }}>
            {msg}
          </p>
        )}

        {departments.map((department) => (

          <div
            key={department.id}
            style={styles.card}
          >

            <strong>
              {department.name}
            </strong>

            {department.description && (
              <p
                style={{
                  margin: '0.25rem 0 0',
                  color: '#555',
                  fontSize: '0.875rem',
                }}
              >
                {department.description}
              </p>
            )}

          </div>

        ))}

      </div>

      <div>

        <div style={styles.formCard}>

          <h3>Create Department</h3>

          <form
            onSubmit={handleCreate}
            style={styles.form}
          >

            <input
              placeholder="Department Name"
              value={form.name}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  name: e.target.value,
                }))
              }
              required
              maxLength={100}
              style={styles.input}
            />

            <textarea
              placeholder="Department Description"
              value={form.description}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  description: e.target.value,
                }))
              }
              maxLength={500}
              rows={4}
              style={styles.input}
            />

            <select
              value={form.headDoctorId}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  headDoctorId: e.target.value,
                }))
              }
              style={styles.input}
            >

              <option value="">
                Select Head Doctor
              </option>

              {doctors.map((doctor) => (

                <option
                  key={doctor.id}
                  value={doctor.id}
                >
                  {doctor.name || doctor.username}
                </option>

              ))}

            </select>

            <button
              type="submit"
              disabled={loading}
              style={styles.btn}
            >
              {loading
                ? 'Creating...'
                : 'Create Department'}
            </button>

          </form>

        </div>

        <div style={styles.formCard}>

          <h3>Assign Doctors to Department</h3>

          <form
            onSubmit={handleAssign}
            style={styles.form}
          >

            <select
              value={assignForm.departmentId}
              onChange={(e) =>
                setAssignForm((previous) => ({
                  ...previous,
                  departmentId: e.target.value,
                }))
              }
              required
              style={styles.input}
            >

              <option value="">
                Select department
              </option>

              {departments.map((department) => (

                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>

              ))}

            </select>

            <input
              placeholder="Doctor IDs (comma-separated)"
              value={assignForm.doctorIds}
              onChange={(e) =>
                setAssignForm((previous) => ({
                  ...previous,
                  doctorIds: e.target.value,
                }))
              }
              required
              style={styles.input}
            />

            <button
              type="submit"
              style={styles.btn}
            >
              Assign
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

const styles = {

  card: {
    background: '#fff',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '0.75rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
  },

  formCard: {
    background: '#fff',
    borderRadius: '8px',
    padding: '1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
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
    fontFamily: 'inherit',
  },

  btn: {
    padding: '0.6rem',
    background: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
  },
}