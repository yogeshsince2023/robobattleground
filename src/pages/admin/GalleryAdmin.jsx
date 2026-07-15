import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase.js";
import { 
  getAllGallery, 
  insertGalleryItem, 
  updateGalleryItem, 
  deleteGalleryItem 
} from "../../lib/db.js";
import { 
  IconLoader, 
  IconCloudUpload, 
  IconEye, 
  IconEyeOff, 
  IconTrash, 
  IconArrowUp, 
  IconArrowDown, 
  IconCheck, 
  IconAlertTriangle 
} from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

export default function GalleryAdmin() {
  useDocumentMetadata("Manage Gallery — TRBG", "Media gallery upload dashboard control.");

  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // File Uploader state
  const [filesToUpload, setFilesToUpload] = useState([]); // Array of { file, id, preview, category, progress, status: 'idle'|'uploading'|'done'|'error' }
  const [overallProgress, setOverallProgress] = useState(0);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);
  const fileInputRef = useRef(null);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAllGallery();
      if (error) throw error;
      setGallery(data || []);
    } catch (err) {
      setErrorMsg("Failed to sync media gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleSelectFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    addFilesToQueue(selected);
  };

  const addFilesToQueue = (files) => {
    const formatted = files.map((file) => {
      // Validate file size limit (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 10MB limit.`);
        return null;
      }
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        preview: URL.createObjectURL(file),
        category: "Arena",
        progress: 0,
        status: "idle"
      };
    }).filter(Boolean);

    setFilesToUpload((prev) => [...prev, ...formatted]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    addFilesToQueue(files);
  };

  const handleCategoryChangeForQueue = (id, newCat) => {
    setFilesToUpload((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category: newCat } : item))
    );
  };

  const handleRemoveFromQueue = (id) => {
    setFilesToUpload((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const uploadAllFiles = async () => {
    const idleFiles = filesToUpload.filter((f) => f.status === "idle");
    if (idleFiles.length === 0) return;

    setTotalUploads(idleFiles.length);
    setUploadingCount(0);
    setOverallProgress(0);

    for (let i = 0; i < idleFiles.length; i++) {
      const fileRecord = idleFiles[i];
      setUploadingCount(i + 1);

      // Set status to uploading
      setFilesToUpload((prev) =>
        prev.map((f) => (f.id === fileRecord.id ? { ...f, status: "uploading" } : f))
      );

      try {
        const timestamp = Date.now();
        const normalizedName = fileRecord.file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const storagePath = `${fileRecord.category.toLowerCase()}/${timestamp}-${normalizedName}`;

        // Upload to Supabase Storage bucket 'gallery'
        const { error: storageErr } = await supabase.storage
          .from("gallery")
          .upload(storagePath, fileRecord.file, {
            cacheControl: "3600",
            upsert: false
          });

        if (storageErr) throw storageErr;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("gallery")
          .getPublicUrl(storagePath);

        // Save row details to table
        const rowData = {
          title: fileRecord.file.name.split(".")[0],
          category: fileRecord.category,
          storage_path: storagePath,
          public_url: publicUrl,
          sort_order: gallery.length + i,
          is_visible: true
        };

        const { error: dbErr } = await insertGalleryItem(rowData);
        if (dbErr) throw dbErr;

        setFilesToUpload((prev) =>
          prev.map((f) =>
            f.id === fileRecord.id ? { ...f, status: "done", progress: 100 } : f
          )
        );
      } catch (err) {
        setFilesToUpload((prev) =>
          prev.map((f) => (f.id === fileRecord.id ? { ...f, status: "error" } : f))
        );
      }

      setOverallProgress(Math.round(((i + 1) / idleFiles.length) * 100));
    }

    // Refresh list view after uploading all
    setTimeout(() => {
      loadGallery();
      setFilesToUpload((prev) => prev.filter((f) => f.status !== "done"));
    }, 1500);
  };

  const handleToggleVisibility = async (photo) => {
    try {
      const { error } = await updateGalleryItem(photo.id, {
        is_visible: !photo.is_visible
      });
      if (error) throw error;
      loadGallery();
    } catch (err) {
      alert("Failed to update visibility state.");
    }
  };

  const handleDeletePhoto = async (photo) => {
    const confirmDelete = window.confirm("Delete photo from gallery and storage?");
    if (!confirmDelete) return;

    try {
      // 1. Delete from Supabase Storage first
      if (photo.storage_path) {
        const { error: storageErr } = await supabase.storage
          .from("gallery")
          .remove([photo.storage_path]);
        if (storageErr) throw storageErr;
      }

      // 2. Delete from gallery database table
      const { error: dbErr } = await deleteGalleryItem(photo.id);
      if (dbErr) throw dbErr;

      loadGallery();
    } catch (err) {
      alert("Delete action failed.");
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const current = gallery[index];
    const target = gallery[targetIndex];

    try {
      // Swap sort order keys
      const currentOrder = current.sort_order;
      const targetOrder = target.sort_order;

      await Promise.all([
        updateGalleryItem(current.id, { sort_order: targetOrder }),
        updateGalleryItem(target.id, { sort_order: currentOrder })
      ]);

      loadGallery();
    } catch (err) {
      alert("Reorder action failed.");
    }
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Header View */}
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary">
          GALLERY MANAGER
        </h1>
        <p className="text-ash text-sm font-light">Upload battle scene snapshots and sort visual cards.</p>
      </div>

      {/* Upload Box Dropzone */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
        
        {/* Dashed Border Drag/Drop Area */}
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#2A2A2A] hover:border-fire/50 bg-[#080808] p-8 md:p-12 text-center cursor-pointer transition-colors space-y-4"
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleSelectFiles}
            multiple 
            accept="image/jpeg,image/png,image/webp"
            className="hidden" 
          />
          <div className="flex justify-center text-ash/40">
            <IconCloudUpload size={48} className="text-ash/40 group-hover:text-fire transition-colors" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-2xl uppercase tracking-wider text-ash/75">
              Drag & Drop Photos Here
            </h3>
            <p className="text-xs text-ash/50">
              or tap to select from your device (JPG, PNG, WEBP — up to 10MB)
            </p>
          </div>
        </div>

        {/* Selected upload queue items */}
        {filesToUpload.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-[#1A1A1A]">
            <h3 className="font-display text-lg uppercase tracking-wider text-text-primary">
              Upload Queue ({filesToUpload.length} files)
            </h3>

            {/* Overall progress indicator */}
            {overallProgress > 0 && (
              <div className="space-y-2 bg-[#080808] p-4 border border-[#1A1A1A]">
                <div className="flex justify-between text-xs font-mono text-ash">
                  <span>Uploading photo {uploadingCount} of {totalUploads}...</span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="w-full bg-[#1A1A1A] h-2 rounded-none overflow-hidden">
                  <div 
                    className="bg-fire h-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filesToUpload.map((item) => (
                <div key={item.id} className="bg-[#080808] border border-[#1A1A1A] p-4 flex gap-4 items-center">
                  <img 
                    src={item.preview} 
                    alt="Upload Preview" 
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover border border-[#1A1A1A] shrink-0" 
                  />
                  <div className="flex-grow min-w-0 space-y-1">
                    <p className="text-xs text-text-primary font-mono truncate">{item.name}</p>
                    <p className="text-[10px] text-ash/60 font-mono">{item.size}</p>
                    
                    {/* Category pickers */}
                    <select
                      value={item.category}
                      onChange={(e) => handleCategoryChangeForQueue(item.id, e.target.value)}
                      disabled={item.status === "uploading"}
                      className="bg-[#111111] border border-[#1A1A1A] text-[10px] uppercase font-bold p-1 text-ash rounded-none outline-none focus:border-fire"
                    >
                      <option>Arena</option>
                      <option>Robots</option>
                      <option>Team</option>
                      <option>Internship</option>
                      <option>Events</option>
                    </select>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {item.status === "uploading" && (
                      <IconLoader className="animate-spin text-fire" size={16} />
                    )}
                    {item.status === "done" && (
                      <IconCheck className="text-green-400" size={16} />
                    )}
                    {item.status === "error" && (
                      <IconAlertTriangle className="text-red-500" size={16} />
                    )}
                    {item.status === "idle" && (
                      <button
                        onClick={() => handleRemoveFromQueue(item.id)}
                        className="text-ash/40 hover:text-red-500 transition-colors"
                      >
                        <IconTrash size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={uploadAllFiles}
              disabled={filesToUpload.every(f => f.status === "uploading")}
              className="px-8 py-3 bg-fire hover:bg-[#cc3700] text-forge font-display text-lg uppercase tracking-wider transition-colors rounded-none select-none"
            >
              Upload All Files
            </button>
          </div>
        )}
      </div>

      {/* Grid of existing gallery elements */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
        <h2 className="font-display text-2xl uppercase tracking-wider text-text-primary">
          Media Assets Grid
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <IconLoader className="animate-spin text-fire" size={32} />
            <span className="text-xs uppercase tracking-widest text-ash">Syncing Gallery...</span>
          </div>
        ) : gallery.length === 0 ? (
          <p className="text-sm text-ash/60 italic text-center py-12">No media assets in database.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map((photo, index) => (
              <div 
                key={photo.id}
                className="bg-[#080808] border border-[#1A1A1A] hover:border-fire/40 transition-colors group relative overflow-hidden flex flex-col"
              >
                {/* Photo Image wrapper */}
                <div className="relative aspect-video overflow-hidden border-b border-[#1A1A1A] shrink-0">
                  <img 
                    src={photo.public_url} 
                    alt={photo.title || "Gallery"} 
                    width={320}
                    height={180}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                      !photo.is_visible ? "grayscale opacity-30" : ""
                    }`}
                  />
                  
                  {/* Category badge */}
                  <span className="absolute top-2 left-2 bg-[#0A0A0A] border border-[#1A1A1A] text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold font-mono">
                    {photo.category}
                  </span>
                </div>

                {/* Info & sorting block */}
                <div className="p-3 flex items-center justify-between gap-2 flex-grow select-none">
                  <div className="text-[10px] text-ash font-mono uppercase tracking-wide truncate max-w-[100px]" title={photo.title}>
                    {photo.title}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Sort buttons */}
                    <button
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      title="Move Up"
                      className="p-1 text-ash hover:text-fire disabled:opacity-20 transition-colors"
                    >
                      <IconArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={index === gallery.length - 1}
                      title="Move Down"
                      className="p-1 text-ash hover:text-fire disabled:opacity-20 transition-colors"
                    >
                      <IconArrowDown size={14} />
                    </button>

                    {/* Visibility toggles */}
                    <button
                      onClick={() => handleToggleVisibility(photo)}
                      title={photo.is_visible ? "Hide photo" : "Show photo"}
                      className={`p-1 transition-colors ${
                        photo.is_visible ? "text-ash hover:text-fire" : "text-spark"
                      }`}
                    >
                      {photo.is_visible ? <IconEye size={14} /> : <IconEyeOff size={14} />}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeletePhoto(photo)}
                      title="Delete asset"
                      className="p-1 text-ash hover:text-red-500 transition-colors"
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
