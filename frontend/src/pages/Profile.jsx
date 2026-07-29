import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import MainLayout from '../components/dashboard/MainLayout';
import { selectUser } from '../store/authSlice';
import { useUpdateProfileMutation, useChangePasswordMutation } from '../services/profileApi';

const Profile = () => {
  const user = useSelector(selectUser);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      await updateProfile(profileForm).unwrap();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.data?.message || 'Failed to update profile' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }).unwrap();
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.data?.message || 'Failed to change password' });
    }
  };

  return (
    <MainLayout>
      <div className="bg-base-container-bg rounded-lg shadow-xl p-8 border border-borders">
        <h2 className="text-2xl font-bold text-texts mb-6 font-heading">
          Profile Management
        </h2>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-danger/20 text-danger'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information Form */}
          <div className="bg-base-boards rounded-lg p-6 border border-borders">
            <h3 className="text-lg font-semibold text-texts mb-4 font-heading">
              Update Profile
            </h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-base-bg border border-borders rounded-lg text-texts focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-base-bg border border-borders rounded-lg text-texts focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-primary hover:bg-primary/80 text-texts-inverted px-4 py-2 rounded-lg transition duration-200 font-heading disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-base-boards rounded-lg p-6 border border-borders">
            <h3 className="text-lg font-semibold text-texts mb-4 font-heading">
              Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-base-bg border border-borders rounded-lg text-texts focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-base-bg border border-borders rounded-lg text-texts focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-base-bg border border-borders rounded-lg text-texts focus:outline-none focus:border-primary transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-primary hover:bg-primary/80 text-texts-inverted px-4 py-2 rounded-lg transition duration-200 font-heading disabled:opacity-50"
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 p-6 bg-base-boards rounded-lg border border-borders">
          <h3 className="text-lg font-semibold text-texts mb-4 font-heading">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-secondary">User ID</p>
              <p className="text-texts font-mono text-sm">{user?.id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary">Role</p>
              <p className="text-texts">{user?.role || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary">Email</p>
              <p className="text-texts">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary">Name</p>
              <p className="text-texts">{user?.name || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
