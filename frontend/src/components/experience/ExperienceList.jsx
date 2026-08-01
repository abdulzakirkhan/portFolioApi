import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

const ExperienceList = ({ experiences, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {experiences.map(experience => (
        <div key={experience._id} className="bg-base-boards rounded-lg p-6 border border-borders hover:border-primary/50 transition-all duration-200">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="w-full lg:w-32 h-32 rounded-lg bg-base-container-bg border border-borders flex items-center justify-center overflow-hidden">
              {experience.logo ? (
                <img src={`${API_URL}${experience.logo}`} alt={experience.company} className="w-full h-full object-contain" />
              ) : (
                <i className="fa-solid fa-briefcase text-3xl text-secondary"></i>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-texts font-heading">{experience.title}</h3>
                  <p className="text-secondary">{experience.company} {experience.location && `· ${experience.location}`}</p>
                  <p className="text-secondary text-sm mt-2">{formatDate(experience.startDate)} — {experience.current ? 'Present' : formatDate(experience.endDate)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(experience)} className="px-3 py-2 bg-base-boards border border-borders rounded-lg hover:bg-base-container-bg text-secondary transition-colors">Edit</button>
                  <button onClick={() => onDelete(experience._id)} className="px-3 py-2 bg-danger/10 border border-danger text-danger rounded-lg hover:bg-danger/20 transition-colors">Delete</button>
                </div>
              </div>

              {experience.description && (
                <p className="text-secondary mt-4">{experience.description}</p>
              )}

              {experience.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {experience.technologies.map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;
