import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const EducationList = ({ educations, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const calculateDuration = (startDate, endDate, current) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const end = current ? new Date() : new Date(endDate);
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    if (months < 0) {
      return `${years - 1} year${years - 1 !== 1 ? 's' : ''}`;
    }
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-4">
      {educations.map((education) => (
        <div
          key={education._id}
          className="bg-base-boards rounded-lg p-6 border border-borders hover:border-primary/50 transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-16 h-16 rounded-lg bg-base-container-bg flex items-center justify-center border border-borders flex-shrink-0">
              {education.logo ? (
                <img
                  src={`${API_URL}${education.logo}`}
                  alt={education.institution}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <i className="fa-solid fa-graduation-cap text-2xl text-secondary"></i>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-texts font-heading">
                    {education.degree}
                  </h3>
                  <p className="text-primary font-medium mt-1">
                    {education.institution}
                  </p>
                  <p className="text-secondary text-sm mt-1">
                    {education.field}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(education)}
                    className="p-2 rounded-lg hover:bg-base-container-bg text-secondary hover:text-texts transition-colors"
                    title="Edit"
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    onClick={() => onDelete(education._id)}
                    className="p-2 rounded-lg hover:bg-danger/20 text-secondary hover:text-danger transition-colors"
                    title="Delete"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>

              {/* Date and Duration */}
              <div className="flex items-center gap-4 mt-3 text-sm text-secondary">
                <div className="flex items-center">
                  <i className="fa-solid fa-calendar mr-2"></i>
                  <span>
                    {formatDate(education.startDate)} - {education.current ? 'Present' : formatDate(education.endDate)}
                  </span>
                </div>
                {education.location && (
                  <div className="flex items-center">
                    <i className="fa-solid fa-location-dot mr-2"></i>
                    <span>{education.location}</span>
                  </div>
                )}
              </div>

              {/* Duration Badge */}
              <div className="mt-2">
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded font-heading">
                  {calculateDuration(education.startDate, education.endDate, education.current)}
                </span>
              </div>

              {/* Description */}
              {education.description && (
                <p className="text-secondary text-sm mt-3 line-clamp-2">
                  {education.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationList;
