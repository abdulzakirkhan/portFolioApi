import React, { useState } from 'react';
import MainLayout from '../components/dashboard/MainLayout';
import AchievementForm from '../components/achievements/AchievementForm';
import AchievementList from '../components/achievements/AchievementList';
import { useGetAchievementsQuery, useDeleteAchievementMutation } from '../services/achievementsApi';

const Achievements = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const { data: achievements = [], isLoading, isError, error } = useGetAchievementsQuery();
  const [deleteAchievement] = useDeleteAchievementMutation();

  const handleAdd = () => {
    setEditingAchievement(null);
    setShowForm(true);
  };

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) {
      return;
    }

    try {
      await deleteAchievement(id).unwrap();
    } catch (err) {
      console.error('Failed to delete achievement', err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAchievement(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAchievement(null);
  };

  const renderError = () => {
    if (!isError) return null;
    const message = error?.data?.message || error?.error || 'Failed to load achievements';
    return (
      <div className="p-4 bg-danger/20 border border-danger text-texts m-6 rounded-lg">
        {message}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl border border-borders overflow-hidden">
        <div className="p-6 border-b border-borders flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-texts font-heading">Career Achievements</h2>
            <p className="text-secondary mt-1">Manage technical and professional achievement entries shown in your portfolio timeline.</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-primary hover:bg-primary/80 text-texts-inverted px-4 py-2 rounded-lg transition duration-200 font-heading"
          >
            Add Achievement
          </button>
        </div>

        {renderError()}

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-secondary">Loading achievements...</div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-16 text-secondary">No achievements yet. Start by adding a new achievement.</div>
          ) : (
            <AchievementList achievements={achievements} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>

      {showForm && (
        <AchievementForm achievement={editingAchievement} onClose={handleFormClose} onSuccess={handleFormSuccess} />
      )}
    </MainLayout>
  );
};

export default Achievements;
