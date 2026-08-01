import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const EducationForm = ({ education, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    location: '',
    order: 0
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution || '',
        degree: education.degree || '',
        field: education.field || '',
        startDate: education.startDate ? education.startDate.split('T')[0] : '',
        endDate: education.endDate ? education.endDate.split('T')[0] : '',
        current: education.current || false,
        description: education.description || '',
        location: education.location || '',
        order: education.order || 0
      });
      if (education.logo) {
        setLogoPreview(`${API_URL}${education.logo}`);
      }
    }
  }, [education]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'current' && checked) {
      setFormData(prev => ({ ...prev, endDate: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }

      const url = education 
        ? `${API_URL}/api/education/${education._id}`
        : `${API_URL}/api/education`;

      const response = await fetch(url, {
        method: education ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || 'Failed to save education entry');
      }
    } catch (err) {
      setError('Failed to save education entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-container-bg rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-borders">
        {/* Header */}
        <div className="p-6 border-b border-borders flex justify-between items-center">
          <h3 className="text-xl font-bold text-texts font-heading">
            {education ? 'Edit Education' : 'Add Education'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-base-boards text-secondary hover:text-texts transition-colors"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-danger/20 border border-danger text-texts rounded-lg">
              {error}
            </div>
          )}

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-texts mb-2 font-heading">
              Institution Logo
            </label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-20 h-20 object-contain rounded-lg border border-borders bg-base-boards"
                  />
                  <button
                    type="button"
                    onClick={handleLogoRemove}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-danger rounded-full flex items-center justify-center text-texts-inverted text-xs hover:bg-danger/80"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-borders flex items-center justify-center bg-base-boards">
                  <i className="fa-solid fa-graduation-cap text-2xl text-secondary"></i>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <label
                  htmlFor="logo"
                  className="inline-block px-4 py-2 bg-base-boards hover:bg-base-container-bg border border-borders rounded-lg cursor-pointer transition-colors"
                >
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </label>
                <p className="text-xs text-secondary mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Institution */}
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-texts mb-2 font-heading">
              Institution *
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
              placeholder="e.g., Harvard University"
            />
          </div>

          {/* Degree */}
          <div>
            <label htmlFor="degree" className="block text-sm font-medium text-texts mb-2 font-heading">
              Degree *
            </label>
            <input
              type="text"
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
              placeholder="e.g., Bachelor of Science"
            />
          </div>

          {/* Field of Study */}
          <div>
            <label htmlFor="field" className="block text-sm font-medium text-texts mb-2 font-heading">
              Field of Study *
            </label>
            <input
              type="text"
              id="field"
              name="field"
              value={formData.field}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
              placeholder="e.g., Computer Science"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-texts mb-2 font-heading">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-texts mb-2 font-heading">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.current}
                className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts disabled:opacity-50"
              />
            </div>
          </div>

          {/* Current */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="current"
              name="current"
              checked={formData.current}
              onChange={handleChange}
              className="w-4 h-4 rounded border-borders bg-base-boards text-primary focus:ring-primary"
            />
            <label htmlFor="current" className="ml-2 text-sm text-texts">
              I currently study here
            </label>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-texts mb-2 font-heading">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
              placeholder="e.g., Cambridge, MA"
            />
          </div>

          {/* Description */}
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
              placeholder="Brief description of your studies..."
            />
          </div>

          {/* Order */}
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
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts"
              min="0"
            />
          </div>

          {/* Actions */}
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
              {loading ? 'Saving...' : (education ? 'Update' : 'Add Education')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationForm;
