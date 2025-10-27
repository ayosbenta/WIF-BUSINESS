import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Products from './components/Products';
import Payments from './components/Payments';
import DueDates from './components/DueDates';
import LoginPage from './components/LoginPage';
import { WifiIcon } from './components/icons';
import { dataService } from './services/api';

type View = 'dashboard' | 'users' | 'plans' | 'payments' | 'duedates';
export type UserRole = 'admin' | 'collector';

const LoadingScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
        <WifiIcon className="w-16 h-16 text-indigo-600 animate-pulse" />
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Loading your data...</p>
    </div>
);

const ErrorScreen: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="flex items-center justify-center h-screen bg-slate-100 dark:bg-slate-900 p-4">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-2xl dark:bg-slate-800 text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Failed to Load Data</h2>
            <p className="text-slate-600 dark:text-slate-400">{message}</p>
            <button
                onClick={onRetry}
                className="inline-flex items-center px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-lg"
            >
                Retry
            </button>
        </div>
    </div>
);


const AppContent: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { state, isLoading, error, reloadData, userRole } = useAppContext();
  const [activeView, setActiveView] = useState<View>(userRole === 'collector' ? 'payments' : 'dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Close sidebar when view changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeView]);

  const handleExport = () => {
      dataService.exportToFile(state, `wifi_dashboard_export_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  if (isLoading) {
      return <LoadingScreen />;
  }

  if (error) {
      return <ErrorScreen message={error} onRetry={reloadData} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return userRole === 'admin' ? <Dashboard /> : <Payments />;
      case 'users':
        return userRole === 'admin' ? <Users /> : <Payments />;
      case 'plans':
        return userRole === 'admin' ? <Products /> : <Payments />;
      case 'duedates':
        return userRole === 'admin' ? <DueDates /> : <Payments />;
      case 'payments':
        return <Payments />;
      default:
        return userRole === 'admin' ? <Dashboard /> : <Payments />;
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'users':
        return 'User Management';
      case 'plans':
        return 'WiFi Plans';
      case 'duedates':
        return 'Due Dates & Reminders';
      case 'payments':
        return 'Payment Processing';
      default:
        return 'Dashboard';
    }
  };
  
  return (
      <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onLogout={onLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={getTitle()} onMenuClick={() => setIsSidebarOpen(true)} onExport={handleExport} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
            {renderView()}
          </main>
        </div>
      </div>
  );
}


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLogout = () => {
      setIsAuthenticated(false);
      setUserRole(null);
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={(role) => {
        setUserRole(role);
        setIsAuthenticated(true);
    }} />;
  }
  
  return (
    <AppProvider userRole={userRole}>
      <AppContent onLogout={handleLogout} />
    </AppProvider>
  );
};

export default App;