import React, { useState, useEffect } from "react";
import { getCookie, setCookie } from "../lib/cookies.js";
import { IconCookie, IconX } from "@tabler/icons-react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or declined
    const consent = getCookie("trbg_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookie("trbg_cookie_consent", "accepted", 365);
    setShow(false);
  };

  const handleDecline = () => {
    setCookie("trbg_cookie_consent", "declined", 30);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] bg-[#111111]/95 backdrop-blur-md border border-fire/20 border-t-4 border-t-fire p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-4 animate-slide-up"
      role="status"
      aria-live="polite"
    >
      <style>{`
        @keyframes trbg-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: trbg-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-fire/10 border border-fire/20 text-fire shrink-0">
            <IconCookie size={20} />
          </div>
          <span className="font-display text-[16px] tracking-wider uppercase text-text-primary">
            Cookie Policy
          </span>
        </div>
        <button 
          onClick={handleDecline}
          className="text-ash/50 hover:text-fire transition-colors p-1"
          aria-label="Close Cookie Policy Banner"
        >
          <IconX size={18} />
        </button>
      </div>

      {/* Body text */}
      <p className="font-body text-[13px] text-ash leading-relaxed">
        We use cookies to optimize performance, analyze arena traffic, and enhance your combat engineering experience. Accept to consent to our standard storage.
      </p>

      {/* Action Row */}
      <div className="flex items-center justify-end gap-4 mt-2">
        <button 
          onClick={handleDecline}
          className="font-display text-[11px] uppercase tracking-widest text-ash hover:text-text-primary transition-colors py-2"
        >
          Decline
        </button>
        <button 
          onClick={handleAccept}
          className="px-5 py-2.5 bg-fire hover:bg-[#cc3700] text-forge font-display text-[11px] uppercase tracking-widest font-bold transition-all"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
