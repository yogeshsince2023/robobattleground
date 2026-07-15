import React, { useState, useEffect } from "react";
import { getClients, upsertClient, deleteClient } from "../../lib/db.js";
import {
  IconLoader,
  IconPlus,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconAlertTriangle,
  IconX
} from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

const emptyForm = { name: "", logo_url: "", highlight_image_url: "", category: "college", website_url: "", sort_order: 0 };

export default function ClientsAdmin() {
  useDocumentMetadata("Manage Clients — TRBG", "Add and manage trusted-by client logos.");

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await getClients(true);
      if (error) throw error;
      setClients(data || []);
    } catch {
      setErrorMsg("Failed to load clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: name === "sort_order" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.logo_url.trim()) {
      setErrorMsg("Name and Logo URL are required.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await upsertClient({
        ...formData,
        name: formData.name.trim(),
        logo_url: formData.logo_url.trim(),
        highlight_image_url: formData.highlight_image_url.trim() || null,
        website_url: formData.website_url.trim() || null,
        is_visible: true
      });
      if (error) throw error;
      setSuccessMsg(`Client "${formData.name}" added.`);
      setFormData(emptyForm);
      setShowForm(false);
      await load();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch {
      setErrorMsg("Failed to save client.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVisibility = async (c) => {
    try {
      const { error } = await upsertClient({ id: c.id, is_visible: !c.is_visible });
      if (error) throw error;
      await load();
    } catch {
      alert("Failed to toggle visibility.");
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete "${c.name}" permanently?`)) return;
    try {
      const { error } = await deleteClient(c.id);
      if (error) throw error;
      await load();
    } catch {
      alert("Failed to delete client.");
    }
  };

  const inputCls = "w-full bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3 text-[#F5F5F5] font-body text-sm rounded-none";

  return (
    <div className="space-y-8 select-none">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary">CLIENTS</h1>
          <p className="text-ash text-sm font-light">Manage trusted-by logos on the homepage.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-fire hover:bg-[#cc3700] text-[#080808] font-display text-sm tracking-widest uppercase px-5 py-3 transition-colors rounded-none"
        >
          {showForm ? <IconX size={18} /> : <IconPlus size={18} />}
          {showForm ? "CANCEL" : "ADD CLIENT"}
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="border border-red-500/30 bg-red-500/5 p-4 text-red-400 flex items-center gap-3 text-sm">
          <IconAlertTriangle size={18} /> {errorMsg}
          <button onClick={() => setErrorMsg("")} className="ml-auto text-red-400 hover:text-red-300"><IconX size={16} /></button>
        </div>
      )}
      {successMsg && (
        <div className="border border-green-500/30 bg-green-500/5 p-4 text-green-400 text-sm">{successMsg}</div>
      )}

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-5 rounded-none">
          <h2 className="font-display text-xl uppercase tracking-wider border-b border-[#1A1A1A] pb-3">New Client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="e.g. MNIT Jaipur" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Logo URL *</label>
              <input name="logo_url" value={formData.logo_url} onChange={handleChange} className={inputCls} placeholder="Paste Cloudinary URL" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
                <option value="college">College</option>
                <option value="team">Team</option>
                <option value="company">Company</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Website URL</label>
              <input name="website_url" value={formData.website_url} onChange={handleChange} className={inputCls} placeholder="Optional" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Highlight Image URL</label>
              <input name="highlight_image_url" value={formData.highlight_image_url} onChange={handleChange} className={inputCls} placeholder="Paste Cloudinary JPG URL for highlight" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Sort Order</label>
              <input name="sort_order" type="number" value={formData.sort_order} onChange={handleChange} className={inputCls} />
            </div>
          </div>

          {/* Logo & Highlight Previews */}
          <div className="flex flex-wrap gap-4">
            {formData.logo_url && (
              <div className="flex flex-col gap-1 p-4 bg-[#080808] border border-[#1A1A1A] flex-1 min-w-[200px]">
                <span className="text-[10px] uppercase tracking-widest text-ash/70 block mb-2">Logo Preview</span>
                <img src={formData.logo_url} alt="logo preview" width={100} height={40} className="h-10 w-auto object-contain self-start" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
            {formData.highlight_image_url && (
              <div className="flex flex-col gap-1 p-4 bg-[#080808] border border-[#1A1A1A] flex-1 min-w-[200px]">
                <span className="text-[10px] uppercase tracking-widest text-ash/70 block mb-2">Highlight Image Preview</span>
                <img src={formData.highlight_image_url} alt="highlight preview" width={200} height={80} className="h-20 w-auto object-contain self-start" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          <button type="submit" disabled={submitting} className="bg-fire hover:bg-[#cc3700] text-[#080808] font-display text-sm tracking-widest uppercase px-8 py-3 transition-colors disabled:opacity-50 rounded-none">
            {submitting ? "SAVING..." : "SAVE CLIENT"}
          </button>
        </form>
      )}

      {/* Clients List */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-4 rounded-none">
        <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-4">
          <h2 className="font-display text-2xl uppercase tracking-wider">All Clients</h2>
          <span className="text-xs text-ash/60 font-mono">{clients.length} entries</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <IconLoader className="animate-spin text-fire" size={32} />
            <span className="text-xs uppercase tracking-widest text-ash">Loading...</span>
          </div>
        ) : clients.length === 0 ? (
          <p className="text-sm text-ash/60 italic text-center py-12">No clients added yet.</p>
        ) : (
          <div className="space-y-3">
            {clients.map((c) => (
              <div key={c.id} className={`p-4 bg-[#080808] border border-[#1A1A1A] flex items-center justify-between gap-4 ${!c.is_visible ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-4">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.name} width={120} height={40} className="h-10 w-auto max-w-[120px] object-contain" />
                  ) : (
                    <div className="h-10 w-20 bg-[#1A1A1A] flex items-center justify-center text-[10px] text-ash/40 uppercase">No Logo</div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm text-text-primary">{c.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-ash/50 font-mono">
                      <span>{c.category}</span>
                      <span>•</span>
                      <span>Order: {c.sort_order}</span>
                      {c.highlight_image_url && (
                        <>
                          <span>•</span>
                          <span className="text-spark font-semibold">HAS PHOTO</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleVisibility(c)}
                    className={`p-2 border transition-colors ${c.is_visible ? "border-green-500/30 text-green-400 hover:border-green-500" : "border-[#1A1A1A] text-ash hover:border-fire hover:text-fire"}`}
                    title={c.is_visible ? "Hide" : "Show"}
                  >
                    {c.is_visible ? <IconEye size={14} /> : <IconEyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="p-2 border border-[#1A1A1A] hover:border-red-500 text-ash hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
