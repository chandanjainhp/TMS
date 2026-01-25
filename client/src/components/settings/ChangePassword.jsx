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
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-gray-700"
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

      <div className="space-y-5">
        <InputField
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          icon={KeyRound}
        />

        <InputField
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new strong password"
          icon={Lock}
        />

        <InputField
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          icon={ShieldCheck}
        />

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPassword ? 'Hide Characters' : 'Show Characters'}
          </button>
          <p className="text-xs text-gray-400 max-w-[200px] text-right">
            8+ chars, uppercase, number & symbol required.
          </p>
        </div>

        <button
          onClick={handleChangePassword}
          disabled={isLoading}
          className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 ${isLoading
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
