import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

const ChangePassword = () => {
  const { changePassword, isLoading, error: authError, message, isAuthenticated } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setError('You must be logged in to change your password.');
    }
  }, [isAuthenticated]);

  // Update error message when auth store error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Update success message when auth store message changes
  useEffect(() => {
    if (message) {
      setSuccess(message);
      // Reset form on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [message]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    // Reset messages
    setError('');
    setSuccess('');

    // Check if user is authenticated
    if (!isAuthenticated) {
      setError('You must be logged in to change your password.');
      return;
    }

    // Validate inputs
    if (!currentPassword) {
      setError('Current password is required.');
      return;
    }
    if (!validatePassword(newPassword)) {
      setError(
        'New password must be at least 8 characters long, include an uppercase letter, a number, and a special character.'
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      // Call the API to change password
      console.log('Attempting to change password...');
      const result = await changePassword(currentPassword, newPassword);
      console.log('Password change result:', result);
      // Set success message directly in case the useEffect doesn't catch it
      setSuccess('Password changed successfully!');
    } catch (err) {
      console.error('Error changing password:', err);
      // Set error message directly in case the useEffect doesn't catch it
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to change password. Please try again.');
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-[#34495E] rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-[#ECF0F1]">Change Password</h2>
      {error && (
        <div className="mb-4 p-3 bg-[#E74C3C] bg-opacity-20 border border-[#E74C3C] rounded-md">
          <p className="text-[#E74C3C] flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {error}
          </p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-[#27AE60] bg-opacity-20 border border-[#2ECC71] rounded-md">
          <p className="text-[#2ECC71] flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {success}
          </p>
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#ECF0F1]">Current Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full p-2 border border-[#2C3E50] rounded-md bg-[#ECF0F1] text-[#2C3E50]"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="absolute right-3 top-3 text-[#2C3E50]"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#ECF0F1]">New Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full p-2 border border-[#2C3E50] rounded-md bg-[#ECF0F1] text-[#2C3E50]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="absolute right-3 top-3 text-[#2C3E50]"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#ECF0F1]">Confirm New Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full p-2 border border-[#2C3E50] rounded-md bg-[#ECF0F1] text-[#2C3E50]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="absolute right-3 top-3 text-[#2C3E50]"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <button
        onClick={handleChangePassword}
        disabled={isLoading}
        className={`mt-4 px-4 py-2 ${isLoading ? 'bg-[#7F8C8D]' : 'bg-[#2C3E50]'} text-[#FFFFFF] rounded-md flex items-center justify-center`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Change Password'
        )}
      </button>
    </div>
  );
};

export default ChangePassword;
