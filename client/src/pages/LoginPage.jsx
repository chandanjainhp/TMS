import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/login/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-[#f6f5f4] p-4 sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1200px] overflow-hidden rounded border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px] lg:grid-cols-2">
        <div className="hidden border-r border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-10 lg:flex lg:flex-col lg:justify-between">
          <Link to="/landing" className="inline-flex items-center gap-2 text-[15px] font-medium text-[rgba(0,0,0,0.95)] no-underline hover:text-[#0075de]">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div>
            <span className="notion-badge">User portal</span>
            <h1 className="mt-5 text-[54px] font-bold leading-[1.04] tracking-[-1.875px] text-[rgba(0,0,0,0.95)]">Sign in with clarity.</h1>
            <p className="mt-4 max-w-md text-[#615d59]">
              Access your institution workspace to manage records, submissions, and communication in one place.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <img src="/logo.png" alt="TMS" className="mb-6 h-10 w-auto rounded border border-[rgba(0,0,0,0.1)] bg-white p-1" />
            <h2 className="text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[rgba(0,0,0,0.95)]">Welcome back</h2>
            <p className="mt-2 text-[#615d59]">Enter your credentials to continue.</p>

            <form onSubmit={handleLogin} className="mt-8">
              <Input icon={Mail} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="mb-6 flex justify-end">
                <Link to="/forgot-password" className="text-sm font-medium no-underline hover:text-[#005bab]">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded border border-[#f5c2c2] bg-[#fff5f5] p-3 text-sm text-[#dd5b00]">
                  {error}
                </motion.div>
              )}

              <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={isLoading} className="notion-btn-primary w-full">
                {isLoading ? <Loader className="mx-auto size-5 animate-spin" /> : "Sign in"}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-[#615d59]">
              New to TMS?{" "}
              <Link to="/signup" className="font-semibold no-underline hover:text-[#005bab]">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
