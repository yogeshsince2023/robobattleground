import React, { useState, useEffect } from "react";
import { 
  getContactMessages, 
  markContactMessageRead, 
  deleteContactMessage 
} from "../../lib/db.js";
import { 
  IconLoader, 
  IconMail, 
  IconMailOpened, 
  IconTrash, 
  IconAlertTriangle, 
  IconCheck 
} from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

export default function MessagesAdmin() {
  useDocumentMetadata("Manage Messages — TRBG", "Contact ticket records control.");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await getContactMessages();
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setErrorMsg("Failed to sync contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkRead = async (msg) => {
    if (msg.status === "read") return;
    try {
      const { error } = await markContactMessageRead(msg.id);
      if (error) throw error;
      await loadMessages();
    } catch (err) {
      alert("Failed to mark message as read.");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Avoid triggering mark as read
    const confirmDelete = window.confirm("Delete this contact message permanently?");
    if (!confirmDelete) return;

    try {
      const { error } = await deleteContactMessage(id);
      if (error) throw error;
      await loadMessages();
    } catch (err) {
      alert("Failed to delete message.");
    }
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Header Panel */}
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary">
          CONTACT MESSAGES
        </h1>
        <p className="text-ash text-sm font-light">Read and manage incoming website enquiries and tickets.</p>
      </div>

      {/* Primary list */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <IconLoader className="animate-spin text-fire" size={32} />
            <span className="text-xs uppercase tracking-widest text-ash">Syncing Messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-ash/60 italic text-center py-12">No messages received yet.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isUnread = msg.status === "unread";
              return (
                <div 
                  key={msg.id}
                  onClick={() => handleMarkRead(msg)}
                  className={`p-5 bg-[#080808] border transition-all duration-200 cursor-pointer relative ${
                    isUnread 
                      ? "border-spark/40 hover:border-spark bg-spark/[0.01]" 
                      : "border-[#1A1A1A] hover:border-[#2A2A2A] opacity-75 hover:opacity-100"
                  }`}
                >
                  {/* Status Indicator */}
                  {isUnread && (
                    <span className="absolute top-0 left-0 bottom-0 w-1 bg-spark" />
                  )}

                  {/* Message Upper Block */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 select-text">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${
                          isUnread 
                            ? "border-spark/40 bg-spark/5 text-spark" 
                            : "border-ash/40 bg-ash/5 text-ash"
                        }`}>
                          {msg.status}
                        </span>
                        <span className="text-xs text-ash/60 font-mono">
                          {msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-sm text-text-primary uppercase tracking-wide">
                        {msg.name} <span className="text-ash/60 font-mono font-normal text-xs">&lt;{msg.email}&gt;</span>
                      </h3>
                      
                      {msg.subject && (
                        <p className="text-spark text-xs font-semibold uppercase tracking-wider">
                          Subject: {msg.subject}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, msg.id)}
                      className="p-2 border border-[#1A1A1A] hover:border-red-500 text-ash hover:text-red-500 bg-[#111111] transition-colors self-start sm:self-center"
                      title="Delete message"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="mt-4 border-t border-[#1A1A1A]/60 pt-3 select-text">
                    <p className="text-[#F5F5F5]/90 text-sm leading-relaxed whitespace-pre-wrap bg-[#111111]/30 p-4 border border-[#1A1A1A]">
                      {msg.message}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
