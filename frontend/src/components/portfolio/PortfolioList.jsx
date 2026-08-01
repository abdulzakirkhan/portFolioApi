import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PortfolioList = ({ portfolios, onEdit, onDelete }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {portfolios.map((portfolio) => (
        <div key={portfolio._id} className="bg-base-boards rounded-lg p-5 border border-borders hover:border-primary/50 transition-all duration-200">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-lg bg-base-container-bg border border-borders flex items-center justify-center overflow-hidden">
              {portfolio.image ? (
                <img src={`${API_URL}${portfolio.image}`} alt={portfolio.title} className="w-full h-full object-cover" />
              ) : (
                <i className="fa-solid fa-image text-2xl text-secondary"></i>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-texts font-heading">{portfolio.title}</h3>
              {portfolio.projectUrl && (
                <a href={portfolio.projectUrl} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline">
                  View project
                </a>
              )}
            </div>
          </div>

          {portfolio.description && (
            <p className="text-secondary text-sm mt-4">{portfolio.description}</p>
          )}

          {portfolio.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {portfolio.technologies.map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => onEdit(portfolio)} className="px-3 py-2 bg-base-boards border border-borders rounded-lg hover:bg-base-container-bg text-secondary transition-colors">
              Edit
            </button>
            <button onClick={() => onDelete(portfolio._id)} className="px-3 py-2 bg-danger/10 border border-danger text-danger rounded-lg hover:bg-danger/20 transition-colors">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioList;
