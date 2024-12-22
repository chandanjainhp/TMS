import React, { useState } from 'react';

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = () => {
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

    setError('');
    alert('Password changed successfully!');
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-[#34495E] rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-[#ECF0F1]">Change Password</h2>
      {error && <p className="mb-4 text-[#E74C3C]">{error}</p>}
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
        className="mt-4 px-4 py-2 bg-[#2C3E50] text-[#FFFFFF] rounded-md"
      >
        Change Password
      </button>
    </div>
  );
};

export default ChangePassword;
