import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../store/authSlice';
import { logout } from '../store/authSlice';

const Dashboard = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-base-bg">
      {/* Header */}
      <header className="bg-base-container-bg border-b border-borders">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-texts font-heading">
                Portfolio Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-secondary">
                Welcome, {user?.name || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-danger hover-bg-danger-80 text-texts-inverted px-4 py-2 rounded-lg transition duration-200 font-heading"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
          <h2 className="text-2xl font-bold text-texts mb-6 font-heading">
            Dashboard Overview
          </h2>
          
          <div className="grid grid-cols-1 md-grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-base-boards rounded-lg p-6 border border-borders">
              <h3 className="text-lg font-semibold text-texts mb-2 font-heading">
                Profile
              </h3>
              <p className="text-secondary">
                Manage your personal information
              </p>
            </div>
            
            <div className="bg-base-boards rounded-lg p-6 border border-borders">
              <h3 className="text-lg font-semibold text-texts mb-2 font-heading">
                Sections
              </h3>
              <p className="text-secondary">
                Manage portfolio sections
              </p>
            </div>
            
            <div className="bg-base-boards rounded-lg p-6 border border-borders">
              <h3 className="text-lg font-semibold text-texts mb-2 font-heading">
                Content
              </h3>
              <p className="text-secondary">
                Manage portfolio items and content
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-base-boards rounded-lg border border-borders">
            <p className="text-texts">
              <strong>User Info:</strong> {JSON.stringify(user, null, 2)}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
