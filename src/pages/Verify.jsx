import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import useDocumentMetadata from "../hooks/useDocumentMetadata.js";
import { motion, AnimatePresence } from "framer-motion";
import { IconShieldCheck, IconAlertTriangle, IconLoader, IconShare, IconCopy, IconCheck } from "@tabler/icons-react";
import PageWrapper from "../components/PageWrapper.jsx";
import { getCertificate } from "../lib/db.js";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const certParam = searchParams.get("cert") || "";

  const [certId, setCertId] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | found | notFound
  const [matchedCert, setMatchedCert] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  const [dataLoaded, setDataLoaded] = useState(true);

  const runVerification = (code) => {
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      setError("Please enter a certificate number");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setState("idle");
      return;
    }

    setState("loading");
    setMatchedCert(null);
    setError("");

    setTimeout(async () => {
      try {
        const { data, error: fetchErr } = await getCertificate(trimmedCode);
        
        if (fetchErr) {
          if (fetchErr.code === "PGRST116") {
            setState("notFound");
          } else {
            setError("Verification system temporarily unavailable");
            setState("idle");
          }
          return;
        }

        if (data) {
          const mappedData = {
            ...data,
            issueDate: data.issue_date
          };
          setMatchedCert(mappedData);
          setState("found");
        } else {
          setState("notFound");
        }
      } catch (err) {
        setError("Verification system temporarily unavailable");
        setState("idle");
      }
    }, 1500);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    runVerification(certId);
  };

  const handleSampleClick = (code) => {
    setCertId(code);
    runVerification(code);
  };

  const handleTryAgain = () => {
    setCertId("");
    setState("idle");
    setMatchedCert(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCopyLink = () => {
    if (!matchedCert) return;
    const shareUrl = `${window.location.origin}/verify?cert=${matchedCert.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Pre-fill cert parameter if present in query
  useEffect(() => {
    if (certParam) {
      const decodedParam = decodeURIComponent(certParam).trim();
      setCertId(decodedParam);
      runVerification(decodedParam);
    }
  }, [certParam]);

  useDocumentMetadata("Certificate Verification — TRBG", "Verify the authenticity of Cadet Training Certificates, check grade records, and validate issued credentials securely online.");

  return (
    <PageWrapper>

      <div className="bg-forge text-text-primary min-h-screen py-20 px-4 font-body bg-[radial-gradient(circle_at_center,rgba(255,184,0,0.04)_0%,transparent_60%)]">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Zone */}
          <div className="text-center pt-16 pb-12">
            <div className="border border-spark text-spark px-4 py-1.5 Inter text-[11px] uppercase tracking-[0.2em] inline-block mb-6 select-none font-semibold">
              🔒 SECURE VERIFICATION PORTAL
            </div>
            <h1 className="font-display text-[clamp(32px,6vw,72px)] font-black uppercase text-text-primary mb-3">
              CERTIFICATE VERIFICATION
            </h1>
            <p className="max-w-2xl mx-auto text-ash text-base md:text-lg font-light leading-relaxed">
              Enter your certificate number to instantly verify authenticity. All TRBG certificates are tamper-proof and permanently recorded.
            </p>
            <p className="text-[12px] text-ash/60 mt-3 font-mono">
              Format: TRBG-YYYY-XXXX
            </p>
          </div>

          {/* Input verification form */}
          <form 
            onSubmit={handleVerify} 
            className="bg-steel border border-plate p-6 md:p-8 flex flex-col md:flex-row gap-4 items-stretch rounded-none mb-8"
          >
            <div className="flex-grow flex flex-col justify-center">
              <label htmlFor="verify-cert-id" className="sr-only">Certificate ID</label>
              <input 
                id="verify-cert-id"
                ref={inputRef}
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="ENTER CERTIFICATE ID (E.G. TRBG-2024-0001)"
                className={`w-full bg-[#0D0D0D] border p-5 uppercase font-mono tracking-widest text-[16px] md:text-[20px] outline-none text-text-primary rounded-none ${
                  shake ? "animate-trbg-shake border-red-500" : "border-plate focus:border-fire"
                }`}
                disabled={state === "loading"}
              />
              
              {/* Show hint if user starts typing without prefix */}
              {certId.length > 0 && !certId.toUpperCase().startsWith("TRBG-") && (
                <p className="text-xs text-spark mt-2 font-mono select-none">
                  Hint: Certificate IDs start with "TRBG-"
                </p>
              )}

              {/* Subtle loading state while fetching JSON */}
              {!dataLoaded && (
                <div className="flex items-center gap-2 text-xs text-ash/60 mt-2 font-mono select-none">
                  <IconLoader size={12} className="animate-spin text-fire" /> Syncing credentials cache database...
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={state === "loading"}
              className="bg-fire hover:bg-[#cc3700] text-forge font-display text-[20px] tracking-wider px-10 py-5 uppercase transition-colors rounded-none shrink-0"
            >
              Verify Now
            </button>
          </form>

          {/* States Area */}
          <AnimatePresence mode="wait">
            
            {/* STATE 1 - IDLE */}
            {state === "idle" && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                {/* Sample IDs */}
                <div className="text-center font-mono text-sm text-ash/50">
                  Try:{" "}
                  <button type="button" onClick={() => handleSampleClick("TRBG-2024-0001")} className="text-spark hover:underline mx-1">TRBG-2024-0001</button> · 
                  <button type="button" onClick={() => handleSampleClick("TRBG-2024-0007")} className="text-spark hover:underline mx-1">TRBG-2024-0007</button> · 
                  <button type="button" onClick={() => handleSampleClick("TRBG-2024-0013")} className="text-spark hover:underline mx-1">TRBG-2024-0013</button>
                </div>

                {/* Info Cards Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: "✓ Instant Verification", desc: "Instantly checks record logs on our local ledger server." },
                    { title: "🔒 Tamper-Proof", desc: "Validates name, grade, and duration against immutable database logs." },
                    { title: "📋 Full Details", desc: "Reveals completed program modules, grades, and issuance stamps." }
                  ].map((card, i) => (
                    <div key={i} className="bg-[#111111] border border-plate p-6 rounded-none">
                      <h3 className="font-display text-lg uppercase tracking-wider text-text-primary mb-2">
                        {card.title}
                      </h3>
                      <p className="text-xs text-ash/80 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STATE 2 - LOADING */}
            {state === "loading" && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#111111] border border-plate p-8 h-36 flex flex-col justify-center items-center relative overflow-hidden"
              >
                <div className="animate-trbg-scan-line" />
                <div className="relative z-10 flex items-center gap-3 text-ash font-display text-[20px] tracking-[0.2em] uppercase select-none">
                  <IconLoader className="animate-spin text-fire" size={24} />
                  Scanning Database...
                </div>
              </motion.div>
            )}

            {/* STATE 3 - FOUND (valid certificate) */}
            {state === "found" && matchedCert && (
              <motion.div
                key="found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-6"
              >
                {/* Green bar */}
                <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 py-3 text-center rounded-none select-none">
                  <span className="font-display text-[20px] text-[#22c55e] tracking-wider uppercase">
                    ✓ CERTIFICATE VERIFIED — AUTHENTIC
                  </span>
                </div>

                {/* Certificate layout with responsive padding and text scaling */}
                <div className="bg-[#111111] border border-[#22c55e]/30 p-4 sm:p-8 md:p-12 relative overflow-hidden max-w-2xl mx-auto shadow-2xl rounded-none">
                  {/* Watermark background stamp */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <span className="font-display text-[60px] sm:text-[100px] text-[#22c55e]/[0.03] rotate-[-20deg] font-black uppercase tracking-widest whitespace-nowrap">
                      VERIFIED ✓
                    </span>
                  </div>

                  <div className="relative z-10">
                    
                    {/* Header logos */}
                    <div className="flex justify-between items-center border-b border-plate pb-6 mb-6">
                      <span className="font-display text-xl sm:text-2xl tracking-wider text-text-primary leading-none uppercase">
                        THE ROBO <span className="text-fire">BG</span>
                      </span>
                      <span className="font-display text-xs sm:text-sm tracking-widest text-ash uppercase leading-none">
                        CERTIFICATE OF COMPLETION
                      </span>
                    </div>

                    {/* Body cert contents */}
                    <div className="space-y-4 sm:space-y-6 text-center md:text-left">
                      <p className="font-body text-[13px] text-ash italic">
                        This certifies that
                      </p>
                      <h2 className="font-display text-[clamp(28px,5vw,48px)] font-black uppercase text-text-primary tracking-wide">
                        {matchedCert.name}
                      </h2>
                      <p className="font-body text-[14px] text-ash italic">
                        has successfully completed the
                      </p>
                      <h3 className="font-display text-xl sm:text-2xl md:text-3xl uppercase tracking-wider text-fire">
                        {matchedCert.track}
                      </h3>
                    </div>

                    {/* Detail Grid */}
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-plate mt-8 pt-8 text-xs sm:text-sm">
                      <div>
                        <span className="text-ash/40 text-xs uppercase tracking-wider block">Duration</span>
                        <strong className="text-text-primary font-semibold text-sm sm:text-base">{matchedCert.duration}</strong>
                      </div>
                      <div>
                        <span className="text-ash/40 text-xs uppercase tracking-wider block">Issue Date</span>
                        <strong className="text-text-primary font-semibold text-sm sm:text-base">{matchedCert.issueDate}</strong>
                      </div>
                      <div>
                        <span className="text-ash/40 text-xs uppercase tracking-wider block">Grade Earned</span>
                        <strong className="text-spark font-semibold text-sm sm:text-base uppercase">{matchedCert.grade}</strong>
                      </div>
                      <div>
                        <span className="text-ash/40 text-xs uppercase tracking-wider block">Certificate ID</span>
                        <strong className="text-text-primary font-mono text-sm sm:text-base uppercase tracking-widest">{matchedCert.id}</strong>
                      </div>
                    </div>

                    {/* Bottom validation footer */}
                    <div className="border-t border-plate mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs">
                      <span className="text-ash/40 font-mono">Issued by The Robo Battle Ground, India</span>
                      <a href="https://therobobattleground.in" target="_blank" rel="noreferrer" className="text-fire font-semibold hover:underline">therobobattleground.in</a>
                    </div>

                  </div>
                </div>

                {/* Share actions */}
                <div className="text-center">
                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-3 border border-plate hover:border-fire text-ash hover:text-fire font-display text-[15px] tracking-wider uppercase inline-flex items-center gap-2 rounded-none transition-colors"
                  >
                    {copied ? (
                      <>
                        <IconCheck size={16} /> Link Copied
                      </>
                    ) : (
                      <>
                        <IconShare size={16} /> Share This Certificate
                      </>
                    )}
                  </button>
                </div>

              </motion.div>
            )}

            {/* STATE 4 - NOT FOUND */}
            {state === "notFound" && (
              <motion.div
                key="notFound"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Red bar */}
                <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 py-3.5 text-center rounded-none select-none">
                  <span className="font-display text-[20px] text-[#ef4444] tracking-wider uppercase">
                    ✗ CERTIFICATE NOT FOUND
                  </span>
                </div>

                {/* Details card */}
                <div className="bg-steel border border-plate p-8 max-w-2xl mx-auto rounded-none space-y-6">
                  <p className="text-ash text-sm leading-relaxed">
                    No certificate matching <strong className="text-text-primary font-mono">"{certId.toUpperCase()}"</strong> exists in our records database. Certificate IDs are case-sensitive.
                  </p>
                  <p className="text-ash text-sm leading-relaxed">
                    If you believe this is an error or have credentials issued manually, contact our command center team at{" "}
                    <a href="mailto:therobobattleground@gmail.com" className="text-fire font-semibold hover:underline">
                      therobobattleground@gmail.com
                    </a>.
                  </p>
                  <button
                    onClick={handleTryAgain}
                    className="px-8 py-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-text-primary font-display text-[16px] tracking-wider uppercase rounded-none transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </PageWrapper>
  );
}
