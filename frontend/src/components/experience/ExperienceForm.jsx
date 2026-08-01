import React, { useState, useEffect } from 'react';
import { useCreateExperienceMutation, useUpdateExperienceMutation } from '../../services/experienceApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ExperienceForm = ({ experience, onClose, onSuccess }) => {
  const [createExperience] = useCreateExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    technologies: [],
    order: 0
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title || '',
        company: experience.company || '',
        location: experience.location || '',
        startDate: experience.startDate ? experience.startDate.split('T')[0] : '',
        endDate: experience.endDate ? experience.endDate.split('T')[0] : '',
        current: experience.current || false,
        description: experience.description || '',
        technologies: experience.technologies || [],
        order: experience.order || 0
      });
      if (experience.logo) {
        setLogoPreview(`${API_URL}${experience.logo}`);
      }
    }
  }, [experience]);

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

  const handleAddTech = () => {
    const normalized = techInput.trim();
    if (normalized && !formData.technologies.includes(normalized)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, normalized]
      }));
    }
    setTechInput('');
  };

  const handleRemoveTech = (tag) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('current', formData.current);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('technologies', JSON.stringify(formData.technologies));
      formDataToSend.append('order', formData.order);
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }

      if (experience) {
        await updateExperience({ id: experience._id, formData: formDataToSend }).unwrap();
      } else {
        await createExperience(formDataToSend).unwrap();
      }

      onSuccess();
    } catch (err) {
      const message = err?.data?.message || err?.error || 'Failed to save experience. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-container-bg rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-borders">
        <div className="p-6 border-b border-borders flex justify-between items-center">
          <h3 className="text-xl font-bold text-texts font-heading">
            {experience ? 'Edit Experience' : 'Add Experience'}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-texts mb-2 font-heading">Title *</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
                placeholder="e.g., Full Stack Developer"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-texts mb-2 font-heading">Company *</label>
              <input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
                placeholder="e.g., FBM Solutions"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-texts mb-2 font-heading">Location</label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
                placeholder="e.g., Islamabad - Pakistan"
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-texts mb-2 font-heading">Start Date *</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-texts mb-2 font-heading">End Date</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.current}
                className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts disabled:opacity-50"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                id="current"
                name="current"
                type="checkbox"
                checked={formData.current}
                onChange={handleChange}
                className="w-4 h-4 rounded border-borders bg-base-boards text-primary focus:ring-primary"
              />
              <label htmlFor="current" className="text-sm text-texts">I currently work here</label>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-texts mb-2 font-heading">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary resize-none"
              placeholder="Describe your role and achievements"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-texts mb-2 font-heading">Technologies</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
                placeholder="Add a technology tag e.g. React.js"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 bg-primary hover:bg-primary/80 text-texts-inverted rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleRemoveTech(tag)}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-boards border border-borders text-secondary hover:bg-base-container-bg"
                >
                  <span>{tag}</span>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-texts mb-2 font-heading">Company Logo</label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative">
                  <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-contain rounded-lg border border-borders bg-base-boards" />
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
                  <i className="fa-solid fa-briefcase text-2xl text-secondary"></i>
                </div>
              )}
              <div className="flex-1">
                <input type="file" id="logo" accept="image/*" onChange={handleLogoChange} className="hidden" />
                <label htmlFor="logo" className="inline-block px-4 py-2 bg-base-boards hover:bg-base-container-bg border border-borders rounded-lg cursor-pointer transition-colors">
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </label>
                <p className="text-xs text-secondary mt-1">PNG, JPG, GIF, WebP up to 5MB</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-texts mb-2 font-heading">Display Order</label>
            <input
              id="order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-borders">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-base-boards hover:bg-base-container-bg border border-borders rounded-lg transition-colors text-texts">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary hover:bg-primary/80 text-texts-inverted rounded-lg transition-colors font-heading disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Saving...' : (experience ? 'Update' : 'Add Experience')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperienceForm;
