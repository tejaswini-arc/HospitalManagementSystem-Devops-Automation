import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { detectRole } from '../utils/roleDetection'
import { getRoleDashboardPath } from '../utils/jwtUtils'
import { storeToken } from '../utils/tokenStore'
import { resolveErrorMessage } from '../utils/errorHandler'

export default function OAuthCallbackPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)

        // Backend sends ?token=...&userId=...
        const token = params.get('token')
        const userId = params.get('userId')

        if (!token || !userId) {
            setError('Google login failed: no credentials received.')
            return
        }

        handleCredentials(token, Number(userId))
    }, [])

    const handleCredentials = async (token, userId) => {
        try {
            // Store JWT
            storeToken(token)

            // Detect role using the stored JWT
            const roles = await detectRole()

            // Update authentication context
            login(token, userId, roles)

            // Redirect based on role
            navigate(getRoleDashboardPath(roles), {
                replace: true
            })

        } catch (err) {
            console.error('Google OAuth callback error:', err)
            setError(resolveErrorMessage(err))
        }
    }

    if (error) {
        return (
            <div style={styles.page}>
                <div style={styles.card}>
                    <p style={{ color: '#c0392b' }}>
                        ⚠️ {error}
                    </p>

                    <a
                        href="/login"
                        style={{ color: '#1a73e8' }}
                    >
                        Back to Login
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <p>Completing Google sign-in…</p>
            </div>
        </div>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f0ff 0%, #f0f4ff 100%)',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
    },

    card: {
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(26,115,232,0.12)',
    },
}