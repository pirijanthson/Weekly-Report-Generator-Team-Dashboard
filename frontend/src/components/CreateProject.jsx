// CreateProject.jsx
import { useState } from "react";
import "./CreateProject.css";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const getAuthToken = () => localStorage.getItem("token");

function CreateProject({ refresh }) {
  const emptyForm = {
    name: "",
    description: "",
    category: "",
    priority: "medium",
    status: "active"
  };

  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/projects/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Project creation failed");
      }

      setMessage("✅ Project created successfully!");
      setForm(emptyForm);

      if (refresh) {
        refresh();
      }

      // Auto-clear success message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setError(err.message);
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setMessage("");
    setError("");
  };

  return (
    <div className="create-project-container">
      <section className="create-project-card">
        <div className="create-project-header">
          <div className="header-badge">
            <i className="fas fa-plus-circle"></i>
            <span className="project-kicker">Admin Workspace</span>
          </div>
          <h3>
            <i className="fas fa-folder-plus"></i> Create New Project
          </h3>
          <p className="header-description">
            Add a new project that employees can use in weekly reports
          </p>
        </div>

        <form className="create-project-form" onSubmit={submit}>
          <div className="form-grid">
            {/* Project Name */}
            <div className="form-group full-width">
              <label htmlFor="projectName">
                <i className="fas fa-tag"></i> Project Name <span className="required">*</span>
              </label>
              <input
                id="projectName"
                type="text"
                name="name"
                placeholder="e.g., Client A - Website Redesign"
                value={form.name}
                required
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="projectCategory">
                <i className="fas fa-layer-group"></i> Category
              </label>
              <select
                id="projectCategory"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="">Select Category</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="research">Research</option>
                <option value="internal">Internal</option>
              </select>
            </div>

            {/* Priority */}
            <div className="form-group">
              <label htmlFor="projectPriority">
                <i className="fas fa-flag"></i> Priority
              </label>
              <select
                id="projectPriority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="projectStatus">
                <i className="fas fa-circle"></i> Status
              </label>
              <select
                id="projectStatus"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label htmlFor="projectDescription">
                <i className="fas fa-align-left"></i> Description
              </label>
              <textarea
                id="projectDescription"
                name="description"
                rows="5"
                placeholder="Provide a detailed description of the project..."
                value={form.description}
                onChange={handleChange}
                className="form-textarea"
                disabled={loading}
              />
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="project-success">
              <i className="fas fa-check-circle"></i>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="project-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={resetForm}
              className="btn-reset"
              disabled={loading}
            >
              <i className="fas fa-undo"></i> Reset
            </button>
            <button
              type="submit"
              className="create-project-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateProject;