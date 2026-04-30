import { motion } from "framer-motion";
import { Lock, Mail, User, ArrowLeft, Loader } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/login/PasswordStrengthMeter";
import Input from "../components/login/Input";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (signupError) {
      console.log(signupError);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f4] p-4 sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1200px] overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px] lg:grid-cols-2">
        <div className="hidden border-r border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-10 lg:flex lg:flex-col lg:justify-between">
          <Link to="/landing" className="inline-flex items-center gap-2 text-[15px] font-medium text-[rgba(0,0,0,0.95)] no-underline hover:text-[#0075de]">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div>
            <span className="notion-badge">Get started</span>
            <h1 className="mt-5 text-[54px] font-bold leading-[1.04] tracking-[-1.875px] text-[rgba(0,0,0,0.95)]">Create your workspace.</h1>
            <p className="mt-4 max-w-md text-[#615d59]">Set up your account and begin managing your institution with a cleaner workflow.</p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <h2 className="text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[rgba(0,0,0,0.95)]">Create account</h2>
            <p className="mt-2 text-[#615d59]">Start with a free account.</p>

            <form onSubmit={handleSignUp} className="mt-8">
              <Input icon={User} type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input icon={Mail} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <PasswordStrengthMeter password={password} />

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded border border-[#f5c2c2] bg-[#fff5f5] p-3 text-sm text-[#dd5b00]">
                  {error}
                </motion.div>
              )}

              <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={isLoading} className="notion-btn-primary mt-6 w-full">
                {isLoading ? <Loader className="mx-auto size-5 animate-spin" /> : "Sign up"}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-[#615d59]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold no-underline hover:text-[#005bab]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
