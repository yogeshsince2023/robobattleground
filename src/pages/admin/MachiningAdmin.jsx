import React, { useState, useEffect } from "react";
import { getMachiningEnquiries, updateMachiningEnquiry } from "../../lib/db.js";
import {
  IconLoader,
  IconX,
  IconAlertTriangle,
  IconFileSpreadsheet
} from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

const STATUS_OPTIONS = ["new", "quoted", "in-progress", "completed", "rejected"];

const statusStyle = (s) => {
  switch (s) {
    case "new": return "border-spark/40 bg-spark/5 text-spark";
    case "quoted": return "border-blue-500/40 bg-blue-500/5 text-blue-400";
    case "in-progress": return "border-purple-500/40 bg-purple-500/5 text-purple-400";
    case "completed": return "border-green-500/40 bg-green-500/5 text-green-400";
    case "rejected": return "border-red-500/40 bg-red-500/5 text-red-400";
    default: return "border-ash/40 bg-ash/5 text-ash";
  }
};

const urgencyStyle = (u) => {
  if (u === "Urgent") return "text-red-400";
  if (u === "Within 3 Days") return "text-spark";
  return "text-ash";
};

export default function MachiningAdmin() {
  useDocumentMetadata("Machining Enquiries — TRBG", "Manage machining and fabrication enquiries.");

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("new");
  const [saveLoading, setSaveLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await getMachiningEnquiries();
      if (error) throw error;
      setEnquiries(data || []);
    } catch {
      setErrorMsg("Failed to sync machining enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRowClick = (enq) => {
    setSelected(enq);
    setNotes(enq.notes || "");
    setStatus(enq.status || "new");
  };

  const handleClose = () => setSelected(null);

  const handleSave = async () => {
    if (!selected) return;
    setSaveLoading(true);
    try {
      const { error } = await updateMachiningEnquiry(selected.id, { status, notes });
      if (error) throw error;
      setSelected(null);
      await load();
    } catch {
      alert("Failed to update record.");
    } finally {
      setSaveLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Created At", "Name", "Email", "Phone", "Team", "Services", "Material", "Weight Class", "Description", "Urgency", "Status", "Notes"];
    const rows = enquiries.map((e) => [
      e.created_at ? new Date(e.created_at).toISOString() : "",
      e.full_name, e.email, e.phone, e.team_name || "",
      (e.services || []).join("; "), e.material || "", e.weight_class || "",
      (e.description || "").replace(/"/g, '""'), e.urgency || "", e.status,
      (e.notes || "").replace(/"/g, '""')
    ]);
    const csv = "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `machining_enquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 select-none relative">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary">MACHINING ENQUIRIES</h1>
          <p className="text-ash text-sm font-light">Manage fabrication service requests and quotes.</p>
        </div>
        {enquiries.length > 0 && (
          <button onClick={exportCSV} className="flex items-center gap-2 border border-spark text-spark hover:bg-spark hover:text-forge px-5 py-3 font-display text-[15px] uppercase tracking-wider transition-colors select-none rounded-none font-semibold">
            <IconFileSpreadsheet size={18} /> Export CSV
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <IconLoader className="animate-spin text-fire" size={32} />
            <span className="text-xs uppercase tracking-widest text-ash">Syncing Enquiries...</span>
          </div>
        ) : errorMsg ? (
          <div className="border border-red-500/30 bg-red-500/5 p-6 text-red-500 flex items-start gap-3 max-w-xl mx-auto rounded-none">
            <IconAlertTriangle size={24} className="shrink-0 mt-0.5" />
            <p className="text-sm">{errorMsg}</p>
          </div>
        ) : enquiries.length === 0 ? (
          <p className="text-sm text-ash/60 italic text-center py-12">No machining enquiries logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1A1A1A] text-xs uppercase tracking-widest text-ash">
                  <th className="py-4 font-semibold">Date</th>
                  <th className="py-4 font-semibold">Name</th>
                  <th className="py-4 font-semibold">Email</th>
                  <th className="py-4 font-semibold">Services</th>
                  <th className="py-4 font-semibold">Urgency</th>
                  <th className="py-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {enquiries.map((e) => (
                  <tr key={e.id} onClick={() => handleRowClick(e)} className="hover:bg-[#0C0C0C]/80 cursor-pointer transition-colors">
                    <td className="py-4 font-mono text-ash text-xs">{e.created_at ? new Date(e.created_at).toLocaleDateString() : ""}</td>
                    <td className="py-4 font-bold text-text-primary uppercase tracking-wide">{e.full_name}</td>
                    <td className="py-4 text-ash">{e.email}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {(e.services || []).map((s) => (
                          <span key={s} className="bg-fire/10 text-fire border border-fire/20 px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className={`py-4 text-xs font-semibold uppercase ${urgencyStyle(e.urgency)}`}>{e.urgency || "—"}</td>
                    <td className="py-4 text-right">
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 border ${statusStyle(e.status)}`}>{e.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Slide-Out Panel */}
      {selected && (
        <>
          <div onClick={handleClose} className="fixed inset-0 bg-[#000000]/70 backdrop-blur-sm z-40 transition-opacity" />
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#111111] border-l border-[#1A1A1A] shadow-2xl p-8 z-50 overflow-y-auto space-y-8 flex flex-col justify-between select-text">

            {/* Details */}
            <div className="space-y-8">
              <div className="flex justify-between items-start border-b border-[#1A1A1A] pb-4 select-none">
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-wider text-text-primary">Machining Details</h3>
                  <span className="text-[10px] font-mono text-ash/60 uppercase">ID: {selected.id}</span>
                </div>
                <button onClick={handleClose} className="p-1 border border-[#1A1A1A] hover:border-fire text-ash hover:text-fire transition-colors">
                  <IconX size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Name</span>
                  <span className="font-bold text-[#F5F5F5]">{selected.full_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Team</span>
                  <span className="font-medium text-[#F5F5F5]">{selected.team_name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Email</span>
                  <a href={`mailto:${selected.email}`} className="text-fire hover:underline break-all">{selected.email}</a>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Phone</span>
                  <span className="font-mono text-[#F5F5F5]">{selected.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Material</span>
                  <span className="text-[#F5F5F5]">{selected.material || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Weight Class</span>
                  <span className="text-spark font-bold">{selected.weight_class || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Urgency</span>
                  <span className={`font-bold ${urgencyStyle(selected.urgency)}`}>{selected.urgency || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Submitted</span>
                  <span className="font-mono text-[#F5F5F5] text-xs">{selected.created_at ? new Date(selected.created_at).toLocaleString() : "—"}</span>
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Services</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(selected.services || []).map((s) => (
                      <span key={s} className="bg-fire/10 text-fire border border-fire/20 px-2 py-0.5 text-[11px] uppercase font-semibold">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 border-t border-[#1A1A1A]/60 pt-4">
                  <span className="text-[10px] text-ash/60 uppercase block font-mono select-none">Project Description</span>
                  <p className="text-[#F5F5F5]/80 text-xs leading-relaxed whitespace-pre-wrap mt-1 bg-[#080808] border border-[#1A1A1A] p-3">
                    {selected.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Status & Notes */}
            <div className="space-y-6 border-t border-[#1A1A1A] pt-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-ash tracking-widest font-semibold font-mono" htmlFor="mach-status">Enquiry Status</label>
                <select id="mach-status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3 text-text-primary text-sm rounded-none appearance-none">
                  {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-ash tracking-widest font-semibold font-mono" htmlFor="mach-notes">Internal Notes</label>
                <textarea id="mach-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter notes..." rows={4} className="w-full bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3 text-text-primary text-sm rounded-none resize-none" />
              </div>
              <button onClick={handleSave} disabled={saveLoading} className="w-full py-4 bg-fire hover:bg-[#cc3700] disabled:bg-[#1A1A1A] disabled:text-ash/40 text-forge font-display text-lg uppercase tracking-wider transition-colors rounded-none flex items-center justify-center gap-2 select-none font-semibold">
                {saveLoading ? (<>Saving... <IconLoader className="animate-spin text-forge" size={16} /></>) : "SAVE CHANGES"}
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
