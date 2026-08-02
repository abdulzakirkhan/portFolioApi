import React, { useEffect, useState } from 'react';
import { useCreateAchievementMutation, useUpdateAchievementMutation } from '../../services/achievementsApi';

const AchievementForm = ({ achievement, onClose, onSuccess }) => {
  const [createAchievement] = useCreateAchievementMutation();
  const [updateAchievement] = useUpdateAchievementMutation();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    description: '',
    company: '',
    location: '',
    date: '',
    bullets: [''],
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (achievement) {
      setFormData({
        title: achievement.title || '',
        category: achievement.category || 'Technical',
        description: achievement.description || '',
        company: achievement.company || '',
        location: achievement.location || '',
        date: achievement.date ? achievement.date.split('T')[0] : '',
        bullets: achievement.bullets.length > 0 ? achievement.bullets : [''],
        order: achievement.order || 0
      });
    }
  }, [achievement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulletChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      bullets: prev.bullets.map((bullet, idx) => (idx === index ? value : bullet))
    }));
  };

  const handleAddBullet = () => {
    setFormData((prev) => ({ ...prev, bullets: [...prev.bullets, ''] }));
  };

  const handleRemoveBullet = (index) => {
    setFormData((prev) => ({
      ...prev,
      bullets: prev.bullets.length > 1 ? prev.bullets.filter((_, idx) => idx !== index) : ['']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      company: formData.company,
      location: formData.location,
      date: formData.date,
      bullets: JSON.stringify(formData.bullets.filter((bullet) => bullet.trim())),
      order: formData.order
    };

    try {
      if (achievement) {
        await updateAchievement({ id: achievement._id, payload }).unwrap();
      } else {
        await createAchievement(payload).unwrap();
      }
      onSuccess();
    } catch (err) {
      setError(err?.data?.message || err?.error || 'Failed to save achievement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-container-bg rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-borders">
        <div className="p-6 border-b border-borders flex justify-between items-center">
          <h3 className="text-xl font-bold text-texts font-heading">
            {achievement ? 'Edit Achievement' : 'Add Achievement'}
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
                placeholder="Achievement title"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-texts mb-2 font-heading">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts"
              >
                <option value="Technical">Technical</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-texts mb-2 font-heading">Date *</label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts"
              />
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
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-texts mb-2 font-heading">Company</label>
            <input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
              placeholder="Company or organization"
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
              placeholder="Location"
            />
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
              placeholder="A short summary of the achievement"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-texts font-heading">Bullet points</label>
              <button
                type="button"
                onClick={handleAddBullet}
                className="text-primary text-sm hover:underline"
              >
                Add bullet
              </button>
            </div>
            <div className="space-y-3">
              {formData.bullets.map((bullet, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-base-boards border border-borders rounded-lg focus:outline-none focus:border-primary text-texts placeholder-secondary"
                    placeholder="Achievement detail"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(index)}
                    className="px-3 py-2 bg-danger/10 border border-danger rounded-full text-danger hover:bg-danger/20 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
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
              {loading ? 'Saving...' : achievement ? 'Update Achievement' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AchievementForm;
