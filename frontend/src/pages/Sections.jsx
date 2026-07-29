import React from 'react';
import MainLayout from '../components/dashboard/MainLayout';

const Sections = () => {
  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
        <h2 className="text-2xl font-bold text-texts mb-6 font-heading">
          Sections Management
        </h2>
        <p className="text-secondary">
          Create, edit, and delete portfolio sections (Experience, Skills, Education, etc.).
        </p>
      </div>
    </MainLayout>
  );
};

export default Sections;
