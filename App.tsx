import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Products from './components/Products';
import Payments from './components/Payments';
import { WifiIcon } from './components/icons';

type View = 'dashboard' | 'users' | 'products' | 'payments';

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoading } = useAppContext();

  // Close sidebar when view changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeView]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'products':
        return <Products />;
      case 'payments':
        return <Payments />;
      default:
        return <Dashboard />;
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'users':
        return 'User Management';
      case 'products':
        return 'WiFi Plans';
      case 'payments':
        return 'Payment Processing';
      default:
        return 'Dashboard';
    }
  };
  
  if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
            <div className="flex flex-col items-center">
                <WifiIcon className="h-12 w-12 text-indigo-600 animate-pulse" />
                <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">Loading Dashboard...</p>
            </div>
        </div>
      );
  }

  return (
      <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={getTitle()} onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
            {renderView()}
          </main>
        </div>
      </div>
  );
}


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
