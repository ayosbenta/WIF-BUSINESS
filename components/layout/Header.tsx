import React from 'react';
import { MenuIcon } from '../icons';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm p-4 flex-shrink-0">
      <div className="flex items-center justify-between">
         <div className="flex items-center">
             <button onClick={onMenuClick} className="md:hidden mr-4 text-slate-600 dark:text-slate-300">
                <MenuIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
         </div>
        <div>
          {/* Placeholder for user menu or actions */}
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
