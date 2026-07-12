import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase.js";
import { getAllProjects, upsertProject, deleteProject, toggleProjectStatus } from "../../lib/db.js";
import {
  IconLoader, IconPlus, IconEdit, IconTrash, IconEye,
  IconX, IconCloudUpload, IconAlertTriangle, IconCheck
} from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

const CATEGORIES = ["Combat Bots", "Autonomous", "PCB & Electronics", "Chassis & Fabrication", "Software & Control", "Other"];
const WEIGHT_OPTIONS = ["Under 1kg", "1kg", "3kg", "10kg", "30kg", "60kg", "Other"];

const emptyProject = {
  title: "", slug: "", category: "", team_name: "", college: "",
  weight_class: "", competition: "", result: "", description: "",
  full_content: "", tags: [], cover_image_url: "", gallery_urls: [],
  is_published: false, is_featured: false, sort_order: 0
};

const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function ProjectsAdmin() {
  useDocumentMetadata("Manage Projects — TRBG", "Project showcase management.");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = new, object = editing
  const [form, setForm] = useState({ ...emptyProject });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    const { data } = await getAllProjects();
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  /* ── editor open/close ── */
  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyProject, sort_order: projects.length });
    setTagInput("");
    setEditorOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({ ...project });
    setTagInput("");
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditing(null);
  };

  /* ── form handlers ── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" && !editing ? { slug: slugify(value) } : {})
    }));
  };

  const addTag = (val) => {
    const tag = val.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((p) => ({ ...p, tags: [...p.tags, tag] }));
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const removeTag = (tag) => setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));

  /* ── image uploads ── */
  const uploadImage = async (file, path) => {
    const { error } = await supabase.storage.from("projects").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from("projects").getPublicUrl(path);
    return publicUrl;
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const path = `covers/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const url = await uploadImage(file, path);
      setForm((p) => ({ ...p, cover_image_url: url }));
    } catch { alert("Cover upload failed."); }
    finally { setCoverUploading(false); }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setGalleryUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const path = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        urls.push(await uploadImage(file, path));
      }
      setForm((p) => ({ ...p, gallery_urls: [...p.gallery_urls, ...urls] }));
    } catch { alert("Gallery upload failed."); }
    finally { setGalleryUploading(false); }
  };

  const removeGalleryImage = (idx) => setForm((p) => ({ ...p, gallery_urls: p.gallery_urls.filter((_, i) => i !== idx) }));

  /* ── save ── */
  const handleSave = async (publish) => {
    if (!form.title.trim() || !form.category || !form.description.trim()) {
      alert("Title, category, and description are required.");
      return;
    }
    // Featured limit
    if (form.is_featured) {
      const featuredCount = projects.filter((p) => p.is_featured && p.id !== editing?.id).length;
      if (featuredCount >= 3) { alert("Max 3 featured projects. Unfeature another first."); return; }
    }

    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      is_published: publish !== undefined ? publish : form.is_published,
      updated_at: new Date().toISOString()
    };
    if (editing?.id) payload.id = editing.id;

    const { error } = await upsertProject(payload);
    if (error) { alert("Save failed: " + error.message); }
    else { closeEditor(); await load(); }
    setSaving(false);
  };

  /* ── delete ── */
  const handleDelete = async (project) => {
    if (!confirm(`Delete "${project.title}"? This permanently removes the project.`)) return;
    // ponytail: skip storage cleanup for now — images are cheap, deletion is risky
    // upgrade path: iterate cover_image_url + gallery_urls, parse storage paths, call supabase.storage.from('projects').remove(paths)
    await deleteProject(project.id);
    await load();
  };

  /* ── inline toggles ── */
  const handleToggle = async (id, field, value) => {
    if (field === "is_featured" && value) {
      const featuredCount = projects.filter((p) => p.is_featured && p.id !== id).length;
      if (featuredCount >= 3) { alert("Max 3 featured. Unfeature another first."); return; }
    }
    // Optimistic update
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
    const { error } = await toggleProjectStatus(id, field, value);
    if (error) { alert("Toggle failed."); await load(); }
  };

  /* ── helpers ── */
  const inputCls = "w-full bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-3 text-text-primary text-sm rounded-none";

  return (
    <div className="space-y-8 select-none relative">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary">PROJECTS</h1>
          <span className="bg-fire/10 text-fire border border-fire/20 px-2 py-0.5 text-[11px] font-semibold uppercase">{projects.length}</span>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-fire hover:bg-[#cc3700] text-forge px-5 py-3 font-display text-[15px] uppercase tracking-wider transition-colors rounded-none font-semibold">
          <IconPlus size={18} /> ADD NEW PROJECT
        </button>
      </div>

      {/* Project List */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 rounded-none">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <IconLoader className="animate-spin text-fire" size={32} />
            <span className="text-xs uppercase tracking-widest text-ash">Loading Projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <p className="text-sm text-ash/60 italic text-center py-12">No projects yet. Click "Add New Project" to get started.</p>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 bg-[#080808] border border-[#1A1A1A] hover:border-fire/30 transition-colors group">
                {/* Thumbnail */}
                <div className="w-12 h-12 bg-[#1A1A1A] shrink-0 overflow-hidden">
                  {p.cover_image_url ? (
                    <img src={p.cover_image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#333]">
                      <IconEye size={16} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-sm text-text-primary uppercase tracking-wide truncate group-hover:text-fire transition-colors">{p.title}</h3>
                  <p className="text-[11px] text-ash/60 truncate">{p.category}{p.team_name ? ` · ${p.team_name}` : ""}</p>
                </div>

                {/* Status badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${p.is_published ? "border-green-500/40 bg-green-500/5 text-green-400" : "border-spark/40 bg-spark/5 text-spark"}`}>
                    {p.is_published ? "PUBLISHED" : "DRAFT"}
                  </span>
                  {p.is_featured && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 border border-spark/40 bg-spark/5 text-spark">★</span>
                  )}
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-1 cursor-pointer" title="Published">
                    <input type="checkbox" checked={p.is_published} onChange={(e) => handleToggle(p.id, "is_published", e.target.checked)} className="sr-only peer" />
                    <div className="w-8 h-4 bg-[#1A1A1A] peer-checked:bg-green-600 rounded-full relative transition-colors">
                      <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-[#F5F5F5] rounded-full transition-transform ${p.is_published ? "translate-x-4" : ""}`} />
                    </div>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer" title="Featured">
                    <input type="checkbox" checked={p.is_featured} onChange={(e) => handleToggle(p.id, "is_featured", e.target.checked)} className="sr-only peer" />
                    <div className="w-8 h-4 bg-[#1A1A1A] peer-checked:bg-spark rounded-full relative transition-colors">
                      <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-[#F5F5F5] rounded-full transition-transform ${p.is_featured ? "translate-x-4" : ""}`} />
                    </div>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(p)} className="p-2 text-ash hover:text-fire transition-colors" title="Edit">
                    <IconEdit size={16} />
                  </button>
                  <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-ash hover:text-fire transition-colors" title="Preview">
                    <IconEye size={16} />
                  </a>
                  <button onClick={() => handleDelete(p)} className="p-2 text-ash hover:text-red-500 transition-colors" title="Delete">
                    <IconTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ EDITOR SLIDE-OUT PANEL ═══ */}
      {editorOpen && (
        <>
          <div onClick={closeEditor} className="fixed inset-0 bg-[#000000]/70 backdrop-blur-sm z-40" />
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[560px] bg-[#111111] border-l border-[#1A1A1A] shadow-2xl z-50 overflow-y-auto flex flex-col">

            {/* Editor Header */}
            <div className="sticky top-0 bg-[#111111] border-b border-[#1A1A1A] p-6 flex justify-between items-center z-10 select-none">
              <h3 className="font-display text-2xl uppercase tracking-wider text-text-primary">
                {editing ? "EDIT PROJECT" : "NEW PROJECT"}
              </h3>
              <button onClick={closeEditor} className="p-1 border border-[#1A1A1A] hover:border-fire text-ash hover:text-fire transition-colors">
                <IconX size={18} />
              </button>
            </div>

            <div className="flex-grow p-6 space-y-8 select-text">

              {/* SECTION 1 — Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase text-ash tracking-widest font-semibold border-b border-[#1A1A1A] pb-2">Basic Info</h4>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Project Title *" className={inputCls} />
                <div>
                  <input name="slug" value={form.slug} onChange={handleChange} placeholder="slug-auto-generated" className={inputCls} />
                  <p className="text-[10px] text-ash/50 mt-1 font-mono">/projects/{form.slug || "..."}</p>
                </div>
                <select name="category" value={form.category} onChange={handleChange} className={inputCls + " appearance-none"}>
                  <option value="">Select Category *</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input name="team_name" value={form.team_name} onChange={handleChange} placeholder="Team Name" className={inputCls} />
                  <input name="college" value={form.college} onChange={handleChange} placeholder="College / Institution" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select name="weight_class" value={form.weight_class} onChange={handleChange} className={inputCls + " appearance-none"}>
                    <option value="">Weight Class</option>
                    {WEIGHT_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                  <input name="competition" value={form.competition} onChange={handleChange} placeholder="Competition Name" className={inputCls} />
                </div>
                <input name="result" value={form.result} onChange={handleChange} placeholder='Result (e.g. "1st Place", "Top 8")' className={inputCls} />
              </div>

              {/* SECTION 2 — Content */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase text-ash tracking-widest font-semibold border-b border-[#1A1A1A] pb-2">Content</h4>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Short Description (shown on card) *" className={inputCls + " resize-none"} />
                <textarea name="full_content" value={form.full_content} onChange={handleChange} rows={8} placeholder="Full Content (shown on detail page)" className={inputCls + " resize-none"} />
                <div>
                  <label className="text-[10px] uppercase text-ash tracking-widest block mb-1">Tags</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.tags.map((tag) => (
                      <span key={tag} className="bg-fire/10 text-fire border border-fire/20 px-2 py-0.5 text-[11px] uppercase font-semibold flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-[#F5F5F5] transition-colors">×</button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
                    onBlur={() => tagInput.trim() && addTag(tagInput)}
                    placeholder="Type tag + Enter"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* SECTION 3 — Media */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase text-ash tracking-widest font-semibold border-b border-[#1A1A1A] pb-2">Media</h4>

                {/* Cover image */}
                <div>
                  <label className="text-[10px] uppercase text-ash tracking-widest block mb-2">Cover Image</label>
                  {form.cover_image_url ? (
                    <div className="relative mb-2 border border-[#1A1A1A] overflow-hidden">
                      <img src={form.cover_image_url} alt="Cover" className="w-full h-40 object-cover" />
                      <button onClick={() => setForm((p) => ({ ...p, cover_image_url: "" }))} className="absolute top-2 right-2 bg-[#080808]/80 p-1 text-ash hover:text-red-500 transition-colors">
                        <IconX size={14} />
                      </button>
                    </div>
                  ) : null}
                  <button onClick={() => coverInputRef.current?.click()} disabled={coverUploading} className="flex items-center gap-2 border border-[#1A1A1A] hover:border-fire text-ash hover:text-fire px-4 py-2 text-sm transition-colors w-full justify-center">
                    {coverUploading ? <><IconLoader size={14} className="animate-spin" /> Uploading...</> : <><IconCloudUpload size={14} /> Upload Cover</>}
                  </button>
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </div>

                {/* Gallery */}
                <div>
                  <label className="text-[10px] uppercase text-ash tracking-widest block mb-2">Gallery Images</label>
                  {form.gallery_urls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {form.gallery_urls.map((url, i) => (
                        <div key={i} className="relative border border-[#1A1A1A] overflow-hidden aspect-square">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-[#080808]/80 p-0.5 text-ash hover:text-red-500 transition-colors">
                            <IconX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => galleryInputRef.current?.click()} disabled={galleryUploading} className="flex items-center gap-2 border border-[#1A1A1A] hover:border-fire text-ash hover:text-fire px-4 py-2 text-sm transition-colors w-full justify-center">
                    {galleryUploading ? <><IconLoader size={14} className="animate-spin" /> Uploading...</> : <><IconCloudUpload size={14} /> Add Gallery Photos</>}
                  </button>
                  <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                </div>
              </div>

              {/* SECTION 4 — Settings */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase text-ash tracking-widest font-semibold border-b border-[#1A1A1A] pb-2">Settings</h4>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-text-primary">Published</span>
                  <div className="relative">
                    <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} className="sr-only peer" />
                    <div className="w-10 h-5 bg-[#1A1A1A] peer-checked:bg-green-600 rounded-full transition-colors" />
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-[#F5F5F5] rounded-full transition-transform ${form.is_published ? "translate-x-5" : ""}`} />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-text-primary">Featured</span>
                  <div className="relative">
                    <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="sr-only peer" />
                    <div className="w-10 h-5 bg-[#1A1A1A] peer-checked:bg-spark rounded-full transition-colors" />
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-[#F5F5F5] rounded-full transition-transform ${form.is_featured ? "translate-x-5" : ""}`} />
                  </div>
                </label>
                <div>
                  <label className="text-[10px] uppercase text-ash tracking-widest block mb-1">Sort Order</label>
                  <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} className={inputCls + " w-24"} />
                </div>
              </div>
            </div>

            {/* Sticky bottom bar */}
            <div className="sticky bottom-0 bg-[#111111] border-t border-[#1A1A1A] p-4 flex gap-3 select-none">
              <button onClick={() => handleSave(false)} disabled={saving} className="flex-1 py-3 border border-[#1A1A1A] hover:border-fire text-text-primary font-display text-[14px] uppercase tracking-wider transition-colors rounded-none">
                {saving ? "SAVING..." : "SAVE AS DRAFT"}
              </button>
              <button onClick={() => handleSave(true)} disabled={saving} className="flex-1 py-3 bg-fire hover:bg-[#cc3700] text-forge font-display text-[14px] uppercase tracking-wider transition-colors rounded-none flex items-center justify-center gap-2">
                {saving ? <><IconLoader size={14} className="animate-spin" /> SAVING...</> : <><IconCheck size={14} /> PUBLISH</>}
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
