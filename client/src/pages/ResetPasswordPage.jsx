import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Input from "../components/login/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await resetPassword(otp, password);
      toast.success("Password reset successfully, redirecting to login page...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (resetError) {
      console.error(resetError);
      toast.error(resetError.message || "Error resetting password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f5f4] p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white p-8">
        <div className="mb-6 inline-flex rounded-full bg-[#f2f9ff] p-3 text-[#097fe8]">
          <Lock size={20} />
        </div>
        <h2 className="text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[rgba(0,0,0,0.95)]">Set new password</h2>
        <p className="mt-2 text-[#615d59]">Enter your OTP and choose a secure new password.</p>

        {error && <div className="mt-4 rounded border border-[#f5c2c2] bg-[#fff5f5] p-3 text-sm text-[#dd5b00]">{error}</div>}
        {message && <div className="mt-4 rounded border border-[#c7ebd0] bg-[#f2fbf5] p-3 text-sm text-[#1aae39]">{message}</div>}

        <form onSubmit={handleSubmit} className="mt-6">
          <Input icon={Lock} type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
          <Input icon={Lock} type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <motion.button whileTap={{ scale: 0.97 }} className="notion-btn-primary mt-2 w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
