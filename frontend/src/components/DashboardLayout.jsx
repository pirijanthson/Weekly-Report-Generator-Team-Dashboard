// DashboardLayout.jsx
import { Link } from 'react-router-dom'
import './DashboardLayout.css'

/* Nav item icons mapping */
const NAV_ICONS = {
  dashboard:      'tachometer-alt',
  reports:        'file-alt',
  projects:       'project-diagram',
  profile:        'user-circle',
  overview:       'chart-pie',
  team:           'users-cog',
  create_project: 'plus-circle',
  view_projects:  'folder-open',
}

function DashboardLayout({
  title,
  subtitle,
  navItems,
  activeTab,
  setActiveTab,
  user,
  logout,
  children,
  showUserCard = true
}) {
  return (
    <div className="dashboard-shell">
      {/* Animated background particles */}
      <div className="dashboard-bg">
        <div className="dashboard-bg-orb dashboard-bg-orb-1" />
        <div className="dashboard-bg-orb dashboard-bg-orb-2" />
        <div className="dashboard-bg-orb dashboard-bg-orb-3" />
        <div className="dashboard-grid-overlay" />
      </div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-shimmer" />

        <div className="dashboard-header-left">
          <div className="dashboard-brand">
            <div className="brand-icon">
              <i className="fas fa-chart-line" />
              <div className="brand-icon-pulse" />
            </div>
            <div>
              <p className="dashboard-eyebrow">
                <span className="eyebrow-dot" />
                {title}
              </p>
              <h2>{subtitle}</h2>
            </div>
          </div>
        </div>

        <nav className="dashboard-actions" aria-label="Navigation">
          <Link
            className="dashboard-platform-link"
            to={user?.role === 'admin' ? '/admin' : '/'}
            aria-label="Go to platform home"
          >
            <i className="fas fa-th-large" /> Platform
          </Link>

          <div className="dashboard-nav-tabs">
            {navItems.map((item) => {
              const icon = NAV_ICONS[item.id] || 'circle'
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`dashboard-tab ${activeTab === item.id ? 'active' : ''}`}
                  aria-label={item.label}
                >
                  <i className={`fas fa-${icon}`} />
                  <span>{item.label}</span>
                  {activeTab === item.id && <span className="tab-active-indicator" />}
                </button>
              )
            })}
          </div>

          <div className="dashboard-user-menu">
            <div className="user-avatar" title={user?.full_name}>
              <span>{user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
              <div className="user-avatar-ring" />
            </div>
            <div className="user-info-mini">
              <span className="user-info-name">{user?.full_name?.split(' ')[0] || 'User'}</span>
              <span className="user-info-role">{user?.role || 'member'}</span>
            </div>
            <button className="dashboard-logout" onClick={logout} title="Sign out">
              <i className="fas fa-sign-out-alt" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* User Card */}
        {showUserCard && user && (
          <div className="dashboard-user-card">
            <div className="user-card-avatar">
              <span>{user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
              <div className="user-card-avatar-ring" />
            </div>
            <div className="user-card-info">
              <p className="dashboard-user-label">
                <i className="fas fa-circle" style={{ color: '#22c55e', fontSize: '0.5rem' }} />
                Online
              </p>
              <h3>{user?.full_name || 'User'}</h3>
              <p className="user-email">
                <i className="fas fa-envelope" /> {user?.email || 'No email available'}
              </p>
              <div className="user-role-badge">
                <i className="fas fa-shield-alt" />
                {user?.role || 'Member'}
              </div>
            </div>

            {/* Decorative orbit rings */}
            <div className="user-card-decoration">
              <div className="orbit-ring orbit-ring-1">
                <div className="orbit-dot orbit-dot-blue" />
              </div>
              <div className="orbit-ring orbit-ring-2">
                <div className="orbit-dot orbit-dot-violet" />
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="dashboard-content" key={activeTab}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>
            <span className="footer-logo-text">TeamPulse</span>
            {' '}© 2026 · Built for high-performance teams
          </p>
          <div className="footer-links">
            <a href="#"><i className="fas fa-cog" /> Settings</a>
            <a href="#"><i className="fas fa-life-ring" /> Help</a>
            <a href="#"><i className="fas fa-file-alt" /> Docs</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DashboardLayout