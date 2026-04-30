import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Mail, ArrowLeft } from "lucide-react";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { error, isLoading, verifyEmail, resendVerificationEmail } = useAuthStore();

  const submitCode = async (verificationCode) => {
    try {
      await verifyEmail(verificationCode);
      navigate("/overview");
      toast.success("Email verified successfully");
    } catch (verifyError) {
      console.log(verifyError);
    }
  };

  const handleChange = (index, value) => {
    const next = [...code];
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i += 1) {
        next[i] = pasted[i] || "";
      }
      setCode(next);
      const firstEmptyIndex = next.findIndex((digit) => digit === "");
      const targetIndex = firstEmptyIndex === -1 ? 5 : firstEmptyIndex;
      inputRefs.current[targetIndex]?.focus();
      return;
    }

    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitCode(code.join(""));
  };

  const handleResendEmail = async () => {
    try {
      await resendVerificationEmail();
      toast.success("Verification email sent! Check your inbox.");
    } catch (resendError) {
      toast.error(resendError.response?.data?.message || "Failed to resend email");
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      submitCode(code.join(""));
    }
  }, [code]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f5f4] p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white p-8">
        <div className="mb-6 inline-flex rounded-full bg-[#f2f9ff] p-3 text-[#097fe8]">
          <Mail size={20} />
        </div>
        <h2 className="text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[rgba(0,0,0,0.95)]">Verify your email</h2>
        <p className="mt-2 text-[#615d59]">Enter the 6-digit code sent to your email address.</p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4 flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-12 w-12 rounded border border-[rgba(0,0,0,0.1)] bg-white text-center text-xl font-bold text-[rgba(0,0,0,0.95)] focus:border-[#097fe8] focus:outline-none focus:ring-2 focus:ring-[#097fe8]/25"
              />
            ))}
          </div>

          {error && <p className="mb-4 rounded border border-[#f5c2c2] bg-[#fff5f5] p-3 text-sm text-[#dd5b00]">{error}</p>}

          <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={isLoading || code.some((digit) => !digit)} className="notion-btn-primary w-full">
            {isLoading ? "Verifying..." : "Verify email"}
          </motion.button>
        </form>

        <div className="mt-6">
          <p className="text-sm text-[#615d59]">Didn’t receive the code?</p>
          <button type="button" onClick={handleResendEmail} disabled={isLoading} className="mt-1 text-sm font-semibold text-[#0075de] hover:underline disabled:opacity-50">
            Resend email
          </button>
        </div>

        <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium no-underline hover:text-[#005bab]">
          <ArrowLeft size={14} /> Back to login
        </Link>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
