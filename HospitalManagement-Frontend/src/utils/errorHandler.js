/**
 * Resolves a human-readable error message from an Axios error.
 * @param {any} err
 * @returns {string}
 */
export function resolveErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'An unexpected error occurred'
  )
}
