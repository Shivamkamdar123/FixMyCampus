import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import StudentDashboard from './components/Student/Dashboard';
import ReportIssue from './components/Student/ReportIssue';
import MyIssues from './components/Student/MyIssues';
import AdminDashboard from './components/Admin/AdminDashboard';
import IssueManagement from './components/Admin/IssueManagement';
import Analytics from './components/Admin/Analytics';

const AuthWrapper: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? 
    <LoginForm onToggleMode={() => setIsLogin(false)} /> :
    <RegisterForm onToggleMode={() => setIsLogin(true)} />;
};

const AppContent: React.FC = () => {
  const { state } = useApp();

  if (!state.auth.isAuthenticated) {
    return <AuthWrapper />;
  }

  const isAdmin = state.auth.user?.role === 'admin';

  return (
    <Layout>
      <Routes>
        {isAdmin ? (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/issues" element={<IssueManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/settings" element={<div className="p-6 text-center text-gray-500">Settings coming soon...</div>} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/issues" element={<MyIssues />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;