import React, { useState } from 'react';
import MainLayout from '../components/dashboard/MainLayout';
import PortfolioForm from '../components/portfolio/PortfolioForm';
import PortfolioList from '../components/portfolio/PortfolioList';
import { useGetPortfoliosQuery, useDeletePortfolioMutation } from '../services/portfolioApi';

const Portfolio = () => {
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
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      await deletePortfolio(id).unwrap();
    } catch (err) {
      console.error('Failed to delete portfolio item', err);
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
    const message = error?.data?.message || error?.error || 'Failed to load portfolio items';
    return (
      <div className="p-4 bg-danger/20 border border-danger text-texts m-6 rounded-lg">
        {message}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl border border-borders">
        <div className="p-6 border-b border-borders flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-texts font-heading">Portfolio Projects</h2>
            <p className="text-secondary mt-1">Add projects with optional URL, image, and technology tags.</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-primary hover:bg-primary/80 text-texts-inverted px-4 py-2 rounded-lg transition duration-200 font-heading"
          >
            Add Project
          </button>
        </div>

        {renderError()}

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-secondary">Loading portfolio items...</div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-12 text-secondary">No portfolio projects yet. Add your first project.</div>
          ) : (
            <PortfolioList portfolios={portfolios} onEdit={handleEdit} onDelete={handleDelete} />
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

export default Portfolio;
