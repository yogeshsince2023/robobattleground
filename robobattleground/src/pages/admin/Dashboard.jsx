import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminStats, getArenaEnquiries, getInternshipApplications, updateArenaEnquiry } from "../../lib/db.js";
import { IconLoader, IconChevronRight, IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

export default function Dashboard() {
  useDocumentMetadata("Command Center — TRBG", "Administrative control center.");

  const [stats, setStats] = useState({ certsCount: 0, enquiriesCount: 0, appsCount: 0, msgsCount: 0 });
  const [enquiries, setEnquiries] = useState([]);
  const [applications, setApplications] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      const statsData = await getAdminStats();
      const enqData = await getArenaEnquiries();
      const appData = await getInternshipApplications();

      if (statsData.error || enqData.error || appData.error) {
        throw new Error("Query execution failed");
      }

      setStats(statsData);
      setEnquiries(enqData.data.slice(0, 5));
      setApplications(appData.data.slice(0, 5));
    } catch (err) {
      setError("Unable to sync telemetry data with server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleMarkEnquiryReviewed = async (id) => {
    try {
      const { error: updateErr } = await updateArenaEnquiry(id, { status: "reviewed" });
      if (updateErr) throw updateErr;
      // Refresh list to pull updated status
      loadDashboardData();
    } catch (err) {
      alert("Status update failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <IconLoader className="animate-spin text-fire" size={40} />
        <span className="font-display text-sm tracking-widest text-ash uppercase">Loading Telemetry Logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500/30 bg-red-500/5 p-6 text-red-500 flex items-start gap-3 max-w-xl mx-auto mt-12 rounded-none">
        <IconAlertTriangle size={24} className="shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="font-display text-lg uppercase tracking-wide">Sync Failure</h2>
          <p className="text-sm font-light text-[#F5F5F5]/70">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Certificates Issued", count: stats.certsCount, path: "/admin/certificates" },
    { label: "New Arena Enquiries", count: stats.enquiriesCount, path: "/admin/enquiries", isNew: true },
    { label: "New Internship Applications", count: stats.appsCount, path: "/admin/applications", isNew: true },
    { label: "Unread Messages", count: stats.msgsCount, path: "/admin/messages", isNew: true }
  ];

  return (
    <div className="space-y-8 select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary">
          COMMAND CENTER
        </h1>
        <p className="text-ash text-sm font-light">
          Welcome to the TRBG administrative combat logs panel.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Link 
            key={i} 
            to={stat.path}
            className="bg-[#111111] border border-[#1A1A1A] p-6 hover:border-fire/40 transition-colors flex flex-col justify-between relative group rounded-none"
          >
            <div className="flex justify-between items-start">
              <span className="text-[12px] uppercase text-ash/80 tracking-widest font-semibold">
                {stat.label}
              </span>
              {stat.isNew && stat.count > 0 && (
                <span className="border border-spark bg-spark/10 px-2 py-0.5 text-[10px] text-spark uppercase tracking-wider font-bold">
                  NEW
                </span>
              )}
            </div>
            <strong className="font-display text-6xl text-fire font-bold leading-none mt-6 group-hover:translate-x-1.5 transition-transform duration-200 block">
              {stat.count}
            </strong>
          </Link>
        ))}
      </div>

      {/* Feeds Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Arena Enquiries Feed */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
          <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-4">
            <h2 className="font-display text-2xl uppercase tracking-wider">
              Recent Enquiries
            </h2>
            <Link to="/admin/enquiries" className="text-xs uppercase text-fire hover:underline tracking-wider flex items-center gap-1 font-semibold">
              View All <IconChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {enquiries.length === 0 ? (
              <p className="text-sm text-ash/50 italic py-4">No recent bookings logged.</p>
            ) : (
              enquiries.map((enq) => (
                <div 
                  key={enq.id}
                  className="p-4 bg-[#080808] border border-[#1A1A1A] flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm uppercase text-text-primary group-hover:text-fire transition-colors">{enq.full_name}</h3>
                    <div className="flex items-center gap-3 text-xs text-ash/60 font-mono">
                      <span>{enq.weight_class}</span>
                      <span>•</span>
                      <span>{enq.preferred_date ? new Date(enq.preferred_date).toLocaleDateString() : "No Date"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${
                      enq.status === 'new' 
                        ? 'border-spark/40 bg-spark/5 text-spark' 
                        : enq.status === 'reviewed'
                        ? 'border-blue-500/40 bg-blue-500/5 text-blue-400'
                        : enq.status === 'confirmed'
                        ? 'border-green-500/40 bg-green-500/5 text-green-400'
                        : 'border-red-500/40 bg-red-500/5 text-red-400'
                    }`}>
                      {enq.status}
                    </span>

                    {enq.status === "new" && (
                      <button
                        onClick={() => handleMarkEnquiryReviewed(enq.id)}
                        title="Mark as reviewed"
                        className="p-1.5 border border-[#1A1A1A] hover:border-fire text-ash hover:text-fire transition-colors bg-[#111111]"
                      >
                        <IconCheck size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Internship Applications Feed */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
          <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-4">
            <h2 className="font-display text-2xl uppercase tracking-wider">
              Recent Applications
            </h2>
            <Link to="/admin/applications" className="text-xs uppercase text-fire hover:underline tracking-wider flex items-center gap-1 font-semibold">
              View All <IconChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {applications.length === 0 ? (
              <p className="text-sm text-ash/50 italic py-4">No recent cadet applications.</p>
            ) : (
              applications.map((app) => (
                <div 
                  key={app.id}
                  className="p-4 bg-[#080808] border border-[#1A1A1A] flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm uppercase text-text-primary group-hover:text-fire transition-colors">{app.full_name}</h3>
                    <div className="flex items-center gap-3 text-xs text-ash/60 font-mono">
                      <span className="truncate max-w-[120px]">{app.college}</span>
                      <span>•</span>
                      <span className="text-spark font-semibold">{app.track}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${
                    app.status === 'new' 
                      ? 'border-spark/40 bg-spark/5 text-spark' 
                      : app.status === 'reviewing'
                      ? 'border-blue-500/40 bg-blue-500/5 text-blue-400'
                      : app.status === 'accepted'
                      ? 'border-green-500/40 bg-green-500/5 text-green-400'
                      : 'border-red-500/40 bg-red-500/5 text-red-400'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
