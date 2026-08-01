import React, { useState, useEffect } from 'react';
import { useCreatePortfolioMutation, useUpdatePortfolioMutation } from '../../services/portfolioApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PortfolioForm = ({ portfolio, onClose, onSuccess }) => {
  const [createPortfolio] = useCreatePortfolioMutation();
  const [updatePortfolio] = useUpdatePortfolioMutation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: '',
    technologies: [],
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    if (portfolio) {
      setFormData({
        title: portfolio.title || '',
        description: portfolio.description || '',
        projectUrl: portfolio.projectUrl || '',
        technologies: portfolio.technologies || [],
        order: portfolio.order || 0
      });
      if (portfolio.image) {
        setImagePreview(`${API_URL}${portfolio.image}`);
      }
    }
  }, [portfolio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
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
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('projectUrl', formData.projectUrl);
      payload.append('technologies', JSON.stringify(formData.technologies));
      payload.append('order', formData.order);
      if (imageFile) payload.append('image', imageFile);

      if (portfolio) {
        await updatePortfolio({ id: portfolio._id, formData: payload }).unwrap();
      } else {
        await createPortfolio(payload).unwrap();
      }

      onSuccess();
    } catch (err) {
      const message = err?.data?.message || err?.error || 'Failed to save project';
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
            {portfolio ? 'Edit Project' : 'Add Project'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-base-boards text-secondary hover:text-texts transition-colors">
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-4 bg-danger/20 border border-danger text-texts rounded-lg">{error}</div>}

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
                placeholder="Project title"
              />
            </div>
            <div>
              <label htmlFor="projectUrl" className="block text-sm font-medium text-texts mb-2 font-heading">Project URL</label>
              <input
                id="projectUrl"
                name="projectUrl"
                value={formData.projectUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
                placeholder="https://example.com"
              />
            </div>
            <div className="lg:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-texts mb-2 font-heading">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary resize-none"
                placeholder="Describe the project"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-texts mb-2 font-heading">Technologies</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
                placeholder="Add a tech tag e.g. react.js"
              />
              <button type="button" onClick={handleAddTech} className="px-4 py-2 bg-primary hover:bg-primary/80 text-texts-inverted rounded-lg transition-colors">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tag) => (
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
            <label className="block text-sm font-medium text-texts mb-2 font-heading">Project Image</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Project preview" className="w-24 h-24 object-contain rounded-lg border border-borders bg-base-boards" />
                  <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 w-6 h-6 bg-danger rounded-full flex items-center justify-center text-texts-inverted text-xs hover:bg-danger/80">
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-borders flex items-center justify-center bg-base-boards">
                  <i className="fa-solid fa-image text-2xl text-secondary"></i>
                </div>
              )}
              <div className="flex-1">
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="hidden" />
                <label htmlFor="image" className="inline-block px-4 py-2 bg-base-boards hover:bg-base-container-bg border border-borders rounded-lg cursor-pointer transition-colors">
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
                <p className="text-xs text-secondary mt-1">Optional. PNG, JPG, GIF, WebP up to 5MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-borders">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-base-boards hover:bg-base-container-bg border border-borders rounded-lg transition-colors text-texts">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary hover:bg-primary/80 text-texts-inverted rounded-lg transition-colors font-heading disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Saving...' : portfolio ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioForm;
