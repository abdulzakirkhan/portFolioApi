import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SkillForm = ({ skill, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    focusArea: '',
    experience: '',
    description: '',
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skill) {
      setFormData({
        title: skill.title || '',
        focusArea: skill.focusArea || '',
        experience: skill.experience || '',
        description: skill.description || '',
        order: skill.order || 0
      });
    }
  }, [skill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const url = skill ? `${API_URL}/api/skills/${skill._id}` : `${API_URL}/api/skills`;
      const response = await fetch(url, {
        method: skill ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || 'Failed to save skill');
      }
    } catch (err) {
      setError('Failed to save skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-container-bg rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-borders">
        <div className="p-6 border-b border-borders flex justify-between items-center">
          <h3 className="text-xl font-bold text-texts font-heading">
            {skill ? 'Edit Skill' : 'Add Skill'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-base-boards text-secondary hover:text-texts transition-colors"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-danger/20 border border-danger text-texts rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-texts mb-2 font-heading">
              Skill title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
              placeholder="e.g., Modern UI/UX"
            />
          </div>

          <div>
            <label htmlFor="focusArea" className="block text-sm font-medium text-texts mb-2 font-heading">
              Core Focus Area *
            </label>
            <input
              type="text"
              id="focusArea"
              name="focusArea"
              value={formData.focusArea}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
              placeholder="e.g., Core Focus Area"
            />
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-texts mb-2 font-heading">
              Experience
            </label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
              placeholder="e.g., 2+ years experience"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-texts mb-2 font-heading">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary resize-none"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-texts mb-2 font-heading">
              Display Order
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-borders">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-base-boards hover:bg-base-container-bg border border-borders rounded-lg transition-colors text-texts"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-texts-inverted rounded-lg transition-colors font-heading disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (skill ? 'Update' : 'Add Skill')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillForm;
