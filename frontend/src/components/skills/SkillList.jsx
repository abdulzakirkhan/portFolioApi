import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SkillList = ({ skills, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {skills.map(skill => (
        <div key={skill._id} className="bg-base-boards rounded-lg p-6 border border-borders hover:border-primary/50 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-lg font-bold">
                  {skill.title.charAt(0).toUpperCase()}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-texts font-heading">{skill.title}</h3>
                  <p className="text-secondary text-sm">{skill.focusArea}</p>
                  {skill.experience && (
                    <p className="text-secondary text-sm">{skill.experience}</p>
                  )}
                </div>
              </div>
              {skill.description && (
                <p className="text-secondary text-sm mb-3">{skill.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(skill)}
                className="px-3 py-2 bg-base-boards border border-borders rounded-lg hover:bg-base-container-bg text-secondary transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(skill._id)}
                className="px-3 py-2 bg-danger/10 border border-danger text-danger rounded-lg hover:bg-danger/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillList;
