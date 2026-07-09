import React, { useState, useEffect } from "react";
import { 
  getCertificates, 
  issueCertificate, 
  revokeCertificate 
} from "../../lib/db.js";
import { 
  IconLoader, 
  IconSearch, 
  IconPlus, 
  IconAlertTriangle, 
  IconCheck, 
  IconTrash 
} from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

export default function CertificatesAdmin() {
  useDocumentMetadata("Manage Certificates — TRBG", "Credential verification management controls.");

  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Form fields state
  const [certId, setCertId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [track, setTrack] = useState("Combat Bot Design");
  const [duration, setDuration] = useState("8 Weeks");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [grade, setGrade] = useState("Excellent");

  // Load certificates list
  const loadCerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await getCertificates();
      if (error) throw error;
      setCerts(data || []);
      
      // Auto-suggest next ID from loaded data
      const nextSuggested = suggestNextId(data || []);
      setCertId(nextSuggested);
    } catch (err) {
      setErrorMsg("Failed to sync certificate records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  // Helper: suggest next seq ID (TRBG-YYYY-XXXX)
  const suggestNextId = (certsList) => {
    const currentYear = new Date().getFullYear();
    if (!certsList || certsList.length === 0) {
      return `TRBG-${currentYear}-0001`;
    }
    const regex = /^TRBG-(\d{4})-(\d{4})$/;
    const validIds = certsList
      .map(c => c.id.toUpperCase().trim())
      .filter(id => regex.test(id));
    
    if (validIds.length === 0) {
      return `TRBG-${currentYear}-0001`;
    }
    
    let maxSeq = 0;
    let matchYear = currentYear;
    
    validIds.forEach(id => {
      const match = id.match(regex);
      const year = parseInt(match[1], 10);
      const seq = parseInt(match[2], 10);
      if (year === currentYear && seq > maxSeq) {
        maxSeq = seq;
        matchYear = year;
      } else if (year > matchYear) {
        matchYear = year;
        maxSeq = seq;
      }
    });

    const nextSeq = maxSeq + 1;
    const paddedSeq = String(nextSeq).padStart(4, '0');
    return `TRBG-${matchYear}-${paddedSeq}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!certId.trim() || !studentName.trim()) {
      setErrorMsg("Student name and Certificate ID are required.");
      return;
    }

    setSubmitLoading(true);
    try {
      const certData = {
        id: certId.trim().toUpperCase(),
        name: studentName.trim(),
        track,
        duration,
        issue_date: issueDate,
        grade,
        status: "valid"
      };

      const { data, error } = await issueCertificate(certData);
      if (error) {
        if (error.code === "23505") {
          throw new Error("A certificate with this ID already exists.");
        }
        throw error;
      }

      setSuccessMsg(`Certificate ${data.id} issued for ${data.name}`);
      
      // Reset form variables (prefill next suggested ID)
      setStudentName("");
      setTrack("Combat Bot Design");
      setDuration("8 Weeks");
      setIssueDate(new Date().toISOString().split("T")[0]);
      setGrade("Excellent");
      
      // Reload list (sets suggestNextId)
      await loadCerts();
    } catch (err) {
      setErrorMsg(err.message || "Credential registration failed.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRevoke = async (c) => {
    const confirmRevoke = window.confirm(
      `Revoke certificate for ${c.name}? This cannot be undone.`
    );
    if (!confirmRevoke) return;

    try {
      const { error } = await revokeCertificate(c.id);
      if (error) throw error;
      
      setSuccessMsg(`Certificate ${c.id} successfully revoked.`);
      await loadCerts();
    } catch (err) {
      setErrorMsg("Revocation transaction failed.");
    }
  };

  // Search logic client-side filter
  const filteredCerts = certs.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 select-none">
      
      {/* Header Area */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary flex items-center gap-3">
            CERTIFICATES
            <span className="bg-[#1A1A1A] border border-plate text-ash text-xs px-2.5 py-0.5 font-sans font-semibold rounded-none tracking-normal">
              {certs.length} TOTAL
            </span>
          </h1>
          <p className="text-ash text-sm font-light">Issue new certificates and manage cadet records.</p>
        </div>
      </div>

      {/* Form & Messages Container */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
        <h2 className="font-display text-2xl uppercase tracking-wider text-text-primary flex items-center gap-2 border-b border-[#1A1A1A] pb-4">
          <IconPlus className="text-fire" size={20} /> Issue Certificate
        </h2>

        {successMsg && (
          <div className="border border-green-500/30 bg-green-500/5 p-4 flex items-center gap-3 text-green-400 rounded-none text-sm">
            <IconCheck size={18} className="shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="border border-red-500/30 bg-red-500/5 p-4 flex items-center gap-3 text-red-500 rounded-none text-sm">
            <IconAlertTriangle size={18} className="shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-ash tracking-widest font-semibold" htmlFor="cert-id-input">Certificate ID</label>
            <input 
              id="cert-id-input"
              type="text" 
              value={certId} 
              onChange={(e) => setCertId(e.target.value)} 
              placeholder="e.g. TRBG-2025-0001"
              required
              className="bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3.5 text-text-primary text-sm font-mono tracking-widest uppercase rounded-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-ash tracking-widest font-semibold" htmlFor="student-name-input">Student Full Name</label>
            <input 
              id="student-name-input"
              type="text" 
              value={studentName} 
              onChange={(e) => setStudentName(e.target.value)} 
              placeholder="Enter name"
              required
              className="bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3.5 text-text-primary text-sm rounded-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-ash tracking-widest font-semibold" htmlFor="track-select">Specialization Track</label>
            <select 
              id="track-select"
              value={track} 
              onChange={(e) => setTrack(e.target.value)}
              className="bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3.5 text-text-primary text-sm rounded-none appearance-none"
            >
              <option>Combat Bot Design</option>
              <option>Embedded Systems & Control</option>
              <option>Arena Operations & Event Management</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-ash tracking-widest font-semibold" htmlFor="duration-select">Duration</label>
            <select 
              id="duration-select"
              value={duration} 
              onChange={(e) => setDuration(e.target.value)}
              className="bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3.5 text-text-primary text-sm rounded-none appearance-none"
            >
              <option>4 Weeks</option>
              <option>8 Weeks</option>
              <option>3 Months</option>
              <option>12 Weeks</option>
              <option>16 Weeks</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-ash tracking-widest font-semibold" htmlFor="issue-date-input">Issue Date</label>
            <input 
              id="issue-date-input"
              type="date" 
              value={issueDate} 
              onChange={(e) => setIssueDate(e.target.value)}
              required
              className="bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3.5 text-text-primary text-sm font-mono rounded-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-ash tracking-widest font-semibold" htmlFor="grade-select">Performance Grade</label>
            <select 
              id="grade-select"
              value={grade} 
              onChange={(e) => setGrade(e.target.value)}
              className="bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3.5 text-text-primary text-sm rounded-none appearance-none"
            >
              <option>Outstanding</option>
              <option>Excellent</option>
              <option>Good</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full md:w-auto px-8 py-4 bg-fire hover:bg-[#cc3700] disabled:bg-[#1A1A1A] disabled:text-ash/40 text-forge font-display text-lg uppercase tracking-wider transition-colors rounded-none flex items-center justify-center gap-2 select-none"
            >
              {submitLoading ? (
                <>
                  Issuing... <IconLoader className="animate-spin text-forge" size={16} />
                </>
              ) : (
                "ISSUE CERTIFICATE"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Database list section */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-[#1A1A1A] pb-4">
          <h2 className="font-display text-2xl uppercase tracking-wider text-text-primary">
            Issued Registry
          </h2>

          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name or certificate ID..."
              className="w-full bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none py-2.5 pl-10 pr-4 text-xs tracking-wider rounded-none"
            />
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
          </div>
        </div>

        {/* Dynamic loader */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <IconLoader className="animate-spin text-fire" size={32} />
            <span className="text-xs uppercase text-ash tracking-widest">Querying Records...</span>
          </div>
        ) : filteredCerts.length === 0 ? (
          <p className="text-sm text-ash/60 italic text-center py-12">No matching credentials found.</p>
        ) : (
          <>
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-xs uppercase tracking-widest text-ash">
                    <th className="py-4 font-semibold">ID</th>
                    <th className="py-4 font-semibold">Student Name</th>
                    <th className="py-4 font-semibold">Specialization</th>
                    <th className="py-4 font-semibold">Date</th>
                    <th className="py-4 font-semibold">Grade</th>
                    <th className="py-4 font-semibold">Status</th>
                    <th className="py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {filteredCerts.map((c) => {
                    const isRevoked = c.status === "revoked";
                    return (
                      <tr 
                        key={c.id} 
                        className={`hover:bg-[#0C0C0C]/50 transition-colors ${
                          isRevoked ? "opacity-40" : ""
                        }`}
                      >
                        <td className="py-4 font-mono font-bold text-xs uppercase tracking-wider text-text-primary">
                          {c.id}
                        </td>
                        <td className={`py-4 font-bold text-text-primary ${isRevoked ? "line-through" : ""}`}>
                          {c.name}
                        </td>
                        <td className="py-4 text-ash font-medium">{c.track}</td>
                        <td className="py-4 font-mono text-ash text-xs">
                          {c.issue_date ? new Date(c.issue_date).toLocaleDateString() : ""}
                        </td>
                        <td className="py-4 font-semibold text-spark">{c.grade}</td>
                        <td className="py-4">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${
                            isRevoked 
                              ? "border-red-500/40 bg-red-500/5 text-red-500" 
                              : "border-green-500/40 bg-green-500/5 text-green-400"
                          }`}>
                            {isRevoked ? "REVOKED" : "VALID"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {!isRevoked && (
                            <button
                              onClick={() => handleRevoke(c)}
                              className="px-3.5 py-1.5 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-forge font-display text-[12px] uppercase tracking-wider transition-all select-none rounded-none font-semibold"
                            >
                              REVOKE
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE STACKED CARDS GRID */}
            <div className="md:hidden space-y-4">
              {filteredCerts.map((c) => {
                const isRevoked = c.status === "revoked";
                return (
                  <div 
                    key={c.id} 
                    className={`bg-[#080808] border border-[#1A1A1A] p-5 space-y-4 relative ${
                      isRevoked ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-ash font-mono block">CREDENTIAL ID</span>
                        <strong className="font-mono text-sm tracking-widest text-text-primary uppercase block">
                          {c.id}
                        </strong>
                      </div>
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 border ${
                        isRevoked 
                          ? "border-red-500/40 bg-red-500/5 text-red-500" 
                          : "border-green-500/40 bg-green-500/5 text-green-400"
                      }`}>
                        {isRevoked ? "REVOKED" : "VALID"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs border-t border-[#1A1A1A]/60 pt-3">
                      <div>
                        <span className="text-[9px] text-ash/60 uppercase block font-semibold">Student</span>
                        <span className={`font-bold text-text-primary text-sm ${isRevoked ? "line-through" : ""}`}>
                          {c.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-ash/60 uppercase block font-semibold">Track</span>
                        <span className="text-[#F5F5F5]/80 font-medium">{c.track}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-ash/60 uppercase block font-semibold">Issue Date</span>
                        <span className="font-mono text-ash">{c.issue_date}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-ash/60 uppercase block font-semibold">Grade</span>
                        <span className="text-spark font-bold text-sm">{c.grade}</span>
                      </div>
                    </div>

                    {!isRevoked && (
                      <div className="border-t border-[#1A1A1A]/60 pt-3 flex justify-end">
                        <button
                          onClick={() => handleRevoke(c)}
                          className="w-full py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-forge font-display text-sm uppercase tracking-wider transition-all select-none rounded-none font-semibold text-center"
                        >
                          REVOKE CERTIFICATE
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
