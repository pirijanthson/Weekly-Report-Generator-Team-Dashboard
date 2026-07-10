// ProfileSection.jsx
import { useState } from 'react';
import './ProfileSection.css';

function ProfileSection({ profile, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    role: profile?.role || 'employee',
    department: profile?.department || '',
    phone: profile?.phone || '',
    bio: profile?.bio || ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage('');
    setError('');
    // Reset form data if canceling
    if (isEditing) {
      setFormData({
        full_name: profile?.full_name || '',
        email: profile?.email || '',
        role: profile?.role || 'employee',
        department: profile?.department || '',
        phone: profile?.phone || '',
        bio: profile?.bio || ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Simulate API call - replace with actual API
      // const response = await fetch(`${API_BASE}/profile/update`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.detail || 'Update failed');

      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessage('✅ Profile updated successfully!');
      setIsEditing(false);
      
      if (onUpdateProfile) {
        onUpdateProfile(formData);
      }
      
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="profile-section-container">
      <div className="panel-card">
        {/* Header */}
        <div className="panel-header">
          <div className="header-left">
            <div className="header-badge">
              <i className="fas fa-user-circle"></i>
              <span className="section-kicker">Profile</span>
            </div>
            <h3>
              <i className="fas fa-id-card"></i> Your Account Details
            </h3>
            <p className="header-subtitle">
              Manage your personal information and preferences
            </p>
          </div>
          <button
            className={`btn-edit-profile ${isEditing ? 'btn-cancel' : ''}`}
            onClick={handleEditToggle}
            disabled={loading}
          >
            {isEditing ? (
              <>
                <i className="fas fa-times"></i> Cancel
              </>
            ) : (
              <>
                <i className="fas fa-pen"></i> Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="message-success">
            <i className="fas fa-check-circle"></i>
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="message-error">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Profile Content */}
        {isEditing ? (
          <form className="profile-edit-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="full_name">
                  <i className="fas fa-user"></i> Full Name <span className="required">*</span>
                </label>
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i> Email <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <i className="fas fa-phone"></i> Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">
                  <i className="fas fa-shield-alt"></i> Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={true}
                  className="disabled-input"
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="lead">Team Lead</option>
                </select>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
                  Role can only be changed by an administrator.
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="department">
                  <i className="fas fa-building"></i> Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select Department</option>
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="bio">
                  <i className="fas fa-align-left"></i> Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a little about yourself..."
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleEditToggle}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-grid">
            <div className="profile-card">
              <div className="profile-card-icon">
                <i className="fas fa-user"></i>
              </div>
              <p className="profile-label">Full Name</p>
              <p className="profile-value">{profile?.full_name || '—'}</p>
            </div>

            <div className="profile-card">
              <div className="profile-card-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <p className="profile-label">Email Address</p>
              <p className="profile-value">{profile?.email || '—'}</p>
            </div>

            <div className="profile-card">
              <div className="profile-card-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <p className="profile-label">Role</p>
              <p className="profile-value">
                <span className={`role-badge role-${profile?.role || 'employee'}`}>
                  {profile?.role || 'Employee'}
                </span>
              </p>
            </div>

            {profile?.department && (
              <div className="profile-card">
                <div className="profile-card-icon">
                  <i className="fas fa-building"></i>
                </div>
                <p className="profile-label">Department</p>
                <p className="profile-value">{profile.department}</p>
              </div>
            )}

            {profile?.phone && (
              <div className="profile-card">
                <div className="profile-card-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <p className="profile-label">Phone</p>
                <p className="profile-value">{profile.phone}</p>
              </div>
            )}

            {profile?.bio && (
              <div className="profile-card full-width">
                <div className="profile-card-icon">
                  <i className="fas fa-align-left"></i>
                </div>
                <p className="profile-label">Bio</p>
                <p className="profile-value bio-text">{profile.bio}</p>
              </div>
            )}

            {/* Stats / Activity */}
            <div className="profile-card stats-card">
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Reports</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">8</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">94%</span>
                  <span className="stat-label">Compliance</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProfileSection;