import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/dashboard/MainLayout';
import { useGetDashboardStatsQuery } from '../services/dashboardApi';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, error } = useGetDashboardStatsQuery();

  const handleCardClick = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
              <p className="text-secondary">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <i className="fa-solid fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
              <p className="text-secondary">Error loading dashboard data</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const stats = dashboardData?.stats || {
    sections: 0,
    items: 0,
    categories: 0,
    files: 0
  };

  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
        <h2 className="text-2xl font-bold text-texts mb-6 font-heading">
          Dashboard Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div 
            className="bg-base-boards rounded-lg p-6 border border-borders hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleCardClick('/dashboard/profile')}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <i className="fa-solid fa-user text-primary text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-texts mb-2 font-heading">
              Profile
            </h3>
            <p className="text-secondary text-sm">
              Manage your personal information
            </p>
          </div>
          
          <div 
            className="bg-base-boards rounded-lg p-6 border border-borders hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleCardClick('/dashboard/sections')}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <i className="fa-solid fa-layer-group text-primary text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-texts mb-2 font-heading">
              Sections
            </h3>
            <p className="text-secondary text-sm">
              Manage portfolio sections
            </p>
          </div>
          
          <div 
            className="bg-base-boards rounded-lg p-6 border border-borders hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleCardClick('/dashboard/items')}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <i className="fa-solid fa-list text-primary text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-texts mb-2 font-heading">
              Items
            </h3>
            <p className="text-secondary text-sm">
              Manage portfolio items and content
            </p>
          </div>

          <div 
            className="bg-base-boards rounded-lg p-6 border border-borders hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleCardClick('/dashboard/categories')}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <i className="fa-solid fa-tags text-primary text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-texts mb-2 font-heading">
              Categories
            </h3>
            <p className="text-secondary text-sm">
              Manage content categories
            </p>
          </div>

          <div 
            className="bg-base-boards rounded-lg p-6 border border-borders hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleCardClick('/dashboard/strings')}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <i className="fa-solid fa-language text-primary text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-texts mb-2 font-heading">
              Translations
            </h3>
            <p className="text-secondary text-sm">
              Manage multi-language strings
            </p>
          </div>

          <div 
            className="bg-base-boards rounded-lg p-6 border border-borders hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleCardClick('/dashboard/files')}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <i className="fa-solid fa-folder text-primary text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-texts mb-2 font-heading">
              Files
            </h3>
            <p className="text-secondary text-sm">
              Manage uploaded files
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-base-boards rounded-lg border border-borders">
          <h3 className="text-lg font-semibold text-texts mb-4 font-heading">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary font-heading">{stats.sections}</p>
              <p className="text-sm text-secondary">Sections</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary font-heading">{stats.items}</p>
              <p className="text-sm text-secondary">Items</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary font-heading">{stats.categories}</p>
              <p className="text-sm text-secondary">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary font-heading">{stats.files}</p>
              <p className="text-sm text-secondary">Files</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
