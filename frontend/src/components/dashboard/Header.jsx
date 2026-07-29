import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';

const Header = () => {
  const user = useSelector(selectUser);

  return (
    <header className="h-16 bg-base-container-bg border-b border-borders flex items-center justify-between px-6">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-texts font-heading">
          Dashboard
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Theme Toggle (placeholder for future implementation) */}
        <button 
          className="p-2 rounded-lg hover:bg-base-boards text-secondary transition-colors"
          aria-label="Toggle theme"
        >
          <i className="fa-solid fa-moon"></i>
        </button>

        {/* Notifications (placeholder for future implementation) */}
        <button 
          className="p-2 rounded-lg hover:bg-base-boards text-secondary transition-colors relative"
          aria-label="Notifications"
        >
          <i className="fa-solid fa-bell"></i>
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-3 pl-4 border-l border-borders">
          <div className="text-right">
            <p className="text-sm font-medium text-texts font-heading">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-secondary">
              {user?.email || 'admin@portfolio.com'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <i className="fa-solid fa-user text-primary"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
