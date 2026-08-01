import React, { useState, useEffect } from 'react';
import MainLayout from '../components/dashboard/MainLayout';
import SkillForm from '../components/skills/SkillForm';
import SkillList from '../components/skills/SkillList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/skills`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSkills(data.data);
      } else {
        setError(data.message || 'Failed to fetch skills');
      }
    } catch (err) {
      setError('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAdd = () => {
    setEditingSkill(null);
    setShowForm(true);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/skills/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchSkills();
      } else {
        setError(data.message || 'Failed to delete skill');
      }
    } catch (err) {
      setError('Failed to delete skill');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSkill(null);
    fetchSkills();
  };

  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl border border-borders">
        <div className="p-6 border-b border-borders flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-texts font-heading">Skills Management</h2>
            <p className="text-secondary mt-1">Add, update, and remove core focus area skills.</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-primary hover:bg-primary/80 text-texts-inverted px-4 py-2 rounded-lg transition duration-200 font-heading"
          >
            Add Skill
          </button>
        </div>

        {error && (
          <div className="p-4 bg-danger/20 border border-danger text-texts m-6 rounded-lg">
            {error}
          </div>
        )}

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-secondary">Loading skills...</div>
          ) : skills.length === 0 ? (
            <div className="text-center py-12 text-secondary">
              No skills yet. Add a new skill to get started.
            </div>
          ) : (
            <SkillList skills={skills} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>

      {showForm && (
        <SkillForm skill={editingSkill} onClose={handleFormClose} onSuccess={handleFormSuccess} />
      )}
    </MainLayout>
  );
};

export default Skills;
