import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/login/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
    setTimeout(() => navigate("/reset-password"), 3000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f5f4] p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white p-8">
        <div className="mb-6 inline-flex rounded-full bg-[#f2f9ff] p-3 text-[#097fe8]">
          <Mail size={20} />
        </div>
        <h2 className="text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[rgba(0,0,0,0.95)]">Reset access</h2>
        <p className="mt-2 text-[#615d59]">Enter your email to receive a one-time verification code.</p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-6">
            <Input icon={Mail} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <motion.button whileTap={{ scale: 0.97 }} type="submit" className="notion-btn-primary mt-2 w-full">
              {isLoading ? <Loader className="mx-auto size-5 animate-spin" /> : "Send OTP"}
            </motion.button>
          </form>
        ) : (
          <div className="mt-6 rounded border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-4 text-[#615d59]">
            OTP sent to <span className="font-semibold text-[rgba(0,0,0,0.95)]">{email}</span>. Redirecting to reset page...
          </div>
        )}

        <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium no-underline hover:text-[#005bab]">
          <ArrowLeft size={14} /> Back to login
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
