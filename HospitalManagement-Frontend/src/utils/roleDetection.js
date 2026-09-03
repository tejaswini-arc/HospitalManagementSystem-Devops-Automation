import apiClient from '../api/apiClient'

/**
 * Detects the user's role by probing protected endpoints.
 * Returns an array of role strings.
 * @returns {Promise<string[]>}
 */
export async function detectRole() {
  // Try ADMIN first
  try {
    await apiClient.get('/admin/patients', { params: { page: 0, size: 1 } })
    return ['ADMIN']
  } catch (e) {
    if (e.response?.status !== 403 && e.response?.status !== 401) throw e
  }

  // Try DOCTOR
  try {
    await apiClient.get('/doctors/appointments')
    return ['DOCTOR']
  } catch (e) {
    if (e.response?.status !== 403 && e.response?.status !== 401) throw e
  }

  return ['PATIENT']
}
