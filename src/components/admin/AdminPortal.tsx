import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

interface AdminPortalProps {
  lang: Language;
  onNavigateHome: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ lang, onNavigateHome }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('yusra_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleLoginSuccess = () => {
    try {
      sessionStorage.setItem('yusra_admin_auth', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('yusra_admin_auth');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
  };

  const handleBackToSite = () => {
    // Navigate back to site root
    try {
      window.history.pushState(null, '', window.location.pathname.startsWith('/admin') ? '/' : '#');
    } catch (e) {
      console.error(e);
    }
    onNavigateHome();
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        lang={lang}
        onLoginSuccess={handleLoginSuccess}
        onBackToSite={handleBackToSite}
      />
    );
  }

  return (
    <AdminDashboard
      isOpen={true}
      isStandalone={true}
      onClose={handleBackToSite}
      onLogout={handleLogout}
      lang={lang}
    />
  );
};
