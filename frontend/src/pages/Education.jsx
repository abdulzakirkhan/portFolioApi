import React, { useState, useEffect } from 'react';
import MainLayout from '../components/dashboard/MainLayout';
import EducationForm from '../components/education/EducationForm';
import EducationList from '../components/education/EducationList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Education = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [error, setError] = useState(null);

  const fetchEducations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/education`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setEducations(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch education entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const handleAdd = () => {
    setEditingEducation(null);
    setShowForm(true);
  };

  const handleEdit = (education) => {
    setEditingEducation(education);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEducation(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEducation(null);
    fetchEducations();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/education/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchEducations();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete education entry');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-secondary">Loading education entries...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl border border-borders">
        {/* Header */}
        <div className="p-6 border-b border-borders flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-texts font-heading">
              Education Management
            </h2>
            <p className="text-secondary mt-1">
              Manage your education history and qualifications
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-primary hover:bg-primary/80 text-texts-inverted px-4 py-2 rounded-lg transition duration-200 font-heading flex items-center"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Add Education
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-danger/20 border border-danger text-texts m-6 rounded-lg">
            {error}
          </div>
        )}

        {/* Education List */}
        <div className="p-6">
          {educations.length === 0 ? (
            <div className="text-center py-12">
              <i className="fa-solid fa-graduation-cap text-4xl text-secondary mb-4"></i>
              <p className="text-secondary">No education entries yet. Add your first education!</p>
            </div>
          ) : (
            <EducationList 
              educations={educations}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <EducationForm
          education={editingEducation}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </MainLayout>
  );
};

export default Education;
