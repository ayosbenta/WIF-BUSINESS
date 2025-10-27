import React from 'react';
import { MenuIcon } from '../icons';
import { useAppContext } from '../../context/AppContext';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick, onExport }) => {
  const { userRole } = useAppContext();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm p-4 flex-shrink-0">
      <div className="flex items-center justify-between">
         <div className="flex items-center">
             <button onClick={onMenuClick} className="md:hidden mr-4 text-slate-600 dark:text-slate-300">
                <MenuIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
         </div>
        <div className="flex items-center space-x-4">
          {userRole === 'admin' && (
            <button 
              onClick={onExport}
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 dark:bg-slate-700 dark:text-indigo-400 dark:hover:bg-slate-600"
              aria-label="Export data to Excel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Export Data
            </button>
          )}
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://picsum.photos/100"
            alt="User avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;