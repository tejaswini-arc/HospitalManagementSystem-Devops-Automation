import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { BLOOD_GROUP_OPTIONS } from '../../utils/constants';
import { prepareFormDataForBackend, formatPatientDataForUI } from '../../utils/formatters';
import BloodGroupDropdown from '../../components/BloodGroupDropdown';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    email: '',
    bloodGroup: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Get patient ID from token or local storage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    
    setPatientId(userId);
    fetchPatientProfile(userId);
  }, [navigate]);

  const fetchPatientProfile = async (id) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/v1/patients/get/profile/${id}`);
      const formattedData = formatPatientDataForUI(response.data);
      setFormData({
        name: formattedData.name || '',
        gender: formattedData.gender || '',
        birthDate: formattedData.birthDate ? formattedData.birthDate.substring(0, 10) : '',
        email: formattedData.email || '',
        bloodGroup: formattedData.bloodGroup || ''
      });
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      alert('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBloodGroupChange = (bloodGroup) => {
    setFormData(prev => ({ ...prev, bloodGroup }));
    if (errors.bloodGroup) {
      setErrors(prev => ({ ...prev, bloodGroup: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Validate birth date is in the past
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      if (birthDate >= today) {
        newErrors.birthDate = 'Birth date must be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      // Prepare data for backend (convert bloodGroup to enum value)
      const backendData = prepareFormDataForBackend(formData);
      
      await apiClient.put(`/api/v1/patients/update/${patientId}`, backendData);
      alert('Profile updated successfully!');
      
      // Refresh data
      fetchPatientProfile(patientId);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      
      if (error.response?.data?.message) {
        // Show backend validation errors
        const backendError = error.response.data.message;
        if (backendError.includes('email')) {
          setErrors(prev => ({ ...prev, email: 'Email already exists or invalid format' }));
        } else {
          alert(`Error: ${backendError}`);
        }
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Patient Profile</h2>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  maxLength="40"
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  className="form-select"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="birthDate" className="form-label">
                  Birth Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
                {errors.birthDate && (
                  <div className="invalid-feedback">{errors.birthDate}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <BloodGroupDropdown
                  value={formData.bloodGroup}
                  onChange={handleBloodGroupChange}
                  label="Blood Group"
                  required={false}
                />
                <small className="text-muted">
                  Selected value for backend: {formData.bloodGroup || 'None'}
                </small>
              </div>

              <div className="col-md-6 mb-3 d-flex align-items-end">
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5>Backend Enum Reference</h5>
        </div>
        <div className="card-body">
          <p className="mb-2">
            <strong>Valid Blood Group Values for Backend API:</strong>
          </p>
          <div className="row">
            {BLOOD_GROUP_OPTIONS.map(option => (
              <div key={option.value} className="col-md-3 mb-2">
                <code className="border rounded px-2 py-1 d-block">
                  {option.value}
                </code>
                <small className="text-muted">{option.label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;