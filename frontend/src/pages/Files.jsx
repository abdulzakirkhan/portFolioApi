import React from 'react';
import MainLayout from '../components/dashboard/MainLayout';

const Files = () => {
  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
        <h2 className="text-2xl font-bold text-texts mb-6 font-heading">
          Files Management
        </h2>
        <p className="text-secondary">
          Upload, manage, and delete images, media files, and other assets.
        </p>
      </div>
    </MainLayout>
  );
};

export default Files;
