import React, { useState, useEffect } from "react";
import { getArenaEnquiries, updateArenaEnquiry } from "../../lib/db.js";
import { 
  IconLoader, 
  IconDownload, 
  IconX, 
  IconAlertTriangle, 
  IconFileSpreadsheet 
} from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

export default function EnquiriesAdmin() {
  useDocumentMetadata("Manage Enquiries — TRBG", "Arena slot booking request records.");

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Detail slide-out state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("new");
  const [saveLoading, setSaveLoading] = useState(false);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await getArenaEnquiries();
      if (error) throw error;
      setEnquiries(data || []);
    } catch (err) {
      setErrorMsg("Failed to sync booking enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleRowClick = (enq) => {
    setSelectedEnquiry(enq);
    setNotes(enq.notes || "");
    setStatus(enq.status || "new");
  };

  const handleClosePanel = () => {
    setSelectedEnquiry(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedEnquiry) return;
    setSaveLoading(true);
    try {
      const { error } = await updateArenaEnquiry(selectedEnquiry.id, {
        status,
        notes
      });
      if (error) throw error;
      
      // Auto-update local status feed & close details panel
      setSelectedEnquiry(null);
      await loadEnquiries();
    } catch (err) {
      alert("Failed to update status record.");
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
      "Team Name", 
      "Weight Class", 
      "Preferred Date", 
      "Status", 
      "Notes"
    ];
    
    const rows = enquiries.map((e) => [
      e.created_at ? new Date(e.created_at).toISOString() : "",
      e.full_name,
      e.email,
      e.phone,
      e.team_name || "",
      e.weight_class || "",
      e.preferred_date || "",
      e.status,
      (e.notes || "").replace(/"/g, '""')
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(r => r.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `arena_enquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 select-none relative">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary">
            ARENA ENQUIRIES
          </h1>
          <p className="text-ash text-sm font-light">Manage bot fighter arena bookings and event dates.</p>
        </div>

        {enquiries.length > 0 && (
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 border border-spark text-spark hover:bg-spark hover:text-forge px-5 py-3 font-display text-[15px] uppercase tracking-wider transition-colors select-none rounded-none font-semibold"
          >
            <IconFileSpreadsheet size={18} /> Export CSV
          </button>
        )}
      </div>

      {/* Primary Data List */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <IconLoader className="animate-spin text-fire" size={32} />
            <span className="text-xs uppercase tracking-widest text-ash">Syncing Enquiries...</span>
          </div>
        ) : enquiries.length === 0 ? (
          <p className="text-sm text-ash/60 italic text-center py-12">No arena enquiries logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1A1A1A] text-xs uppercase tracking-widest text-ash">
                  <th className="py-4 font-semibold">Date</th>
                  <th className="py-4 font-semibold">Name</th>
                  <th className="py-4 font-semibold">Email</th>
                  <th className="py-4 font-semibold">Phone</th>
                  <th className="py-4 font-semibold">Weight Class</th>
                  <th className="py-4 font-semibold">Target Date</th>
                  <th className="py-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {enquiries.map((e) => (
                  <tr 
                    key={e.id} 
                    onClick={() => handleRowClick(e)}
                    className="hover:bg-[#0C0C0C]/80 cursor-pointer transition-colors"
                  >
                    <td className="py-4 font-mono text-ash text-xs">
                      {e.created_at ? new Date(e.created_at).toLocaleDateString() : ""}
                    </td>
                    <td className="py-4 font-bold text-text-primary uppercase tracking-wide">
                      {e.full_name}
                    </td>
                    <td className="py-4 text-ash">{e.email}</td>
                    <td className="py-4 font-mono text-xs text-ash">{e.phone}</td>
                    <td className="py-4 text-ash font-medium">{e.weight_class}</td>
                    <td className="py-4 font-mono text-ash text-xs">{e.preferred_date}</td>
                    <td className="py-4 text-right">
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 border ${
                        e.status === 'new' 
                          ? 'border-spark/40 bg-spark/5 text-spark' 
                          : e.status === 'reviewed'
                          ? 'border-blue-500/40 bg-blue-500/5 text-blue-400'
                          : e.status === 'confirmed'
                          ? 'border-green-500/40 bg-green-500/5 text-green-400'
                          : 'border-red-500/40 bg-red-500/5 text-red-400'
                      }`}>
                        {e.status}
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
      {selectedEnquiry && (
        <>
          {/* Backdrop blur overlay */}
          <div 
            onClick={handleClosePanel}
            className="fixed inset-0 bg-[#000000]/70 backdrop-blur-sm z-40 transition-opacity"
          />

          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#111111] border-l border-[#1A1A1A] shadow-2xl p-8 z-50 overflow-y-auto space-y-8 flex flex-col justify-between select-text">
            
            {/* Upper Details Block */}
            <div className="space-y-8">
              <div className="flex justify-between items-start border-b border-[#1A1A1A] pb-4 select-none">
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-wider text-text-primary">
                    Enquiry Details
                  </h3>
                  <span className="text-[10px] font-mono text-ash/60 uppercase">
                    ID: {selectedEnquiry.id}
                  </span>
                </div>
                <button 
                  onClick={handleClosePanel}
                  className="p-1 border border-[#1A1A1A] hover:border-fire text-ash hover:text-fire transition-colors"
                >
                  <IconX size={18} />
                </button>
              </div>

              {/* Informative fields grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Fighter Name</span>
                  <span className="font-bold text-[#F5F5F5]">{selectedEnquiry.full_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Team / Institution</span>
                  <span className="font-medium text-[#F5F5F5]">{selectedEnquiry.team_name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Email Address</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-fire hover:underline break-all">{selectedEnquiry.email}</a>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Phone Contact</span>
                  <span className="font-mono text-[#F5F5F5]">{selectedEnquiry.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Weight Class</span>
                  <span className="text-spark font-bold">{selectedEnquiry.weight_class}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Target Slot Date</span>
                  <span className="font-mono text-[#F5F5F5]">{selectedEnquiry.preferred_date || "N/A"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Referral Channel</span>
                  <span className="text-ash font-medium">{selectedEnquiry.heard_from || "N/A"}</span>
                </div>
                <div className="col-span-2 border-t border-[#1A1A1A]/60 pt-4">
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Bot Specifications</span>
                  <p className="text-[#F5F5F5]/80 text-xs leading-relaxed whitespace-pre-wrap mt-1 bg-[#080808] border border-[#1A1A1A] p-3">
                    {selectedEnquiry.bot_description}
                  </p>
                </div>
              </div>
            </div>

            {/* Status & notes update form at bottom */}
            <div className="space-y-6 border-t border-[#1A1A1A] pt-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-ash tracking-widest font-semibold font-mono" htmlFor="enquiry-status-select">Enquiry Status</label>
                <select
                  id="enquiry-status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3 text-text-primary text-sm rounded-none appearance-none"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-ash tracking-widest font-semibold font-mono" htmlFor="enquiry-notes-textarea">Internal Notes</label>
                <textarea
                  id="enquiry-notes-textarea"
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
