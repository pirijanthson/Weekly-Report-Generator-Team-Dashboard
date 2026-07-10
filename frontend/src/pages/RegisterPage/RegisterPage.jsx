// RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const label = score <= 2 ? 'Weak' : score <= 3 ? 'Fair' : score <= 4 ? 'Good' : 'Strong';
  const color = score <= 2 ? '#ef4444' : score <= 3 ? '#f59e0b' : score <= 4 ? '#3b82f6' : '#22c55e';
  return { score, label, percentage: Math.min(100, (score / 5) * 100), color };
};

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    contact_no: '',
    password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

  const validate = () => {
    const nextErrors = {};
    const fullName = form.full_name.trim();
    const email = form.email.trim();
    const phone = form.contact_no.trim();

    if (!fullName) {
      nextErrors.full_name = 'Full name is required.';
    } else if (fullName.length < 2) {
      nextErrors.full_name = 'Full name must be at least 2 characters.';
    }

    if (!email) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!phone) {
      nextErrors.contact_no = 'Contact number is required.';
    } else if (!/^\d{7,15}$/.test(phone)) {
      nextErrors.contact_no = 'Enter a valid phone number.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (passwordStrength.score < 3) {
      nextErrors.password = 'Use at least 8 characters with upper/lowercase and a number.';
    }

    if (!form.confirm_password) {
      nextErrors.confirm_password = 'Please confirm your password.';
    } else if (form.confirm_password !== form.password) {
      nextErrors.confirm_password = 'Passwords do not match.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          contact_no: form.contact_no.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Registration failed');
      }
      setMessage('✅ Account created successfully!');
      setForm({
        full_name: '',
        email: '',
        contact_no: '',
        password: '',
        confirm_password: ''
      });
      setFieldErrors({});
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        {/* Left Side - Branding */}
        <div className="register-branding">
          <div className="branding-content">
            <div className="branding-logo">
              <div className="logo-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <span className="logo-text">TeamPulse</span>
            </div>
            <h1 className="branding-title">Join TeamPulse</h1>
            <p className="branding-subtitle">Create your account and start managing your team</p>
            <div className="branding-features">
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Track team performance</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Generate weekly reports</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Collaborate with your team</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Secure & encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="register-form-container">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </div>

            <form onSubmit={submit} noValidate className="register-form">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="registerName">
                  <i className="fas fa-user"></i> Full Name
                </label>
                <input
                  id="registerName"
                  type="text"
                  className={`form-input ${fieldErrors.full_name ? 'input-error' : ''}`}
                  value={form.full_name}
                  onChange={(e) => {
                    setForm({ ...form, full_name: e.target.value });
                    setFieldErrors((prev) => ({ ...prev, full_name: '' }));
                    setError('');
                  }}
                  placeholder="Enter your full name"
                  disabled={loading}
                  autoFocus
                />
                {fieldErrors.full_name && (
                  <span className="field-error">{fieldErrors.full_name}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="registerEmail">
                  <i className="fas fa-envelope"></i> Email Address
                </label>
                <input
                  id="registerEmail"
                  type="email"
                  className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setFieldErrors((prev) => ({ ...prev, email: '' }));
                    setError('');
                  }}
                  placeholder="you@example.com"
                  disabled={loading}
                />
                {fieldErrors.email && (
                  <span className="field-error">{fieldErrors.email}</span>
                )}
              </div>

              {/* Contact Number */}
              <div className="form-group">
                <label htmlFor="registerPhone">
                  <i className="fas fa-phone"></i> Contact Number
                </label>
                <input
                  id="registerPhone"
                  type="tel"
                  className={`form-input ${fieldErrors.contact_no ? 'input-error' : ''}`}
                  value={form.contact_no}
                  onChange={(e) => {
                    setForm({ ...form, contact_no: e.target.value });
                    setFieldErrors((prev) => ({ ...prev, contact_no: '' }));
                    setError('');
                  }}
                  placeholder="0712345678"
                  disabled={loading}
                />
                {fieldErrors.contact_no && (
                  <span className="field-error">{fieldErrors.contact_no}</span>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="registerPassword">
                  <i className="fas fa-lock"></i> Password
                </label>
                <div className="password-field">
                  <input
                    id="registerPassword"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, password: '' }));
                      setError('');
                    }}
                    placeholder="Create a strong password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    tabIndex="-1"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {form.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <span 
                        className="strength-fill" 
                        style={{ 
                          width: `${passwordStrength.percentage}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      />
                    </div>
                    <span className="strength-label" style={{ color: passwordStrength.color }}>
                      Strength: {passwordStrength.label}
                    </span>
                  </div>
                )}
                {fieldErrors.password && (
                  <span className="field-error">{fieldErrors.password}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="registerConfirm">
                  <i className="fas fa-check-circle"></i> Confirm Password
                </label>
                <div className="password-field">
                  <input
                    id="registerConfirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-input ${fieldErrors.confirm_password ? 'input-error' : ''}`}
                    value={form.confirm_password}
                    onChange={(e) => {
                      setForm({ ...form, confirm_password: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, confirm_password: '' }));
                      setError('');
                    }}
                    placeholder="Re-enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={loading}
                    tabIndex="-1"
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {fieldErrors.confirm_password && (
                  <span className="field-error">{fieldErrors.confirm_password}</span>
                )}
              </div>

              {/* Messages */}
              {error && (
                <div className="form-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
              {message && (
                <div className="form-success">
                  <i className="fas fa-check-circle"></i>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="form-footer">
              <p>
                Already have an account? <Link to="/login" className="register-link">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;