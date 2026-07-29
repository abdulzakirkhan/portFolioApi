import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSidebar } from './MainLayout';

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: 'fa-home',
      label: 'Overview'
    },
    {
      path: '/dashboard/profile',
      icon: 'fa-user',
      label: 'Profile'
    },
    {
      path: '/dashboard/about',
      icon: 'fa-id-card',
      label: 'About Me'
    },
    {
      path: '/dashboard/sections',
      icon: 'fa-layer-group',
      label: 'Sections'
    },
    {
      path: '/dashboard/items',
      icon: 'fa-list',
      label: 'Items'
    },
    {
      path: '/dashboard/categories',
      icon: 'fa-tags',
      label: 'Categories'
    },
    {
      path: '/dashboard/strings',
      icon: 'fa-language',
      label: 'Translations'
    },
    {
      path: '/dashboard/files',
      icon: 'fa-folder',
      label: 'Files'
    }
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-base-container-bg border-r border-borders transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo/Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-borders">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-texts font-heading">
            Portfolio
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-base-boards text-secondary transition-colors"
          aria-label="Toggle sidebar"
        >
          <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-secondary hover:bg-base-boards hover:text-texts'
              }`}
            >
              <i className={`fa-solid ${item.icon} ${isCollapsed ? 'mx-auto' : 'mr-3'}`}></i>
              {!isCollapsed && (
                <span className="font-heading font-medium">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-borders">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <i className="fa-solid fa-user text-primary text-sm"></i>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-texts font-heading">Admin</p>
              <p className="text-xs text-secondary">Dashboard</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
