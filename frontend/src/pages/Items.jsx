import React from 'react';
import MainLayout from '../components/dashboard/MainLayout';

const Items = () => {
  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
        <h2 className="text-2xl font-bold text-texts mb-6 font-heading">
          Items Management
        </h2>
        <p className="text-secondary">
          Manage individual items within each section (job positions, projects, skills, etc.).
        </p>
      </div>
    </MainLayout>
  );
};

export default Items;
