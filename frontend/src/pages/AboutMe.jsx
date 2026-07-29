import React, { useState } from 'react';
import MainLayout from '../components/dashboard/MainLayout';
import { useGetAboutMeQuery, useCreateAboutMeMutation, useUpdateAboutMeMutation } from '../services/aboutApi';

const AboutMe = () => {
  const { data: aboutMeData, isLoading } = useGetAboutMeQuery();
  const [createAboutMe, { isLoading: isCreating }] = useCreateAboutMeMutation();
  const [updateAboutMe, { isLoading: isUpdating }] = useUpdateAboutMeMutation();
  
  const [formData, setFormData] = useState({
    aboutText: '',
    professionalHighlights: [
      { title: '', description: '', icon: 'fa-star' },
      { title: '', description: '', icon: 'fa-star' },
      { title: '', description: '', icon: 'fa-star' }
    ],
    developerInterests: {
      githubContributions: '',
      openSource: '',
      featuredProjects: ''
    }
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  // Initialize form data when API data loads
  React.useEffect(() => {
    if (aboutMeData) {
      setFormData({
        aboutText: aboutMeData.aboutText || '',
        professionalHighlights: aboutMeData.professionalHighlights || [
          { title: '', description: '', icon: 'fa-star' },
          { title: '', description: '', icon: 'fa-star' },
          { title: '', description: '', icon: 'fa-star' }
        ],
        developerInterests: aboutMeData.developerInterests || {
          githubContributions: '',
          openSource: '',
          featuredProjects: ''
        }
      });
    }
  }, [aboutMeData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (aboutMeData) {
        await updateAboutMe(formData).unwrap();
        setMessage({ type: 'success', text: 'About Me updated successfully!' });
      } else {
        await createAboutMe(formData).unwrap();
        setMessage({ type: 'success', text: 'About Me created successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.data?.message || 'Failed to save About Me' });
    }
  };

  const handleSaveAboutText = async () => {
    setMessage({ type: '', text: '' });

    try {
      const dataToUpdate = { aboutText: formData.aboutText };

      if (aboutMeData) {
        await updateAboutMe(dataToUpdate).unwrap();
        setMessage({ type: 'success', text: 'About Me Text saved successfully!' });
      } else {
        await createAboutMe(dataToUpdate).unwrap();
        setMessage({ type: 'success', text: 'About Me Text created successfully!' });
      }
    } catch (error) {
      console.error('Error saving about text:', error);
      setMessage({ type: 'error', text: error.data?.message || 'Failed to save About Me Text' });
    }
  };

  const handleSaveHighlights = async () => {
    setMessage({ type: '', text: '' });

    try {
      const dataToUpdate = { professionalHighlights: formData.professionalHighlights };

      if (aboutMeData) {
        await updateAboutMe(dataToUpdate).unwrap();
        setMessage({ type: 'success', text: 'Professional Highlights saved successfully!' });
      } else {
        await createAboutMe(dataToUpdate).unwrap();
        setMessage({ type: 'success', text: 'Professional Highlights created successfully!' });
      }
    } catch (error) {
      console.error('Error saving highlights:', error);
      setMessage({ type: 'error', text: error.data?.message || 'Failed to save Professional Highlights' });
    }
  };

  const handleSaveInterests = async () => {
    setMessage({ type: '', text: '' });

    try {
      const dataToUpdate = { developerInterests: formData.developerInterests };

      if (aboutMeData) {
        await updateAboutMe(dataToUpdate).unwrap();
        setMessage({ type: 'success', text: 'Developer Interests saved successfully!' });
      } else {
        await createAboutMe(dataToUpdate).unwrap();
        setMessage({ type: 'success', text: 'Developer Interests created successfully!' });
      }
    } catch (error) {
      console.error('Error saving interests:', error);
      setMessage({ type: 'error', text: error.data?.message || 'Failed to save Developer Interests' });
    }
  };

  const handleHighlightChange = (index, field, value) => {
    const newHighlights = [...formData.professionalHighlights];
    newHighlights[index][field] = value;
    setFormData({ ...formData, professionalHighlights: newHighlights });
  };

  const addHighlight = () => {
    setFormData({
      ...formData,
      professionalHighlights: [
        ...formData.professionalHighlights,
        { title: '', description: '', icon: 'fa-star' }
      ]
    });
  };

  const removeHighlight = (index) => {
    const newHighlights = formData.professionalHighlights.filter((_, i) => i !== index);
    setFormData({ ...formData, professionalHighlights: newHighlights });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
              <p className="text-secondary">Loading About Me...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
        <h2 className="text-2xl font-bold text-texts mb-6 font-heading">
          About Me Management
        </h2>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-danger/20 text-danger'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* About Text Section */}
          <div className="bg-base-boards rounded-lg p-6 border border-borders">
            <h3 className="text-lg font-semibold text-texts mb-4 font-heading">
              About Me Text
            </h3>
            <textarea
              value={formData.aboutText}
              onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
              className="w-full px-4 py-3 bg-base-bg border border-borders rounded-lg text-texts focus:outline-none focus:border-primary transition-colors min-h-[200px]"
              placeholder="Write about yourself, your background, and your journey..."
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-secondary">{formData.aboutText.length}/5000 characters</p>
              <button
                type="button"
                onClick={handleSaveAboutText}
                disabled={isCreating || isUpdating}
                className="bg-primary hover:bg-primary/80 text-texts-inverted px-4 py-2 rounded-lg transition duration-200 font-heading text-sm disabled:opacity-50"
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save About Me Text'}
              </button>
            </div>
          </div>

          {/* Professional Highlights Section */}
          <div className="bg-base-boards rounded-lg p-6 border border-borders">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-texts font-heading">
                Professional Highlights
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addHighlight}
                  className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg transition-colors font-heading text-sm"
                >
                  <i className="fa-solid fa-plus mr-2"></i>Add Highlight
                </button>
                <button
                  type="button"
                  onClick={handleSaveHighlights}
                  disabled={isCreating || isUpdating}
                  className="bg-primary hover:bg-primary/80 text-texts-inverted px-4 py-2 rounded-lg transition duration-200 font-heading text-sm disabled:opacity-50"
                >
                  {isCreating || isUpdating ? 'Saving...' : 'Save Highlights'}
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {formData.professionalHighlights.map((highlight, index) => (
                <div key={index} className="bg-base-bg rounded-lg p-4 border border-borders">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm text-secondary">Highlight #{index + 1}</span>
                    {formData.professionalHighlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="text-danger hover:text-danger/80 transition-colors"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={highlight.title}
                      onChange={(e) => handleHighlightChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 bg-base-container-bg border border-borders rounded-lg text-texts focus:outline-none focus:border-primary transition-colors"
                      placeholder="Highlight title (e.g., 'Full Stack Developer')"
                      maxLength={200}
                    />
                    <textarea
                      value={highlight.description}
                      onChange={(e) => handleHighlightChange(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 bg-base-container-bg border border-borders rounded-lg text-texts focus:outline-none focus:border-primary transition-colors min-h-[80px]"
                      placeholder="Highlight description..."
                      maxLength={500}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Developer Interests Section */}
          <div className="bg-base-boards rounded-lg p-6 border border-borders">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-texts font-heading">
                Developer Interests
              </h3>
              <button
                type="button"
                onClick={handleSaveInterests}
                disabled={isCreating || isUpdating}
                className="bg-primary hover:bg-primary/80 text-texts-inverted px-4 py-2 rounded-lg transition duration-200 font-heading text-sm disabled:opacity-50"
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save Interests'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <i className="fa-brands fa-github mr-2"></i>GitHub Contributions
                </label>
                <textarea
                  value={formData.developerInterests.githubContributions}
                  onChange={(e) => setFormData({
                    ...formData,
                    developerInterests: {
                      ...formData.developerInterests,
                      githubContributions: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2 bg-base-bg border border-borders rounded-lg text-texts focus:outline-none focus:border-primary transition-colors min-h-[80px]"
                  placeholder="Describe your GitHub contributions..."
                  maxLength={500}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <i className="fa-solid fa-code-branch mr-2"></i>Open Source
                </label>
                <textarea
                  value={formData.developerInterests.openSource}
                  onChange={(e) => setFormData({
                    ...formData,
                    developerInterests: {
                      ...formData.developerInterests,
                      openSource: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2 bg-base-bg border border-borders rounded-lg text-texts focus:outline-none focus:border-primary transition-colors min-h-[80px]"
                  placeholder="Describe your open source involvement..."
                  maxLength={500}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <i className="fa-solid fa-rocket mr-2"></i>Featured Projects
                </label>
                <textarea
                  value={formData.developerInterests.featuredProjects}
                  onChange={(e) => setFormData({
                    ...formData,
                    developerInterests: {
                      ...formData.developerInterests,
                      featuredProjects: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2 bg-base-bg border border-borders rounded-lg text-texts focus:outline-none focus:border-primary transition-colors min-h-[80px]"
                  placeholder="Describe your featured projects..."
                  maxLength={500}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-primary hover:bg-primary/80 text-texts-inverted px-8 py-3 rounded-lg transition duration-200 font-heading disabled:opacity-50"
            >
              {isCreating || isUpdating ? 'Saving...' : aboutMeData ? 'Update About Me' : 'Create About Me'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AboutMe;
