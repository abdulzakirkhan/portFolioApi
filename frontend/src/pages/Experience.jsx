import React, { useState } from 'react';
import MainLayout from '../components/dashboard/MainLayout';
import ExperienceForm from '../components/experience/ExperienceForm';
import ExperienceList from '../components/experience/ExperienceList';
import { useGetExperiencesQuery, useDeleteExperienceMutation } from '../services/experienceApi';

const Experience = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const { data: experiences = [], isLoading, isError, error } = useGetExperiencesQuery();
  const [deleteExperience] = useDeleteExperienceMutation();

  const handleAdd = () => {
    setEditingExperience(null);
    setShowForm(true);
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      await deleteExperience(id).unwrap();
    } catch (err) {
      console.error('Failed to delete experience', err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExperience(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExperience(null);
  };

  const renderError = () => {
    if (!isError) return null;

    const message = error?.data?.message || error?.error || 'Failed to load experiences';
    return (
      <div className="p-4 bg-danger/20 border border-danger text-texts m-6 rounded-lg">
        {message}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl border border-borders">
        <div className="p-6 border-b border-borders flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-texts font-heading">Experience Management</h2>
            <p className="text-secondary mt-1">Add and manage experience entries with company logo and technology tags.</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-primary hover:bg-primary/80 text-texts-inverted px-4 py-2 rounded-lg transition duration-200 font-heading"
          >
            Add Experience
          </button>
        </div>

        {renderError()}

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-secondary">Loading experiences...</div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12 text-secondary">No experiences yet. Add your first experience.</div>
          ) : (
            <ExperienceList experiences={experiences} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>

      {showForm && (
        <ExperienceForm experience={editingExperience} onClose={handleFormClose} onSuccess={handleFormSuccess} />
      )}
    </MainLayout>
  );
};

export default Experience;
