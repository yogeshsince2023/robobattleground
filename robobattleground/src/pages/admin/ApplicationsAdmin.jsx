import React, { useState, useEffect } from "react";
import { getInternshipApplications, updateInternshipApplication } from "../../lib/db.js";
import { 
  IconLoader, 
  IconDownload, 
  IconX, 
  IconAlertTriangle, 
  IconFileSpreadsheet, 
  IconExternalLink 
} from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

export default function ApplicationsAdmin() {
  useDocumentMetadata("Manage Applications — TRBG", "Cadet training application records.");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Detail slide-out state
  const [selectedApp, setSelectedApp] = useState(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("new");
  const [saveLoading, setSaveLoading] = useState(false);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await getInternshipApplications();
      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      setErrorMsg("Failed to sync internship applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleRowClick = (app) => {
    setSelectedApp(app);
    setNotes(app.notes || "");
    setStatus(app.status || "new");
  };

  const handleClosePanel = () => {
    setSelectedApp(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedApp) return;
    setSaveLoading(true);
    try {
      const { error } = await updateInternshipApplication(selectedApp.id, {
        status,
        notes
      });
      if (error) throw error;

      setSelectedApp(null);
      await loadApplications();
    } catch (err) {
      alert("Failed to update application status.");
    } finally {
      setSaveLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Created At", 
      "Name", 
      "Email", 
      "Phone", 
      "College", 
      "Branch & Year", 
      "Duration", 
      "Track", 
      "Portfolio URL", 
      "Status", 
      "Notes"
    ];

    const rows = applications.map((a) => [
      a.created_at ? new Date(a.created_at).toISOString() : "",
      a.full_name,
      a.email,
      a.phone,
      a.college,
      a.branch_year || "",
      a.duration || "",
      a.track || "",
      a.portfolio_url || "",
      a.status,
      (a.notes || "").replace(/"/g, '""')
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(r => r.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `internship_applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 select-none relative">
      
      {/* Header View */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary">
            INTERNSHIP APPLICATIONS
          </h1>
          <p className="text-ash text-sm font-light">Review cadet recruit portfolios and application status.</p>
        </div>

        {applications.length > 0 && (
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 border border-spark text-spark hover:bg-spark hover:text-forge px-5 py-3 font-display text-[15px] uppercase tracking-wider transition-colors select-none rounded-none font-semibold"
          >
            <IconFileSpreadsheet size={18} /> Export CSV
          </button>
        )}
      </div>

      {/* Primary Applications Table */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <IconLoader className="animate-spin text-fire" size={32} />
            <span className="text-xs uppercase tracking-widest text-ash">Syncing Applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <p className="text-sm text-ash/60 italic text-center py-12">No applications registered in queue.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1A1A1A] text-xs uppercase tracking-widest text-ash">
                  <th className="py-4 font-semibold">Date</th>
                  <th className="py-4 font-semibold">Candidate</th>
                  <th className="py-4 font-semibold">College</th>
                  <th className="py-4 font-semibold">Specialization</th>
                  <th className="py-4 font-semibold">Duration</th>
                  <th className="py-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {applications.map((a) => (
                  <tr 
                    key={a.id} 
                    onClick={() => handleRowClick(a)}
                    className="hover:bg-[#0C0C0C]/80 cursor-pointer transition-colors"
                  >
                    <td className="py-4 font-mono text-ash text-xs">
                      {a.created_at ? new Date(a.created_at).toLocaleDateString() : ""}
                    </td>
                    <td className="py-4 font-bold text-text-primary uppercase tracking-wide">
                      {a.full_name}
                    </td>
                    <td className="py-4 text-ash font-medium truncate max-w-[150px]">{a.college}</td>
                    <td className="py-4 text-spark font-semibold">{a.track}</td>
                    <td className="py-4 text-ash font-mono text-xs">{a.duration}</td>
                    <td className="py-4 text-right">
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 border ${
                        a.status === 'new' 
                          ? 'border-spark/40 bg-spark/5 text-spark' 
                          : a.status === 'reviewing'
                          ? 'border-blue-500/40 bg-blue-500/5 text-blue-400'
                          : a.status === 'accepted'
                          ? 'border-green-500/40 bg-green-500/5 text-green-400'
                          : 'border-red-500/40 bg-red-500/5 text-red-400'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL SLIDE-OUT PANEL */}
      {selectedApp && (
        <>
          <div 
            onClick={handleClosePanel}
            className="fixed inset-0 bg-[#000000]/70 backdrop-blur-sm z-40 transition-opacity"
          />

          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#111111] border-l border-[#1A1A1A] shadow-2xl p-8 z-50 overflow-y-auto space-y-8 flex flex-col justify-between select-text">
            
            <div className="space-y-8">
              <div className="flex justify-between items-start border-b border-[#1A1A1A] pb-4 select-none">
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-wider text-text-primary">
                    Candidate Details
                  </h3>
                  <span className="text-[10px] font-mono text-ash/60 uppercase">
                    ID: {selectedApp.id}
                  </span>
                </div>
                <button 
                  onClick={handleClosePanel}
                  className="p-1 border border-[#1A1A1A] hover:border-fire text-ash hover:text-fire transition-colors"
                >
                  <IconX size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Full Name</span>
                  <span className="font-bold text-[#F5F5F5]">{selectedApp.full_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">College / Univ</span>
                  <span className="font-medium text-[#F5F5F5]">{selectedApp.college}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Branch & Year</span>
                  <span className="text-ash font-medium">{selectedApp.branch_year || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Duration</span>
                  <span className="text-ash font-mono">{selectedApp.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Email Address</span>
                  <a href={`mailto:${selectedApp.email}`} className="text-fire hover:underline break-all">{selectedApp.email}</a>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Phone Contact</span>
                  <span className="font-mono text-[#F5F5F5]">{selectedApp.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Track Selection</span>
                  <span className="text-spark font-bold">{selectedApp.track}</span>
                </div>

                {selectedApp.portfolio_url && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Portfolio URL</span>
                    <a 
                      href={selectedApp.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-fire hover:underline inline-flex items-center gap-1 font-semibold text-xs mt-0.5"
                    >
                      View Portfolio Work <IconExternalLink size={12} />
                    </a>
                  </div>
                )}

                <div className="col-span-2 border-t border-[#1A1A1A]/60 pt-4">
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Motivation Essay</span>
                  <p className="text-[#F5F5F5]/80 text-xs leading-relaxed whitespace-pre-wrap mt-1 bg-[#080808] border border-[#1A1A1A] p-3 max-h-[160px] overflow-y-auto">
                    {selectedApp.motivation}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t border-[#1A1A1A] pt-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-ash tracking-widest font-semibold font-mono" htmlFor="app-status-select">Application Status</label>
                <select
                  id="app-status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3 text-text-primary text-sm rounded-none appearance-none"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-ash tracking-widest font-semibold font-mono" htmlFor="app-notes-textarea">Internal Notes</label>
                <textarea
                  id="app-notes-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter administrative notation logs here..."
                  rows={4}
                  className="w-full bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3 text-text-primary text-sm rounded-none resize-none"
                />
              </div>

              <button
                onClick={handleSaveChanges}
                disabled={saveLoading}
                className="w-full py-4 bg-fire hover:bg-[#cc3700] disabled:bg-[#1A1A1A] disabled:text-ash/40 text-forge font-display text-lg uppercase tracking-wider transition-colors rounded-none flex items-center justify-center gap-2 select-none font-semibold"
              >
                {saveLoading ? (
                  <>
                    Saving... <IconLoader className="animate-spin text-forge" size={16} />
                  </>
                ) : (
                  "SAVE CHANGES"
                )}
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
