import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OAuthCallbackPage from './pages/OAuthCallbackPage'
import PublicDoctorsPage from './pages/PublicDoctorsPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import PatientsPage from './pages/admin/PatientsPage'
import DoctorsPage from './pages/admin/DoctorsPage'
import DepartmentsPage from './pages/admin/DepartmentsPage'

import DoctorDashboard from './pages/doctor/DoctorDashboard'
import AppointmentsPage from './pages/doctor/AppointmentsPage'

import PatientDashboard from './pages/patient/PatientDashboard'
import ProfilePage from './pages/patient/ProfilePage'
import BookAppointmentPage from './pages/patient/BookAppointmentPage'

function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '1.5rem' }}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/doctors" element={<PublicDoctorsPage />} />
          <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/patients" element={<PatientsPage />} />
            <Route path="/admin/doctors" element={<DoctorsPage />} />
            <Route path="/admin/departments" element={<DepartmentsPage />} />
          </Route>

          {/* Doctor */}
          <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']} />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<AppointmentsPage />} />
          </Route>

          {/* Patient */}
          <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/profile" element={<ProfilePage />} />
            <Route path="/patient/book" element={<BookAppointmentPage />} />
          </Route>

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  )
}
