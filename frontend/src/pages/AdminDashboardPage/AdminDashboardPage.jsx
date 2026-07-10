// AdminDashboardPage.jsx
import { useEffect, useState, useCallback, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import DashboardLayout from '../../components/DashboardLayout'
import ProjectSection from '../../components/ProjectSection'
import CreateProject from '../../components/CreateProject'
import './AdminDashboardPage.css'

Chart.register(...registerables);

// Chart Components
function TaskTrendChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedData.map(d => d.date);
    const values = sortedData.map(d => d.tasks_completed);

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Tasks Completed',
          data: values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#3b82f6',
          pointHoverRadius: 6,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#1e293b',
            titleColor: '#f1f5f9',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#94a3b8', font: { size: 11 }, stepSize: 1 }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ height: '240px', width: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

function MemberStatusChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    const labels = data.map(d => d.name || d.full_name || 'Unknown');
    const submitted = data.map(d => d.submitted || 0);
    const pending = data.map(d => d.pending || 0);
    const late = data.map(d => d.late || 0);

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Submitted',
            data: submitted,
            backgroundColor: '#10b981',
            borderRadius: 4
          },
          {
            label: 'Pending',
            data: pending,
            backgroundColor: '#f59e0b',
            borderRadius: 4
          },
          {
            label: 'Late',
            data: late,
            backgroundColor: '#ef4444',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#cbd5e1', boxWidth: 12, font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#f1f5f9',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#94a3b8', font: { size: 11 }, stepSize: 1 }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ height: '240px', width: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

function ProjectWorkloadChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    const labels = data.map(d => d.project || 'Unknown');
    const values = data.map(d => d.total_tasks || 0);

    const colors = [
      '#6366f1',
      '#8b5cf6',
      '#ec4899',
      '#3b82f6',
      '#14b8a6',
      '#f59e0b'
    ];

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1,
          borderColor: '#1e293b'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#cbd5e1', boxWidth: 12, font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#f1f5f9',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1
          }
        },
        cutout: '70%'
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ height: '240px', width: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

function ActivityFeed({ activities }) {
  const formatTime = (timeStr) => {
    if (!timeStr) return 'Recent';
    try {
      const date = new Date(timeStr);
      return date.toLocaleString();
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="activity-feed-list">
      {activities && activities.length > 0 ? (
        activities.map((act, index) => (
          <div key={index} className="activity-feed-item">
            <div className="activity-icon-container">
              <i className={act.status === 'submitted' ? "fas fa-check-circle" : "fas fa-clock"}></i>
            </div>
            <div className="activity-details">
              <p className="activity-text">
                <strong>{act.user || act.email}</strong> {act.status === 'submitted' ? 'submitted' : 'updated'} report for <strong>{act.project}</strong>
              </p>
              <span className="activity-time">{formatTime(act.submitted_at || act.updated_at)}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <i className="fas fa-history"></i>
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
}

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      message: "Hello! I am TeamPulse AI, your team activity assistant. Ask me questions about weekly reports, blockers, or request a team-wide summary!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", message: userMsg }]);
    setLoading(true);

    try {
      const history = messages.slice(1).map(m => ({
        role: m.role,
        message: m.message
      }));

      const res = await fetch(`${API_BASE}/dashboard/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          message: userMsg,
          history: history
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to communicate with AI");
      }

      setMessages(prev => [...prev, { role: "assistant", message: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        message: `⚠️ Error: ${err.message || "Could not reach AI assistant. Make sure the backend is running."}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-widget-container">
      <button
        className={`ai-chat-toggle-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Ask TeamPulse AI"
      >
        {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-robot"></i>}
      </button>

      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <i className="fas fa-robot"></i>
              <div>
                <h5>TeamPulse AI</h5>
                <span>Online & Ready</span>
              </div>
            </div>
            <button className="ai-chat-close-btn" onClick={() => setIsOpen(false)}>
              <i className="fas fa-minus"></i>
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                <div className="message-bubble">
                  {msg.message.split("\n").map((line, i) => (
                    <p key={i} style={{ margin: line.trim() === "" ? "0.5rem 0" : "0" }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message assistant loading">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={sendMessage} className="ai-chat-input-area">
            <input
              type="text"
              placeholder="Ask about team status, blockers..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" disabled={loading || !input.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

const getAuthToken = () => localStorage.getItem('token')

function OverviewSection({
  summary,
  reports,
  projects,
  taskTrend,
  memberStatus,
  projectWorkload,
  activityFeed
}) {
  return (
    <div className="overview-container">

      <div className="kpi-grid">
        <div className="kpi-card kpi-card-amber">
          <div className="kpi-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Reports This Week</p>
            <p className="kpi-value">{summary?.total_reports_this_week || 0}</p>
          </div>
        </div>

        <div className="kpi-card kpi-card-emerald">
          <div className="kpi-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Compliance Rate</p>
            <p className="kpi-value">{summary?.submission_compliance_rate || '0%'}</p>
          </div>
        </div>

        <div className="kpi-card kpi-card-cyan">
          <div className="kpi-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Open Blockers</p>
            <p className="kpi-value">{summary?.open_blockers || 0}</p>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="dashboard-charts-grid">
        <div className="chart-card">
          <h4><i className="fas fa-chart-line"></i> Tasks Completed Trend</h4>
          <TaskTrendChart data={taskTrend} />
        </div>

        <div className="chart-card">
          <h4><i className="fas fa-chart-bar"></i> Submission Status by Member</h4>
          <MemberStatusChart data={memberStatus} />
        </div>

        <div className="chart-card">
          <h4><i className="fas fa-chart-pie"></i> Workload by Project</h4>
          <ProjectWorkloadChart data={projectWorkload} />
        </div>
      </div>

      <div className="overview-grid">
        {/* Recent Activity Feed */}
        <section className="overview-section">
          <div className="section-header">
            <h3 className="section-title">
              <i className="fas fa-history"></i> Recent Activity Feed
            </h3>
            <span className="section-badge">Latest</span>
          </div>
          <ActivityFeed activities={activityFeed} />
        </section>

        {/* Projects */}
        <section className="overview-section">
          <div className="section-header">
            <h3 className="section-title">
              <i className="fas fa-project-diagram"></i> Tracked Projects
            </h3>
            <span className="section-badge">{projects.length}</span>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="project-item-content">
                  <div className="project-icon">
                    <i className="fas fa-folder-open"></i>
                  </div>
                  <div className="project-item-info">
                    <p className="project-item-name">{project.name}</p>
                    <p className="project-item-desc">
                      {project.description || 'No description'}
                    </p>
                  </div>
                </div>
                <div className="project-status">
                  <span className="status-dot status-dot-active"></span>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="empty-state">
                <i className="fas fa-folder-plus"></i>
                <p>No projects yet</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function TeamReportSection({ apiBase }) {
  const [reports, setReports] = useState([])
  const [memberStatus, setMemberStatus] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [expandedRow, setExpandedRow] = useState(null)

  // Filter state
  const [filterWeek, setFilterWeek] = useState('')
  const [filterEmail, setFilterEmail] = useState('')
  const [filterProject, setFilterProject] = useState('')
  const [filterStart, setFilterStart] = useState('')
  const [filterEnd, setFilterEnd] = useState('')

  const getAuthToken = () => localStorage.getItem('token')

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/projects/view`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      })
      const data = await res.json()
      setProjects(data.projects || [])
    } catch {}
  }, [apiBase])

  const loadMemberStatus = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/dashboard/member-status`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      })
      const data = await res.json()
      setMemberStatus(data.data || [])
    } catch {}
  }, [apiBase])

  const loadReports = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterWeek) params.append('week', filterWeek)
      if (filterEmail) params.append('email', filterEmail)
      if (filterProject) params.append('project', filterProject)
      if (filterStart) params.append('start_date', filterStart)
      if (filterEnd) params.append('end_date', filterEnd)
      const url = `${apiBase}/dashboard/reports${params.toString() ? '?' + params.toString() : ''}`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      })
      const data = await res.json()
      setReports(data.reports || [])
    } catch {}
    finally { setLoading(false) }
  }, [apiBase, filterWeek, filterEmail, filterProject, filterStart, filterEnd])

  useEffect(() => {
    loadProjects()
    loadMemberStatus()
    loadReports()
  }, [loadProjects, loadMemberStatus, loadReports])

  const handleApplyFilters = (e) => {
    e.preventDefault()
    loadReports()
  }

  const handleClearFilters = () => {
    setFilterWeek('')
    setFilterEmail('')
    setFilterProject('')
    setFilterStart('')
    setFilterEnd('')
  }

  const statusCount = reports.reduce(
    (acc, r) => {
      const s = (r.status || 'pending').toLowerCase()
      acc[s] = (acc[s] || 0) + 1
      return acc
    },
    {}
  )

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'submitted') return 'status-badge-submitted'
    if (s === 'late') return 'status-badge-late'
    return 'status-badge-pending'
  }

  const getMemberStatusClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'submitted') return 'ms-submitted'
    if (s === 'late') return 'ms-late'
    return 'ms-pending'
  }

  return (
    <section className="team-report-section">
      {/* Header */}
      <div className="trd-header">
        <div className="trd-title-group">
          <i className="fas fa-users-cog trd-icon"></i>
          <div>
            <h2 className="trd-title">Team Dashboard</h2>
            <p className="trd-subtitle">Manager view — analyse & filter team reports</p>
          </div>
        </div>
        <div className="trd-stats-bar">
          <div className="trd-stat trd-stat-submitted">
            <i className="fas fa-check-circle"></i>
            <span>{statusCount['submitted'] || 0} Submitted</span>
          </div>
          <div className="trd-stat trd-stat-pending">
            <i className="fas fa-hourglass-half"></i>
            <span>{statusCount['pending'] || 0} Pending</span>
          </div>
          <div className="trd-stat trd-stat-late">
            <i className="fas fa-exclamation-circle"></i>
            <span>{statusCount['late'] || 0} Late</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <form className="trd-filter-bar" onSubmit={handleApplyFilters}>
        <div className="trd-filter-group">
          <label className="trd-filter-label">
            <i className="fas fa-calendar-week"></i> Week
          </label>
          <input
            type="date"
            value={filterWeek}
            onChange={e => setFilterWeek(e.target.value)}
            className="trd-filter-input"
            placeholder="Select week"
          />
        </div>
        <div className="trd-filter-group">
          <label className="trd-filter-label">
            <i className="fas fa-user"></i> Member
          </label>
          <input
            type="text"
            value={filterEmail}
            onChange={e => setFilterEmail(e.target.value)}
            className="trd-filter-input"
            placeholder="Filter by email"
          />
        </div>
        <div className="trd-filter-group">
          <label className="trd-filter-label">
            <i className="fas fa-folder"></i> Project
          </label>
          <select
            value={filterProject}
            onChange={e => setFilterProject(e.target.value)}
            className="trd-filter-input"
          >
            <option value="">All Projects</option>
            {projects.map((p, i) => (
              <option key={i} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="trd-filter-group">
          <label className="trd-filter-label">
            <i className="fas fa-calendar-alt"></i> From
          </label>
          <input
            type="date"
            value={filterStart}
            onChange={e => setFilterStart(e.target.value)}
            className="trd-filter-input"
          />
        </div>
        <div className="trd-filter-group">
          <label className="trd-filter-label">
            <i className="fas fa-calendar-check"></i> To
          </label>
          <input
            type="date"
            value={filterEnd}
            onChange={e => setFilterEnd(e.target.value)}
            className="trd-filter-input"
          />
        </div>
        <div className="trd-filter-actions">
          <button type="submit" className="btn-primary" id="apply-team-filters">
            <i className="fas fa-filter"></i> Apply
          </button>
          <button type="button" className="btn-ghost" onClick={handleClearFilters} id="clear-team-filters">
            <i className="fas fa-times"></i> Clear
          </button>
        </div>
      </form>

      {/* Member Submission Status */}
      {memberStatus.length > 0 && (
        <div className="trd-member-status">
          <h4 className="trd-subsection-title">
            <i className="fas fa-clipboard-list"></i> Member Submission Status
          </h4>
          <div className="ms-grid">
            {memberStatus.map((m, i) => (
              <div key={i} className={`ms-card ${getMemberStatusClass(m.status)}`}>
                <div className="ms-avatar">
                  {(m.email || m.name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="ms-info">
                  <p className="ms-name">{m.full_name || m.name || m.email}</p>
                  <p className="ms-email">{m.email}</p>
                  <p className="ms-reports">{m.report_count ?? m.total_reports ?? '—'} reports</p>
                </div>
                <span className={`ms-status-pill ${getMemberStatusClass(m.status)}`}>
                  {m.status || 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Table */}
      <div className="trd-table-container">
        <div className="trd-table-header">
          <span className="trd-result-count">
            {loading ? 'Loading…' : `${reports.length} report${reports.length !== 1 ? 's' : ''} found`}
          </span>
        </div>
        {loading ? (
          <div className="trd-loading">
            <div className="loading-spinner"></div>
            <p>Fetching reports…</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="report-table" id="team-reports-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Member</th>
                  <th>Project / Category</th>
                  <th>Week</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-table">
                      <i className="fas fa-inbox"></i>
                      <p>No reports match the selected filters</p>
                    </td>
                  </tr>
                ) : (
                  reports.map((report, index) => (
                    <>
                      <tr
                        key={`row-${index}`}
                        className={`report-row ${expandedRow === index ? 'report-row-expanded' : ''}`}
                        onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                      >
                        <td className="td-expand">
                          <span className="expand-btn">
                            <i className={`fas fa-chevron-${expandedRow === index ? 'up' : 'down'}`}></i>
                          </span>
                        </td>
                        <td>
                          <div className="table-member">
                            <span className="table-avatar">
                              {report.email?.charAt(0).toUpperCase() || 'U'}
                            </span>
                            <span className="member-email">{report.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className="project-chip">
                            <i className="fas fa-folder"></i> {report.project || '—'}
                          </span>
                        </td>
                        <td>
                          <span className="week-badge">{report.week_start || '—'}</span>
                        </td>
                        <td className="td-date">
                          {report.submitted_at
                            ? new Date(report.submitted_at).toLocaleString()
                            : <span className="no-date">—</span>}
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusClass(report.status)}`}>
                            {report.status === 'submitted' && <i className="fas fa-check"></i>}
                            {report.status === 'pending' && <i className="fas fa-clock"></i>}
                            {report.status === 'late' && <i className="fas fa-exclamation"></i>}
                            {' '}{report.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                      {expandedRow === index && (
                        <tr key={`detail-${index}`} className="report-detail-row">
                          <td colSpan="6">
                            <div className="report-detail">
                              {report.tasks && report.tasks.length > 0 && (
                                <div className="detail-block">
                                  <h5><i className="fas fa-tasks"></i> Tasks</h5>
                                  <ul className="detail-list">
                                    {report.tasks.map((t, ti) => (
                                      <li key={ti}>{t.title || t.name || t}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {report.achievements && (
                                <div className="detail-block">
                                  <h5><i className="fas fa-star"></i> Achievements</h5>
                                  <p>{report.achievements}</p>
                                </div>
                              )}
                              {report.blockers && (
                                <div className="detail-block">
                                  <h5><i className="fas fa-ban"></i> Blockers</h5>
                                  <p>{report.blockers}</p>
                                </div>
                              )}
                              {report.next_week_plan && (
                                <div className="detail-block">
                                  <h5><i className="fas fa-calendar-plus"></i> Next Week Plan</h5>
                                  <p>{report.next_week_plan}</p>
                                </div>
                              )}
                              {!report.tasks && !report.achievements && !report.blockers && !report.next_week_plan && (
                                <p className="detail-empty">No additional details available.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

function AdminDashboardPage({
  user,
  logout,
  activeTab,
  setActiveTab,
  navItems
}) {
  const [summary, setSummary] = useState(null)
  const [reports, setReports] = useState([])
  const [projects, setProjects] = useState([])
  const [taskTrend, setTaskTrend] = useState([])
  const [memberStatus, setMemberStatus] = useState([])
  const [projectWorkload, setProjectWorkload] = useState([])
  const [activityFeed, setActivityFeed] = useState([])
  const [loading, setLoading] = useState(true)


  const loadData = async () => {
    setLoading(true)
    try {
      const headers = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      const [
        summaryRes,
        reportsRes,
        projectsRes,
        trendRes,
        memberStatusRes,
        workloadRes,
        activityRes
      ] = await Promise.all([
        fetch(`${API_BASE}/dashboard/summary`, { headers }),
        fetch(`${API_BASE}/dashboard/reports`, { headers }),
        fetch(`${API_BASE}/projects/view`, { headers }),
        fetch(`${API_BASE}/dashboard/task-trend`, { headers }),
        fetch(`${API_BASE}/dashboard/member-status`, { headers }),
        fetch(`${API_BASE}/dashboard/project-workload`, { headers }),
        fetch(`${API_BASE}/dashboard/activity`, { headers })
      ])
      const summaryData = await summaryRes.json()
      const reportsData = await reportsRes.json()
      const projectData = await projectsRes.json()
      const trendData = await trendRes.json()
      const memberStatusData = await memberStatusRes.json()
      const workloadData = await workloadRes.json()
      const activityData = await activityRes.json()

      setSummary(summaryData.data)
      setReports(reportsData.reports || [])
      setProjects(projectData.projects || [])
      setTaskTrend(trendData.data || [])
      setMemberStatus(memberStatusData.data || [])
      setProjectWorkload(workloadData.data || [])
      setActivityFeed(activityData.activities || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <>
    <DashboardLayout
      title="Admin Console"
      subtitle={`Operations overview for ${user?.full_name || 'Admin'}`}
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      user={user}
      logout={logout}
      showUserCard={false}
    >
      {loading ? (
        <div className="page-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <OverviewSection
              summary={summary}
              reports={reports}
              projects={projects}
              taskTrend={taskTrend}
              memberStatus={memberStatus}
              projectWorkload={projectWorkload}
              activityFeed={activityFeed}
            />
          )}
          {activeTab === 'team' && (
            <TeamReportSection apiBase={API_BASE} />
          )}
          {activeTab === 'create_project' && (
            <CreateProject refresh={loadData} />
          )}
          {activeTab === 'view_projects' && (
            <ProjectSection projects={projects} refresh={loadData} />
          )}
        </>
      )}
    </DashboardLayout>
    <AIChatWidget />
    </>
  )
}

export default AdminDashboardPage
