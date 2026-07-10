// EmployeeDashboardPage.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Create_Report from '../../components/Create_Report';
import View_Report from '../../components/View_Report';
import ProjectSection from '../../components/ProjectSection';
import ProfileSection from '../../components/ProfileSection';
import './EmployeeDashboardPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const getAuthToken = () => localStorage.getItem('token');

function EmployeeDashboardPage({
  user,
  logout,
  activeTab,
  setActiveTab,
  navItems
}) {
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  // Edit report data
  const editMode = location.state?.editMode || false;
  const editReport = location.state?.report || null;

  // Automatically open dashboard when Edit clicked
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    } else if (editMode) {
      setActiveTab('dashboard');
    }
  }, [location.state, editMode, setActiveTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${getAuthToken()}`
      };

      const [reportsRes, projectRes, profileRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE}/reports/view`, { headers }),
        fetch(`${API_BASE}/projects/my-projects`, { headers }),
        fetch(`${API_BASE}/users/profile`, { headers }),
        fetch(`${API_BASE}/dashboard/summary`, { headers })
      ]);

      const reportsData = await reportsRes.json();
      const projectData = await projectRes.json();
      const profileData = await profileRes.json();
      const summaryData = await summaryRes.json();

      setReports(reportsData.reports || []);
      setProjects(projectData.projects || []);
      setProfile(profileData.user);
      setSummary(summaryData.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <DashboardLayout
        title="Team Dashboard"
        subtitle={`Hello, ${user?.full_name || 'Employee'}`}
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
      >
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your workspace...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Team Dashboard"
      subtitle={`Hello, ${user?.full_name || 'Employee'}`}
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      user={user}
      logout={logout}
    >
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-text">
            <h2>
              <em className="wave-emoji">👋</em>
              Welcome back, {user?.full_name?.split(' ')[0] || 'Employee'}!
            </h2>
            <p>Here's what's happening with your work this week</p>
          </div>
          <div className="welcome-stats">
            <div className="stat-chip">
              <i className="fas fa-file-alt"></i>
              <span>{reports.length} Reports</span>
            </div>
            <div className="stat-chip">
              <i className="fas fa-project-diagram"></i>
              <span>{projects.length} Projects</span>
            </div>
            {summary && (
              <div className="stat-chip">
                <i className="fas fa-chart-line"></i>
                <span>{summary.submission_compliance_rate || '0%'} Compliance</span>
              </div>
            )}
            <div className="stat-chip">
              <i className="fas fa-clock"></i>
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'dashboard' && (
          <Create_Report
            refresh={loadData}
            apiBase={API_BASE}
            getAuthToken={getAuthToken}
            editMode={editMode}
            editReport={editReport}
          />
        )}

        {activeTab === 'reports' && (
          <View_Report
            reports={reports}
            refreshReports={loadData}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectSection
            projects={projects}
            refresh={loadData}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSection
            profile={profile}
            onUpdateProfile={loadData}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default EmployeeDashboardPage;