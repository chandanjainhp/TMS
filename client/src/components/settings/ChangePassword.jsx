import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff, Lock, ShieldCheck, KeyRound } from 'lucide-react';

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
      const result = await changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully!');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to change password. Please try again.');
      }
    }
  };

  const InputField = ({ label, value, onChange, placeholder, icon: Icon }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 ml-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium text-gray-700 text-sm"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-600 text-sm font-medium">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-600 text-sm font-medium">
          <span>✅</span>
          <p>{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          icon={KeyRound}
        />

        <InputField
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          icon={Lock}
        />

        <InputField
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          icon={ShieldCheck}
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 bg-gray-50 px-2 py-1.5 rounded hover:bg-gray-100"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPassword ? 'Hide' : 'Show'}
          </button>
          <span className="text-[10px] text-gray-400 hidden sm:inline-block">
            Requirements: 8+ chars, 1 uppercase, 1 number, 1 symbol.
          </span>
        </div>

        <button
          onClick={handleChangePassword}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-bold text-white text-xs shadow-md shadow-indigo-100 hover:shadow-lg transition-all flex items-center gap-2 ${isLoading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
