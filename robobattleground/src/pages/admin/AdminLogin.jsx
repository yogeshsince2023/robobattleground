import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { IconEye, IconEyeOff, IconLoader, IconAlertOctagon } from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

export default function AdminLogin() {
  useDocumentMetadata("Admin Secure Access — TRBG", "Restricted administrative login panel.");
  
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Client-side rate-limiting states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Redirect if session is already active
  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  // Lockout timer decrement
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setTimeout(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    setLoading(true);
    setErrorMsg("");

    const { data, error } = await login(email, password);

    if (error) {
      setLoading(false);
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      
      if (nextFailed >= 3) {
        setErrorMsg("Too many attempts. Please wait.");
        setLockoutTime(30);
        setFailedAttempts(0);
      } else {
        setErrorMsg("Invalid credentials. Access denied.");
      }
    } else {
      setLoading(false);
      setFailedAttempts(0);
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="bg-[#080808] text-[#F5F5F5] min-h-screen flex items-center justify-center p-6 relative font-body select-none">
      {/* Target spotlight radial overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(255,69,0,0.06) 0%, transparent 65%)"
        }}
      />

      <div className="w-full max-w-md bg-[#111111] border border-[#1A1A1A] p-8 md:p-12 relative z-10 space-y-8 rounded-none">
        
        {/* restricted warning badge */}
        <div className="flex justify-center">
          <div className="border border-fire/30 bg-fire/5 px-4 py-1.5 font-display text-[12px] text-fire uppercase tracking-widest inline-flex items-center gap-1.5">
            🔒 SECURE LOGIN
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            {/* SVG Skull Logo */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-8 h-8 fill-current text-fire animate-pulse"
            >
              <path d="M50,10 C30,10 20,25 20,45 C20,55 24,65 30,70 L30,85 C30,88 33,90 36,90 L64,90 C67,90 70,88 70,85 L70,70 C76,65 80,55 80,45 C80,25 70,10 50,10 Z M38,40 C38,36 41,33 45,33 C49,33 52,36 52,40 C52,44 49,47 45,47 C41,47 38,44 38,40 Z M62,40 C62,36 65,33 69,33 C73,33 76,36 76,40 C76,44 73,47 69,47 C65,47 62,44 62,40 Z M38,62 L62,62 L62,66 L38,66 Z" />
            </svg>
            <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary leading-none">
              ADMIN ACCESS
            </h1>
          </div>
          <p className="text-ash/60 text-[13px] tracking-wide">
            Restricted area. Authorized personnel only.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="admin-email" className="text-xs uppercase text-ash/80 tracking-wider">Email</label>
            <input 
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. operator@therobobattleground.in"
              required
              disabled={loading || lockoutTime > 0}
              className="w-full bg-[#080808] border border-[#1A1A1A] p-4 text-text-primary outline-none focus:border-fire rounded-none text-sm transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label htmlFor="admin-password" className="text-xs uppercase text-ash/80 tracking-wider">Password</label>
            <div className="relative">
              <input 
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading || lockoutTime > 0}
                className="w-full bg-[#080808] border border-[#1A1A1A] p-4 pr-12 text-text-primary outline-none focus:border-fire rounded-none text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ash hover:text-text-primary transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || lockoutTime > 0}
            className="w-full py-4 bg-fire hover:bg-[#cc3700] disabled:bg-[#1A1A1A] disabled:text-ash/40 text-forge font-display text-xl uppercase tracking-wider transition-colors rounded-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                Authenticating... <IconLoader className="animate-spin text-forge" size={18} />
              </>
            ) : lockoutTime > 0 ? (
              `LOCKED OUT (${lockoutTime}S)`
            ) : (
              "LOGIN TO ADMIN"
            )}
          </button>
        </form>

        {/* Error cards */}
        {errorMsg && (
          <div className="border border-red-500/30 bg-red-500/5 p-4 flex items-start gap-2.5 text-red-500 select-none rounded-none">
            <IconAlertOctagon size={20} className="shrink-0 mt-0.5" />
            <div className="text-xs uppercase tracking-wide leading-relaxed font-semibold">
              {errorMsg}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
