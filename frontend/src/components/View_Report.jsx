// View_Report.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './View_Report.css';

function View_Report({ reports, refreshReports }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({});
  const [message, setMessage] = useState({});

  const getReportId = (report) => {
    return report.id || report._id;
  };

  const submitReport = async (report) => {
    const id = getReportId(report);
    setLoading(prev => ({ ...prev, [id]: 'submitting' }));
    setMessage(prev => ({ ...prev, [id]: '' }));

    try {
      await axios.post(
        `http://localhost:8000/reports/${id}/submit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setMessage(prev => ({ ...prev, [id]: '✅ Submitted successfully!' }));
      refreshReports();
      
      setTimeout(() => {
        setMessage(prev => ({ ...prev, [id]: '' }));
      }, 5000);
    } catch (error) {
      console.log(error);
      setMessage(prev => ({ ...prev, [id]: '❌ Submit failed' }));
      setTimeout(() => {
        setMessage(prev => ({ ...prev, [id]: '' }));
      }, 5000);
    } finally {
      setLoading(prev => ({ ...prev, [id]: '' }));
    }
  };

  const deleteReport = async (report) => {
    const id = getReportId(report);
    
    if (!window.confirm('⚠️ Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    setLoading(prev => ({ ...prev, [id]: 'deleting' }));
    setMessage(prev => ({ ...prev, [id]: '' }));

    try {
      await axios.delete(
        `http://localhost:8000/reports/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setMessage(prev => ({ ...prev, [id]: '🗑️ Deleted successfully' }));
      refreshReports();
      
      setTimeout(() => {
        setMessage(prev => ({ ...prev, [id]: '' }));
      }, 5000);
    } catch (error) {
      console.log(error);
      setMessage(prev => ({ ...prev, [id]: '❌ Delete failed' }));
      setTimeout(() => {
        setMessage(prev => ({ ...prev, [id]: '' }));
      }, 5000);
    } finally {
      setLoading(prev => ({ ...prev, [id]: '' }));
    }
  };

  const editReport = (report) => {
    navigate('/', {
      state: {
        editMode: true,
        report: report,
        activeTab: 'dashboard'
      }
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'submitted': { class: 'status-submitted', label: '✓ Submitted' },
      'pending': { class: 'status-pending', label: '⏳ Pending' },
      'draft': { class: 'status-draft', label: '📝 Draft' },
      'review': { class: 'status-review', label: '🔍 In Review' },
      'rejected': { class: 'status-rejected', label: '✗ Rejected' }
    };
    return statusMap[status?.toLowerCase()] || statusMap['draft'];
  };

  return (
    <section className="view-report-container">
      <div className="panel-card">
        <div className="panel-header">
          <div className="header-left">
            <div className="header-badge">
              <i className="fas fa-file-alt"></i>
              <span className="section-kicker">My Reports</span>
            </div>
            <h3>
              <i className="fas fa-list-ul"></i> My Reports
            </h3>
            <p className="header-subtitle">
              View, manage, and submit your weekly reports
            </p>
          </div>
          <div className="report-stats">
            <span className="stat-badge">
              <i className="fas fa-file"></i>
              {reports.length} Reports
            </span>
          </div>
        </div>

        <div className="report-list">
          {reports.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-file-alt"></i>
              <h4>No Reports Yet</h4>
              <p>Create your first weekly report to get started</p>
            </div>
          ) : (
            reports.map((week, index) => (
              <div key={`${week.week_start}-${index}`} className="report-week-card">
                <div className="week-header">
                  <div className="week-info">
                    <i className="fas fa-calendar-week"></i>
                    <span className="week-range">
                      {week.week_start} → {week.week_end}
                    </span>
                  </div>
                  <div className="week-stats">
                    <span className="week-stat">
                      <i className="fas fa-file-alt"></i>
                      {week.reports?.length || 0} entries
                    </span>
                  </div>
                </div>

                <div className="report-items">
                  {week.reports?.map((report) => {
                    const id = getReportId(report);
                    const statusBadge = getStatusBadge(report.status);
                    const isLoading = loading[id];
                    const msg = message[id];

                    return (
                      <div key={id} className="report-item">
                        <div className="report-header">
                          <div className="report-project-info">
                            <h4 className="report-project">
                              <i className="fas fa-folder-open"></i>
                              {report.project}
                            </h4>
                            <span className={`status-badge ${statusBadge.class}`}>
                              {statusBadge.label}
                            </span>
                          </div>
                          <span className="report-hours">
                            <i className="fas fa-clock"></i>
                            {report.hours_worked || 0}h
                          </span>
                        </div>

                        <div className="report-content">
                          <div className="report-tasks">
                            <p className="tasks-label">
                              <i className="fas fa-check-circle"></i> Completed Tasks:
                            </p>
                            <div className="tasks-tags">
                              {report.tasks_completed?.length > 0 ? (
                                report.tasks_completed.map((task, idx) => (
                                  <span key={idx} className="task-tag">
                                    {task}
                                  </span>
                                ))
                              ) : (
                                <span className="no-tasks">No tasks completed</span>
                              )}
                            </div>
                          </div>

                          {report.notes && (
                            <div className="report-notes">
                              <p className="notes-label">
                                <i className="fas fa-sticky-note"></i> Notes:
                              </p>
                              <p className="notes-text">{report.notes}</p>
                            </div>
                          )}
                        </div>

                        {msg && (
                          <div className={`report-message ${msg.includes('✅') || msg.includes('🗑️') ? 'message-success' : 'message-error'}`}>
                            <span>{msg}</span>
                          </div>
                        )}

                        {report.status !== 'submitted' && (
                          <div className="report-actions">
                            <button
                              className="btn-submit"
                              onClick={() => submitReport(report)}
                              disabled={isLoading === 'submitting'}
                            >
                              {isLoading === 'submitting' ? (
                                <>
                                  <span className="spinner-small"></span> Submitting...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-paper-plane"></i> Submit
                                </>
                              )}
                            </button>

                            <button
                              className="btn-edit"
                              onClick={() => editReport(report)}
                              disabled={isLoading}
                            >
                              <i className="fas fa-pen"></i> Edit
                            </button>

                            <button
                              className="btn-delete"
                              onClick={() => deleteReport(report)}
                              disabled={isLoading === 'deleting'}
                            >
                              {isLoading === 'deleting' ? (
                                <>
                                  <span className="spinner-small"></span> Deleting...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-trash"></i> Delete
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {report.status === 'submitted' && (
                          <div className="submitted-badge">
                            <i className="fas fa-check-circle"></i>
                            <span>Report Submitted</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default View_Report;