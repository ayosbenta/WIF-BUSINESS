import React from 'react';
import { DashboardIcon, UsersIcon, WifiIcon, PaymentIcon, CloseIcon } from '../icons';

type View = 'dashboard' | 'users' | 'products' | 'payments';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, activeView, setActiveView, icon, label }) => {
  const isActive = activeView === view;
  return (
    <li className="mb-2">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setActiveView(view);
        }}
        className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700'
        }`}
      >
        {icon}
        <span className="ml-3 font-medium">{label}</span>
      </a>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-800 shadow-lg z-30 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-md md:flex-shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
          <WifiIcon className="h-8 w-8 mr-2" />
          <span>WiFiNet</span>
        </h1>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-500 dark:text-slate-400">
            <CloseIcon className="h-6 w-6"/>
        </button>
      </div>
      <nav className="mt-6 px-4">
        <ul>
          <NavItem
            view="dashboard"
            activeView={activeView}
            setActiveView={setActiveView}
            icon={<DashboardIcon className="h-6 w-6" />}
            label="Dashboard"
          />
          <NavItem
            view="users"
            activeView={activeView}
            setActiveView={setActiveView}
            icon={<UsersIcon className="h-6 w-6" />}
            label="Users"
          />
          <NavItem
            view="products"
            activeView={activeView}
            setActiveView={setActiveView}
            icon={<WifiIcon className="h-6 w-6" />}
            label="Products"
          />
          <NavItem
            view="payments"
            activeView={activeView}
            setActiveView={setActiveView}
            icon={<PaymentIcon className="h-6 w-6" />}
            label="Payments"
          />
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
