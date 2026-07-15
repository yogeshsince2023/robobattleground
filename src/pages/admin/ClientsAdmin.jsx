import React, { useState, useEffect, useRef } from "react";
import { getClients, upsertClient, deleteClient, updateClientOrder } from "../../lib/db.js";
import { buildLogoUrl } from "../../lib/cloudinary.js";
import {
  IconLoader,
  IconPlus,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconAlertTriangle,
  IconX,
  IconArrowUp,
  IconArrowDown,
  IconEdit,
  IconCheck,
  IconChevronDown,
  IconChevronUp
} from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

const emptyForm = { name: "", logo_url: "", category: "Client", website_url: "", sort_order: 0, is_visible: true };

export default function ClientsAdmin() {
  useDocumentMetadata("Manage Clients — TRBG", "Add and manage trusted-by client logos.");

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [howToExpanded, setHowToExpanded] = useState(false);

  // Live preview with debounce state
  const [previewId, setPreviewId] = useState("");
  const debounceTimer = useRef(null);

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

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => {
      const updated = { ...p, [name]: name === "sort_order" ? Number(value) : value };
      
      // If changing logo_url (which stores Public ID), debounce the preview update
      if (name === "logo_url") {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
          setPreviewId(value.trim());
        }, 800);
      }
      
      return updated;
    });
  };

  const handleEditClick = (c) => {
    setFormData(c);
    setPreviewId(c.logo_url);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setPreviewId("");
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.logo_url.trim()) {
      setErrorMsg("Company Name and Cloudinary Public ID are required.");
      return;
    }
    setSubmitting(false);
    try {
      const clientPayload = {
        ...formData,
        name: formData.name.trim(),
        logo_url: formData.logo_url.trim(),
        website_url: formData.website_url.trim() || null
      };

      const { error } = await upsertClient(clientPayload);
      if (error) throw error;

      triggerToast(isEditing ? "Client updated" : "Client saved");
      handleCancel();
      await load();
    } catch {
      setErrorMsg("Failed to save client.");
    }
  };

  const toggleVisibility = async (c) => {
    try {
      const { error } = await upsertClient({ id: c.id, is_visible: !c.is_visible });
      if (error) throw error;
      triggerToast("Visibility updated");
      await load();
    } catch {
      triggerToast("Failed to toggle visibility");
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Remove "${c.name}" from the clients section? The Cloudinary image is NOT deleted — only removed from the website.`)) return;
    try {
      const { error } = await deleteClient(c.id);
      if (error) throw error;
      triggerToast("Client removed");
      await load();
    } catch {
      setErrorMsg("Failed to delete client.");
    }
  };

  const moveUp = async (index) => {
    if (index === 0) return; // already top
    const list = [...clients];
    const current = list[index];
    const above = list[index - 1];

    // Swap sort orders
    const currentOrder = current.sort_order;
    current.sort_order = above.sort_order;
    above.sort_order = currentOrder;

    // If order was same, make them distinct
    if (current.sort_order === above.sort_order) {
      above.sort_order = index - 1;
      current.sort_order = index;
    }

    try {
      await updateClientOrder([
        { id: current.id, sort_order: current.sort_order },
        { id: above.id, sort_order: above.sort_order }
      ]);
      triggerToast("Order updated");
      await load();
    } catch {
      triggerToast("Failed to update order");
    }
  };

  const moveDown = async (index) => {
    if (index === clients.length - 1) return; // already bottom
    const list = [...clients];
    const current = list[index];
    const below = list[index + 1];

    // Swap sort orders
    const currentOrder = current.sort_order;
    current.sort_order = below.sort_order;
    below.sort_order = currentOrder;

    // If order was same, make them distinct
    if (current.sort_order === below.sort_order) {
      current.sort_order = index;
      below.sort_order = index + 1;
    }

    try {
      await updateClientOrder([
        { id: current.id, sort_order: current.sort_order },
        { id: below.id, sort_order: below.sort_order }
      ]);
      triggerToast("Order updated");
      await load();
    } catch {
      triggerToast("Failed to update order");
    }
  };

  const inputCls = "w-full bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3 text-[#F5F5F5] font-body text-sm rounded-none";

  return (
    <div className="space-y-8 select-none relative pb-16">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div 
          className="fixed bottom-6 right-6 z-50 bg-[#111111] border-l-4 border-l-fire border border-[#1A1A1A] p-4 text-text-primary font-body text-[14px] flex items-center gap-3 shadow-2xl animate-toast-slide"
          role="status"
        >
          <IconCheck className="text-fire" size={18} />
          <span>{toastMsg}</span>
          <style>{`
            @keyframes trbg-toast-slide {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .animate-toast-slide {
              animation: trbg-toast-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1A1A1A] pb-6">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary">
            CLIENTS & PARTNERS
          </h1>
          <p className="text-ash text-sm font-light mt-1">
            Logos appear on the home page. Upload to Cloudinary first, then paste the public ID here.
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) handleCancel();
            else setShowForm(true);
          }}
          className="flex items-center gap-2 bg-fire hover:bg-[#cc3700] text-[#080808] font-display text-sm tracking-widest uppercase px-5 py-3 transition-colors rounded-none"
        >
          {showForm ? <IconX size={18} /> : <IconPlus size={18} />}
          {showForm ? "CANCEL" : "ADD CLIENT"}
        </button>
      </div>

      {/* Error Msg */}
      {errorMsg && (
        <div className="border border-red-500/30 bg-red-500/5 p-4 text-red-400 flex items-center gap-3 text-sm">
          <IconAlertTriangle size={18} /> {errorMsg}
          <button onClick={() => setErrorMsg("")} className="ml-auto text-red-400 hover:text-red-300">
            <IconX size={16} />
          </button>
        </div>
      )}

      {/* Collapsible Guide */}
      <div className="bg-[rgba(255,183,0,0.03)] border border-[rgba(255,183,0,0.15)] rounded-none">
        <button
          onClick={() => setHowToExpanded(!howToExpanded)}
          className="w-full flex items-center justify-between p-4 font-display text-[15px] uppercase tracking-wider text-spark hover:text-spark/80 transition-colors"
        >
          <span>How to upload a new logo</span>
          {howToExpanded ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
        </button>
        {howToExpanded && (
          <div className="px-6 pb-6 pt-2 font-body text-[13px] text-[#9A9A9A] leading-relaxed border-t border-[rgba(255,183,0,0.1)] space-y-3">
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-spark">cloudinary.com</a> and log in.</li>
              <li>Click <strong>"Media Library"</strong> from the navigation sidebar.</li>
              <li>Click the folder icon, then open or create a folder named <code>trbg/logos</code>.</li>
              <li>Click <strong>"Upload"</strong> and select your logo file (a PNG with a transparent background works best).</li>
              <li>After upload finishes, hover over or click the image.</li>
              <li>Find the <strong>"Public ID"</strong> on the info panel (e.g. <code>trbg/logos/company-name</code>).</li>
              <li>Copy that Public ID value.</li>
              <li>Come back here, click <strong>"Add Client"</strong>.</li>
              <li>Paste the Public ID into the designated field.</li>
              <li>Set the company name and optional website link, then click Save.</li>
            </ol>
          </div>
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none animate-toast-slide">
          <h2 className="font-display text-xl uppercase tracking-wider border-b border-[#1A1A1A] pb-3 text-text-primary">
            {isEditing ? "Edit Client" : "New Client Entry"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Company Name *</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className={inputCls} 
                placeholder="e.g. BITS Pilani" 
                required 
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Cloudinary Public ID *</label>
              <input 
                name="logo_url" 
                value={formData.logo_url} 
                onChange={handleChange} 
                className={inputCls} 
                placeholder="e.g. trbg/logos/bits-pilani" 
                required 
              />
              <p className="text-[#7A7A7A] text-[11.5px] mt-1.5 leading-relaxed">
                Go to Cloudinary → Media Library → click logo → copy the 'Public ID' (e.g. trbg/logos/company-name)
              </p>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
                <option value="Client">Client</option>
                <option value="Partner">Partner</option>
                <option value="Sponsor">Sponsor</option>
                <option value="Collaborator">Collaborator</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Website URL</label>
              <input 
                name="website_url" 
                value={formData.website_url || ""} 
                onChange={handleChange} 
                className={inputCls} 
                placeholder="https://www.clientwebsite.com" 
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Sort Order</label>
              <input 
                name="sort_order" 
                type="number" 
                value={formData.sort_order} 
                onChange={handleChange} 
                className={inputCls} 
              />
              <p className="text-[#7A7A7A] text-[11px] mt-1">
                Lower number = appears first (0, 1, 2...)
              </p>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={formData.is_visible} 
                  onChange={(e) => setFormData(p => ({ ...p, is_visible: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#1A1A1A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#888] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-fire peer-checked:after:bg-forge" />
                <span className="ml-3 text-[13px] uppercase tracking-wider font-body text-text-primary">Show on website</span>
              </label>
            </div>
          </div>

          {/* Logo Live Preview */}
          <div>
            <span className="text-[10px] uppercase tracking-widest text-ash/70 block mb-2">Live Logo Preview</span>
            {previewId ? (
              <div className="p-6 bg-[#080808] border border-[#1A1A1A] inline-flex items-center justify-center min-w-[200px] min-h-[100px]">
                <img 
                  src={buildLogoUrl(previewId)} 
                  alt="Live Preview" 
                  width={240}
                  height={120}
                  className="h-16 w-auto object-contain" 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              </div>
            ) : (
              <div className="h-[100px] w-[200px] bg-[#080808] border border-[#1A1A1A] border-dashed flex items-center justify-center text-xs text-[#7A7A7A] uppercase font-mono">
                No Preview ID Entered
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-[#1A1A1A]">
            <button 
              type="submit" 
              disabled={submitting} 
              className="bg-fire hover:bg-[#cc3700] text-[#080808] font-display text-sm tracking-widest uppercase px-8 py-3.5 transition-colors disabled:opacity-50 rounded-none font-bold"
            >
              {submitting ? "SAVING..." : "SAVE CLIENT"}
            </button>
            <button 
              type="button" 
              onClick={handleCancel}
              className="text-ash hover:text-text-primary font-display text-sm tracking-widest uppercase transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Clients Grid */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
        <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-4">
          <h2 className="font-display text-2xl uppercase tracking-wider text-text-primary">All Entries</h2>
          <span className="text-xs text-ash/60 font-mono">{clients.length} listed</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <IconLoader className="animate-spin text-fire" size={32} />
            <span className="text-xs uppercase tracking-widest text-ash">Loading list...</span>
          </div>
        ) : clients.length === 0 ? (
          <p className="text-sm text-ash/60 italic text-center py-12">No entries added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((c, index) => (
              <div 
                key={c.id} 
                className={`p-5 bg-[#080808] border border-[#1A1A1A] hover:border-fire/20 transition-all flex flex-col justify-between gap-5 relative group ${!c.is_visible ? "opacity-50" : ""}`}
              >
                {/* Visual Preview */}
                <div className="h-28 bg-[#111111] border border-[#1A1A1A] flex items-center justify-center p-4">
                  {c.logo_url ? (
                    <img 
                      src={buildLogoUrl(c.logo_url)} 
                      alt={c.name} 
                      width={120} 
                      height={40} 
                      className="max-h-20 w-auto object-contain" 
                    />
                  ) : (
                    <span className="text-[10px] text-ash/30 uppercase font-mono">No Logo</span>
                  )}
                </div>

                {/* Info block */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-display text-lg uppercase tracking-wider text-text-primary truncate">{c.name}</h3>
                    <span className="text-[9px] font-mono tracking-widest bg-[#1A1A1A] border border-[#2A2A2A] text-spark px-2 py-0.5 uppercase">
                      {c.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] font-mono text-ash/60">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${c.is_visible ? "bg-green-500" : "bg-red-500"}`} />
                      <span>{c.is_visible ? "LIVE" : "HIDDEN"}</span>
                    </div>
                    <span>Order: {c.sort_order}</span>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="flex items-center justify-between border-t border-[#1A1A1A]/70 pt-4 mt-1">
                  
                  {/* Reorder Arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 border border-[#1A1A1A] hover:border-fire text-ash hover:text-fire disabled:opacity-20 disabled:hover:border-[#1A1A1A] disabled:hover:text-ash transition-colors"
                      title="Move Up"
                    >
                      <IconArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === clients.length - 1}
                      className="p-1.5 border border-[#1A1A1A] hover:border-fire text-ash hover:text-fire disabled:opacity-20 disabled:hover:border-[#1A1A1A] disabled:hover:text-ash transition-colors"
                      title="Move Down"
                    >
                      <IconArrowDown size={14} />
                    </button>
                  </div>

                  {/* Settings Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVisibility(c)}
                      className={`p-1.5 border transition-colors ${c.is_visible ? "border-green-500/30 text-green-400 hover:border-green-500" : "border-[#1A1A1A] text-ash hover:border-fire hover:text-fire"}`}
                      title={c.is_visible ? "Hide from website" : "Show on website"}
                    >
                      {c.is_visible ? <IconEye size={14} /> : <IconEyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => handleEditClick(c)}
                      className="p-1.5 border border-[#1A1A1A] hover:border-fire text-ash hover:text-fire transition-colors"
                      title="Edit Entry"
                    >
                      <IconEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="p-1.5 border border-[#1A1A1A] hover:border-red-500 text-ash hover:text-red-500 transition-colors"
                      title="Delete Entry"
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
