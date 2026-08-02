import React, { useState } from 'react';
import MainLayout from '../components/dashboard/MainLayout';
import PortfolioForm from '../components/portfolio/PortfolioForm';
import { useGetPortfoliosQuery, useDeletePortfolioMutation } from '../services/portfolioApi';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const Updates = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const { data: portfolios = [], isLoading, isError, error } = useGetPortfoliosQuery();
  const [deletePortfolio] = useDeletePortfolioMutation();

  const handleAdd = () => {
    setEditingPortfolio(null);
    setShowForm(true);
  };

  const handleEdit = (portfolio) => {
    setEditingPortfolio(portfolio);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this update?')) {
      return;
    }

    try {
      await deletePortfolio(id).unwrap();
    } catch (err) {
      console.error('Failed to delete portfolio update', err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPortfolio(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPortfolio(null);
  };

  const renderError = () => {
    if (!isError) return null;
    const message = error?.data?.message || error?.error || 'Failed to load updates';
    return (
      <div className="p-4 bg-danger/20 border border-danger text-texts m-6 rounded-lg">
        {message}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-3xl shadow-xl border border-borders overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-borders flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-texts font-heading">Updates</h2>
            <p className="text-secondary mt-2 max-w-2xl">
              Manage portfolio updates in one place. Add new project updates, edit existing entries, and keep the timeline current.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center bg-primary text-texts-inverted px-5 py-3 rounded-full shadow-sm hover:bg-primary/90 transition-colors font-medium"
          >
            Add Update
          </button>
        </div>

        {renderError()}

        <div className="p-6 sm:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-secondary">Loading updates...</div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-16 text-secondary">No updates yet. Click "Add Update" to create your first portfolio entry.</div>
          ) : (
            <div className="relative pl-8">
              <div className="absolute left-5 top-6 h-full w-px bg-borders"></div>
              <div className="space-y-8">
                {portfolios.map((portfolio) => (
                  <div key={portfolio._id} className="relative">
                    <span className="absolute -left-2 top-6 h-4 w-4 rounded-full bg-primary border-2 border-base-container-bg"></span>
                    <div className="bg-base-boards border border-borders rounded-3xl p-6 shadow-sm">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-semibold text-texts font-heading">{portfolio.title}</h3>
                            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs px-3 py-1">
                              Order {portfolio.order || 0}
                            </span>
                          </div>
                          {portfolio.projectUrl && (
                            <a href={portfolio.projectUrl} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline mt-2 inline-block">
                              View project
                            </a>
                          )}
                        </div>
                        <div className="text-sm text-secondary text-right">
                          <div>{formatDate(portfolio.updatedAt || portfolio.createdAt)}</div>
                          <div className="mt-2">{portfolio.technologies?.length || 0} tags</div>
                        </div>
                      </div>

                      {portfolio.description && (
                        <p className="mt-4 text-secondary leading-7">{portfolio.description}</p>
                      )}

                      {portfolio.technologies?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {portfolio.technologies.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-base-container-bg text-secondary text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          onClick={() => handleEdit(portfolio)}
                          className="px-4 py-2 bg-base-boards border border-borders rounded-full text-secondary hover:bg-base-container-bg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(portfolio._id)}
                          className="px-4 py-2 bg-danger/10 border border-danger rounded-full text-danger hover:bg-danger/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <PortfolioForm
          portfolio={editingPortfolio}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </MainLayout>
  );
};

export default Updates;
