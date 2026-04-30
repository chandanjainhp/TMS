import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Mail, Lock, Loader, ArrowLeft, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/login/Input";
import { useAdminAuthStore } from "../store/adminAuthStore";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupComplete, setSetupComplete] = useState(true);
  const { login, isLoading, error } = useAdminAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/setup/check-setup")
      .then((res) => setSetupComplete(res.data.setupComplete))
      .catch(() => setSetupComplete(true));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      const loggedInAdmin = useAdminAuthStore.getState().admin;
      if (loggedInAdmin?.role === "principal") {
        navigate("/principal");
      } else {
        navigate("/admin");
      }
    } catch (loginError) {
      console.log(loginError);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f4] p-4 sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1200px] overflow-hidden rounded border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px] lg:grid-cols-2">
        <div className="hidden border-r border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-10 lg:flex lg:flex-col lg:justify-between">
          <Link to="/landing" className="inline-flex items-center gap-2 text-[15px] font-medium text-[rgba(0,0,0,0.95)] no-underline hover:text-[#0075de]">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div>
            <span className="notion-badge">Admin portal</span>
            <h1 className="mt-5 text-[54px] font-bold leading-[1.04] tracking-[-1.875px] text-[rgba(0,0,0,0.95)]">Institution control center.</h1>
            <p className="mt-4 max-w-md text-[#615d59]">Use administrator access to configure curriculum, records, analytics, and communication flows.</p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <img src="/logo.png" alt="TMS" className="mb-6 h-10 w-auto rounded border border-[rgba(0,0,0,0.1)] bg-white p-1" />
            <h2 className="text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[rgba(0,0,0,0.95)]">Admin sign in</h2>
            <p className="mt-2 text-[#615d59]">Enter administrator credentials.</p>

            <form onSubmit={handleLogin} className="mt-8">
              <Input icon={Mail} type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <div className="mb-6 flex justify-end">
                <Link to="/admin/forgot-password" className="text-sm font-medium no-underline hover:text-[#005bab]">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded border border-[#f5c2c2] bg-[#fff5f5] p-3 text-sm text-[#dd5b00]">
                  {error}
                </motion.div>
              )}

              <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={isLoading} className="notion-btn-primary w-full">
                {isLoading ? <Loader className="mx-auto size-5 animate-spin" /> : "Access dashboard"}
              </motion.button>
            </form>

            {!setupComplete && (
              <Link to="/setup" className="mt-4 inline-flex w-full items-center justify-center rounded bg-[#1aae39] px-4 py-2 text-[15px] font-semibold text-white no-underline hover:bg-[#159930]">
                <Shield size={16} className="mr-2" />
                Run first-time setup
              </Link>
            )}

            <p className="mt-6 text-center text-sm text-[#615d59]">
              Not an admin?{" "}
              <Link to="/login" className="font-semibold no-underline hover:text-[#005bab]">
                Use regular sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
