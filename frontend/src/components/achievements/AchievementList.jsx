import React from 'react';

const AchievementList = ({ achievements, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      {achievements.map((achievement) => (
        <div key={achievement._id} className="bg-base-boards border border-borders rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.15em] px-3 py-1">
                  {achievement.category}
                </span>
                <h3 className="text-xl font-semibold text-texts font-heading">{achievement.title}</h3>
              </div>
              <div className="mt-2 text-secondary text-sm">
                {achievement.company && <span>{achievement.company}</span>}
                {achievement.company && achievement.location && <span className="mx-2">•</span>}
                {achievement.location && <span>{achievement.location}</span>}
              </div>
            </div>
            <div className="text-secondary text-sm text-right">
              {achievement.date ? new Date(achievement.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}
            </div>
          </div>

          {achievement.description && (
            <p className="mt-4 text-secondary leading-7">{achievement.description}</p>
          )}

          {achievement.bullets?.length > 0 && (
            <ul className="mt-4 space-y-2 list-disc list-inside text-secondary">
              {achievement.bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onEdit(achievement)}
              className="px-4 py-2 bg-base-boards border border-borders rounded-full text-secondary hover:bg-base-container-bg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(achievement._id)}
              className="px-4 py-2 bg-danger/10 border border-danger rounded-full text-danger hover:bg-danger/20 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementList;
