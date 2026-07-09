import React from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { 
  IconLayoutDashboard, 
  IconCertificate, 
  IconPhoto, 
  IconSwords, 
  IconUsers, 
  IconMail, 
  IconLogout 
} from "@tabler/icons-react";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: IconLayoutDashboard },
    { label: "Certificates", path: "/admin/certificates", icon: IconCertificate },
    { label: "Gallery", path: "/admin/gallery", icon: IconPhoto },
    { label: "Enquiries", path: "/admin/enquiries", icon: IconSwords },
    { label: "Applications", path: "/admin/applications", icon: IconUsers },
    { label: "Messages", path: "/admin/messages", icon: IconMail }
  ];

  const isLinkActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col md:flex-row font-body">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] h-screen sticky top-0 shrink-0 select-none">
        
        {/* Top Branding Logo */}
        <div className="p-6 border-b border-[#1A1A1A] flex items-center gap-3">
          {/* Logo Skull */}
          <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current text-fire animate-pulse">
            <path d="M50,10 C30,10 20,25 20,45 C20,55 24,65 30,70 L30,85 C30,88 33,90 36,90 L64,90 C67,90 70,88 70,85 L70,70 C76,65 80,55 80,45 C80,25 70,10 50,10 Z M38,40 C38,36 41,33 45,33 C49,33 52,36 52,40 C52,44 49,47 45,47 C41,47 38,44 38,40 Z M62,40 C62,36 65,33 69,33 C73,33 76,36 76,40 C76,44 73,47 69,47 C65,47 62,44 62,40 Z M38,62 L62,62 L62,66 L38,66 Z" />
          </svg>
          <span className="font-display text-2xl uppercase tracking-wider text-text-primary">
            TRBG <span className="text-fire">ADMIN</span>
          </span>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-grow p-4 space-y-1.5">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isLinkActive(item.path);
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-150 border-l-[3px] ${
                  active 
                    ? "bg-fire/10 border-fire text-fire" 
                    : "border-transparent text-ash hover:text-text-primary hover:bg-[#111111]"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Operator Section */}
        <div className="p-4 border-t border-[#1A1A1A] bg-[#111111]/40 space-y-3">
          <div className="text-[11px] font-mono text-ash/60 truncate select-all">
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-fire text-fire hover:bg-fire hover:text-forge py-2 font-display text-[15px] uppercase tracking-wider transition-colors select-none rounded-none"
          >
            <IconLogout size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden bg-[#0A0A0A] border-b border-[#1A1A1A] py-3 px-4 flex justify-between items-center sticky top-0 z-40 select-none">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="w-6 h-6 fill-current text-fire animate-pulse">
            <path d="M50,10 C30,10 20,25 20,45 C20,55 24,65 30,70 L30,85 C30,88 33,90 36,90 L64,90 C67,90 70,88 70,85 L70,70 C76,65 80,55 80,45 C80,25 70,10 50,10 Z M38,40 C38,36 41,33 45,33 C49,33 52,36 52,40 C52,44 49,47 45,47 C41,47 38,44 38,40 Z M62,40 C62,36 65,33 69,33 C73,33 76,36 76,40 C76,44 73,47 69,47 C65,47 62,44 62,40 Z M38,62 L62,62 L62,66 L38,66 Z" />
          </svg>
          <span className="font-display text-xl uppercase tracking-wider text-text-primary">
            TRBG <span className="text-fire">CONTROL</span>
          </span>
        </div>
        
        {/* Mobile Header Icons: Messages & Logout */}
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/messages" 
            className={`p-2 transition-colors ${isLinkActive("/admin/messages") ? "text-fire" : "text-ash hover:text-text-primary"}`}
            aria-label="Messages"
          >
            <IconMail size={20} />
          </Link>
          <button 
            onClick={handleLogout}
            className="p-2 text-fire hover:bg-fire/10 transition-colors"
            aria-label="Logout"
          >
            <IconLogout size={20} />
          </button>
        </div>
      </header>

      {/* VIEW OUTLET FOR PAGES */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* MOBILE BOTTOM TAB BAR (5 primary icons) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#1A1A1A] py-2 px-1 flex justify-around items-center z-40 select-none">
        {navItems.slice(0, 5).map((item, idx) => {
          const Icon = item.icon;
          const active = isLinkActive(item.path);
          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-100 ${
                active ? "text-fire" : "text-ash"
              }`}
            >
              <Icon size={20} />
              <span className="text-[9px] uppercase tracking-wider mt-1 font-semibold truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
