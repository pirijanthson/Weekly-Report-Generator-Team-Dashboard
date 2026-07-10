// AdminLoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLoginPage.css";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

function AdminLoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        if (userData?.role === "admin") {
          navigate("/admin");
        }
      } catch (e) {
        // Invalid user data, clear it
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/admins/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid admin credentials"
        );
      }

      // Save admin token
      localStorage.setItem("token", data.access_token);
      
      const userData = {
        role: "admin",
        email: form.email,
        full_name: data.full_name || "Admin"
      };
      
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect to admin dashboard
      navigate("/admin");

    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          {/* Brand / Logo */}
          <div className="login-brand">
            <div className="brand-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h1>TeamPulse</h1>
          </div>

          <div className="login-header">
            <h2>Admin Login</h2>
            <p>Access the Team Dashboard Management</p>
          </div>

          <form onSubmit={login} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i> Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                required
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i> Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value
                    })
                  }
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="error-text">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              <i className="fas fa-shield-alt"></i>
              Secure admin access only
            </p>
            <p className="footer-version">v2.0.0</p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="security-badge">
          <i className="fas fa-lock"></i>
          <span>256-bit encrypted</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;