// ProjectSection.jsx
import { useState, useEffect } from "react";
import "./ProjectSection.css";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const getAuthToken = () => localStorage.getItem("token");

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role;
};

function ProjectSection({ projects, refresh }) {
  const emptyForm = {
    name: "",
    description: "",
    status: "active",
    priority: "medium"
  };

  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Member Assignment States
  const [users, setUsers] = useState([]);
  const [assigningProject, setAssigningProject] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);

  // Fetch users
  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/all`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  useEffect(() => {
  loadUsers();

  const role = getUserRole();

  if (role === "admin") {
    setIsAdmin(true);
  }
}, []);

  const openAssignModal = (project) => {
    setAssigningProject(project);
    const currentMembers = project.members
      ? project.members.map(m => typeof m === 'string' ? m : (m.email || m.name || m))
      : [];
    setSelectedMembers(currentMembers);
  };

  const saveAssignments = async () => {
    setAssignLoading(true);
    setError("");
    setMessage("");
    try {
      const projectId = assigningProject.id || assigningProject._id;
      const response = await fetch(`${API_BASE}/projects/${projectId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ members: selectedMembers })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to assign members");
      }

      setMessage("✅ Team members assigned successfully!");
      setAssigningProject(null);
      refresh();
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setAssignLoading(false);
    }
  };


  // Edit button click
  const editProject = (project) => {
    setEditMode(true);
    setSelectedId(project.id || project._id);
    setForm({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "active",
      priority: project.priority || "medium"
    });
    setMessage("");
    setError("");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditMode(false);
    setSelectedId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  };

  // Update project
  const updateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/projects/update/${selectedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Update failed");
      }

      setMessage("✅ Project updated successfully!");
      setForm(emptyForm);
      setEditMode(false);
      setSelectedId(null);
      refresh();

      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete this project? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setDeleteLoading(id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/projects/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Delete failed");
      }

      setMessage("🗑️ Project deleted successfully");
      refresh();
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <section className="project-section-container">
      <div className="panel-card">
        {/* Header */}
        <div className="panel-header">
          <div className="header-badge">
            <i className="fas fa-folder-open"></i>
            <span className="section-kicker">Admin Workspace</span>
          </div>
          <h3>
            <i className="fas fa-project-diagram"></i> View Projects
          </h3>
          <p className="header-subtitle">
            Manage and organize all your team projects
          </p>
          <div className="project-stats">
            <span className="stat-item">
              <i className="fas fa-cubes"></i>
              {projects.length} Total Projects
            </span>
          </div>
        </div>

        {/* Edit Form */}
        {editMode && (
          <div className="edit-form-container">
            <form className="edit-form" onSubmit={updateProject}>
              <div className="edit-form-header">
                <h4>
                  <i className="fas fa-edit"></i> Edit Project
                </h4>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-cancel-edit"
                  disabled={loading}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="editProjectName">
                  <i className="fas fa-tag"></i> Project Name <span className="required">*</span>
                </label>
                <input
                  id="editProjectName"
                  value={form.name}
                  placeholder="Enter project name"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="editProjectStatus">
                    <i className="fas fa-circle"></i> Status
                  </label>
                  <select
                    id="editProjectStatus"
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value
                      })
                    }
                    disabled={loading}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="editProjectPriority">
                    <i className="fas fa-flag"></i> Priority
                  </label>
                  <select
                    id="editProjectPriority"
                    value={form.priority}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        priority: e.target.value
                      })
                    }
                    disabled={loading}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="editProjectDescription">
                  <i className="fas fa-align-left"></i> Description
                </label>
                <textarea
                  id="editProjectDescription"
                  rows="4"
                  value={form.description}
                  placeholder="Project description"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value
                    })
                  }
                  disabled={loading}
                />
              </div>

              <div className="edit-form-actions">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-secondary"
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
                      <span className="spinner"></span> Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Update Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

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

        {/* Project Grid */}
        <div className="project-grid">
          {projects.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-folder-plus"></i>
              <h4>No Projects Found</h4>
              <p>Create your first project to get started</p>
            </div>
          ) : (
            projects.map((project) => (
              <div className="project-card" key={project.id || project._id}>
                <div className="project-card-header">
                  <h4>{project.name}</h4>
                  <div className="project-badges">
                    <span className={`badge badge-${project.status || 'active'}`}>
                      {project.status || 'Active'}
                    </span>
                    <span className={`badge-priority badge-priority-${project.priority || 'medium'}`}>
                      {project.priority || 'Medium'}
                    </span>
                  </div>
                </div>

                <p className="project-description">
                  {project.description || "No description provided"}
                </p>

                {project.members && project.members.length > 0 && (
                  <div className="project-members">
                    <p className="project-members-title">
                      <i className="fas fa-users"></i> Team Members
                    </p>
                    <div className="member-avatars">
                      {project.members.slice(0, 4).map((member, idx) => {
                        const email = typeof member === 'string' ? member : (member.email || member.name || '');
                        const initial = email.charAt(0).toUpperCase() || 'U';
                        return (
                          <span key={idx} className="member-avatar" title={email}>
                            {initial}
                          </span>
                        );
                      })}
                      {project.members.length > 4 && (
                        <span className="member-more">
                          +{project.members.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="project-actions">

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => openAssignModal(project)}
                          className="member-manage-btn"
                        >
                          <i className="fas fa-users-cog"></i> Members
                        </button>


                        <button
                          onClick={() => editProject(project)}
                          className="btn-edit"
                          disabled={deleteLoading === (project.id || project._id)}
                        >
                          <i className="fas fa-pen"></i> Edit
                        </button>


                        <button
                          onClick={() =>
                            deleteProject(project.id || project._id)
                          }
                          className="btn-delete"
                          disabled={deleteLoading === (project.id || project._id)}
                        >

                          {deleteLoading === (project.id || project._id) ? (
                            <span className="spinner-small"></span>
                          ) : (
                            <>
                              <i className="fas fa-trash"></i> Delete
                            </>
                          )}

                        </button>
                      </>
                    )}

                </div>
                
              </div>
            ))
          )}
        </div>

        {/* Modal Overlay */}
        {assigningProject && (
          <div className="assignment-modal-overlay">
            <div className="assignment-modal">
              <div className="modal-header">
                <h4>Assign Team to {assigningProject.name}</h4>
                <button className="modal-close" onClick={() => setAssigningProject(null)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="user-selector-list">
                {users.length === 0 ? (
                  <p className="empty-state">No users registered yet.</p>
                ) : (
                  users.map(u => {
                    const isChecked = selectedMembers.includes(u.email);
                    return (
                      <div
                        key={u._id}
                        className="user-selector-item"
                        onClick={() => {
                          if (isChecked) {
                            setSelectedMembers(selectedMembers.filter(email => email !== u.email));
                          } else {
                            setSelectedMembers([...selectedMembers, u.email]);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="user-selector-checkbox"
                        />
                        <div className="user-selector-info">
                          <p className="user-selector-name">{u.full_name}</p>
                          <p className="user-selector-email">{u.email}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="edit-form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setAssigningProject(null)}
                  disabled={assignLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={saveAssignments}
                  disabled={assignLoading}
                >
                  {assignLoading ? "Saving..." : "Save Assignments"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectSection;