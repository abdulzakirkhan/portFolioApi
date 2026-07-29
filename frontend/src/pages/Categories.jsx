import React from 'react';
import MainLayout from '../components/dashboard/MainLayout';

const Categories = () => {
  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
        <h2 className="text-2xl font-bold text-texts mb-6 font-heading">
          Categories Management
        </h2>
        <p className="text-secondary">
          Manage content categories (Background, Showcase, Home, etc.).
        </p>
      </div>
    </MainLayout>
  );
};

export default Categories;
