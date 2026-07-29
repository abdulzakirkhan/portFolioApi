import React, { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <div className="min-h-screen bg-base-bg">
        <Sidebar />
        
        <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Header />
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default MainLayout;
