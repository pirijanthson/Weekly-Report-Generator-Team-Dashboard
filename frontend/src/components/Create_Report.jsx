// Create_Report.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Create_Report.css';

function Create_Report({
  refresh,
  apiBase,
  getAuthToken,
  editMode,
  editReport
}) {
  const navigate = useNavigate();

  const emptyForm = {
    week_start: '',
    week_end: '',
    project: '',
    tasks_completed: '',
    tasks_planned: '',
    blockers: '',
    hours_worked: '',
    notes: ''
  };

  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fill form when edit starts
  useEffect(() => {
    if (editMode && editReport) {
      setForm({
        week_start: editReport.week_start || '',
        week_end: editReport.week_end || '',
        project: editReport.project || '',
        tasks_completed: editReport.tasks_completed?.join('\n') || '',
        tasks_planned: editReport.tasks_planned?.join('\n') || '',
        blockers: editReport.blockers || '',
        hours_worked: editReport.hours_worked || '',
        notes: editReport.notes || ''
      });
    }
  }, [editReport, editMode]);

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        tasks_completed: form.tasks_completed.split('\n').filter(Boolean),
        tasks_planned: form.tasks_planned.split('\n').filter(Boolean),
        hours_worked: Number(form.hours_worked) || 0
      };

      let url, method;

      if (editMode) {
        const id = editReport.id || editReport._id;
        url = `${apiBase}/reports/${id}`;
        method = 'PUT';
      } else {
        url = `${apiBase}/reports/create`;
        method = 'POST';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to save report');
      }

      setMessage(editMode ? '✅ Report updated successfully!' : '✅ Report created successfully!');
      setForm(emptyForm);

      navigate('/', {
        replace: true,
        state: null
      });

      if (refresh) refresh();

      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      console.log(err);
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setMessage('');
    setError('');
  };

  return (
    <section className="create-report-container">
      <div className="panel-card">
        <div className="panel-header">
          <div className="header-badge">
            <i className="fas fa-file-alt"></i>
            <span className="section-kicker">Employee Workspace</span>
          </div>
          <h3>
            <i className={`fas ${editMode ? 'fa-edit' : 'fa-plus-circle'}`}></i>
            {editMode ? 'Edit Weekly Report' : 'Create Weekly Report'}
          </h3>
          <p className="header-subtitle">
            {editMode 
              ? 'Update your existing weekly report' 
              : 'Fill in your weekly progress and submit'}
          </p>
        </div>

        <form className="report-form" onSubmit={submit}>
          {/* Week Range */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weekStart">
                <i className="fas fa-calendar-alt"></i> Week Start
              </label>
              <input
                id="weekStart"
                type="date"
                className="form-input"
                value={form.week_start}
                onChange={(e) =>
                  setForm({
                    ...form,
                    week_start: e.target.value
                  })
                }
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="weekEnd">
                <i className="fas fa-calendar-alt"></i> Week End
              </label>
              <input
                id="weekEnd"
                type="date"
                className="form-input"
                value={form.week_end}
                onChange={(e) =>
                  setForm({
                    ...form,
                    week_end: e.target.value
                  })
                }
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Project & Hours */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="projectName">
                <i className="fas fa-project-diagram"></i> Project Name
              </label>
              <input
                id="projectName"
                type="text"
                className="form-input"
                placeholder="Enter project name"
                value={form.project}
                onChange={(e) =>
                  setForm({
                    ...form,
                    project: e.target.value
                  })
                }
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hoursWorked">
                <i className="fas fa-clock"></i> Hours Worked
              </label>
              <input
                id="hoursWorked"
                type="number"
                className="form-input"
                placeholder="0"
                min="0"
                max="168"
                value={form.hours_worked}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hours_worked: e.target.value
                  })
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="form-group">
            <label htmlFor="tasksCompleted">
              <i className="fas fa-check-circle"></i> Completed Tasks
            </label>
            <textarea
              id="tasksCompleted"
              rows="3"
              className="form-textarea"
              placeholder="Enter completed tasks (one per line)"
              value={form.tasks_completed}
              onChange={(e) =>
                setForm({
                  ...form,
                  tasks_completed: e.target.value
                })
              }
              disabled={loading}
            />
            <span className="field-hint">
              <i className="fas fa-info-circle"></i>
              Separate tasks by line break
            </span>
          </div>

          {/* Tasks Planned */}
          <div className="form-group">
            <label htmlFor="tasksPlanned">
              <i className="fas fa-tasks"></i> Planned Tasks
            </label>
            <textarea
              id="tasksPlanned"
              rows="3"
              className="form-textarea"
              placeholder="Enter planned tasks (one per line)"
              value={form.tasks_planned}
              onChange={(e) =>
                setForm({
                  ...form,
                  tasks_planned: e.target.value
                })
              }
              disabled={loading}
            />
            <span className="field-hint">
              <i className="fas fa-info-circle"></i>
              Separate tasks by line break
            </span>
          </div>

          {/* Blockers */}
          <div className="form-group">
            <label htmlFor="blockers">
              <i className="fas fa-exclamation-triangle"></i> Blockers
            </label>
            <textarea
              id="blockers"
              rows="2"
              className="form-textarea"
              placeholder="Any blockers or issues encountered"
              value={form.blockers}
              onChange={(e) =>
                setForm({
                  ...form,
                  blockers: e.target.value
                })
              }
              disabled={loading}
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes">
              <i className="fas fa-sticky-note"></i> Notes
            </label>
            <textarea
              id="notes"
              rows="2"
              className="form-textarea"
              placeholder="Additional notes or comments"
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value
                })
              }
              disabled={loading}
            />
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

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={resetForm}
              disabled={loading}
            >
              <i className="fas fa-undo"></i> Reset
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {editMode ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <i className={`fas ${editMode ? 'fa-save' : 'fa-paper-plane'}`}></i>
                  {editMode ? 'Update Report' : 'Save Report'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Create_Report;