import React from 'react';
import MainLayout from '../components/dashboard/MainLayout';

const Translations = () => {
  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
        <h2 className="text-2xl font-bold text-texts mb-6 font-heading">
          Translations Management
        </h2>
        <p className="text-secondary">
          Manage multi-language strings and translations for all content.
        </p>
      </div>
    </MainLayout>
  );
};

export default Translations;
