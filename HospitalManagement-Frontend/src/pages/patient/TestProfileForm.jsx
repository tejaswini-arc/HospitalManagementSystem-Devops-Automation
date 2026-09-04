import React, { useState } from 'react';
import SimpleBloodGroupSelect from '../../components/SimpleBloodGroupSelect';
import apiClient from '../../api/apiClient';

const TestProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    email: '',
    bloodGroup: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBloodGroupChange = (value) => {
    setFormData(prev => ({ ...prev, bloodGroup: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Simulate API call - in real app, you would use actual patient ID
      const response = await fetch('http://localhost:8080/api/v1/patients/update/2', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult({
        status: response.status,
        data: data,
        message: response.ok ? 'Success!' : 'Error occurred'
      });

      // Show what was sent to backend
      console.log('Sent to backend:', formData);
    } catch (error) {
      setResult({
        status: 500,
        data: { error: error.message },
        message: 'Network error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Test Patient Profile Update</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Birth Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Blood Group <strong>(FIXED - sends backend enum values)</strong>
                  </label>
                  <SimpleBloodGroupSelect
                    value={formData.bloodGroup}
                    onChange={handleBloodGroupChange}
                  />
                  <div className="form-text">
                    Selected value: <code>{formData.bloodGroup || 'None'}</code>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Testing...' : 'Test Update'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Request Data</h4>
            </div>
            <div className="card-body">
              <h6>What will be sent to backend:</h6>
              <pre className="bg-light p-3 rounded">
                {JSON.stringify(formData, null, 2)}
              </pre>

              {result && (
                <div className="mt-3">
                  <h6>Response:</h6>
                  <div className={`alert ${result.status < 400 ? 'alert-success' : 'alert-danger'}`}>
                    <strong>Status: {result.status}</strong><br/>
                    {result.message}
                  </div>
                  <pre className="bg-light p-3 rounded">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5>Backend Enum Values</h5>
            </div>
            <div className="card-body">
              <p className="mb-2">Valid values that backend accepts:</p>
              <ul className="list-unstyled">
                <li><code>A_POSITIVE</code> → A+ve</li>
                <li><code>A_NEGATIVE</code> → A-ve</li>
                <li><code>B_POSITIVE</code> → B+ve</li>
                <li><code>B_NEGATIVE</code> → B-ve</li>
                <li><code>O_POSITIVE</code> → O+ve</li>
                <li><code>O_NEGATIVE</code> → O-ve</li>
                <li><code>AB_POSITIVE</code> → AB+ve</li>
                <li><code>AB_NEGATIVE</code> → AB-ve</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestProfileForm;