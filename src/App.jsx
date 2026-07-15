import React from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import ScrollToTop from "./components/ScrollToTop.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";

import PublicLayout from "./components/PublicLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Arena from "./pages/Arena.jsx";
import Machining from "./pages/Machining.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Internships from "./pages/Internships.jsx";
import Verify from "./pages/Verify.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Terms from "./pages/Terms.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import CertificatesAdmin from "./pages/admin/CertificatesAdmin.jsx";
import GalleryAdmin from "./pages/admin/GalleryAdmin.jsx";
import EnquiriesAdmin from "./pages/admin/EnquiriesAdmin.jsx";
import ApplicationsAdmin from "./pages/admin/ApplicationsAdmin.jsx";
import MessagesAdmin from "./pages/admin/MessagesAdmin.jsx";
import MachiningAdmin from "./pages/admin/MachiningAdmin.jsx";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin.jsx";
import FinanceAdmin from "./pages/admin/FinanceAdmin.jsx";
import ClientsAdmin from "./pages/admin/ClientsAdmin.jsx";

export default function App() {
  return (
    <AuthProvider>
      {/* Keyboard Accessibility: Skip link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-fire text-forge px-4 py-2 font-display uppercase tracking-wider z-[100] outline-none"
      >
        Skip to content
      </a>

      <ScrollToTop />
      <WhatsAppButton />
      
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Views Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/machining" element={<Machining />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
          </Route>

          {/* Admin Restricted Portal */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Secure Admin Pages Layout */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="certificates" element={<CertificatesAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="enquiries" element={<EnquiriesAdmin />} />
            <Route path="applications" element={<ApplicationsAdmin />} />
            <Route path="machining" element={<MachiningAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
            <Route path="finance" element={<FinanceAdmin />} />
            <Route path="clients" element={<ClientsAdmin />} />
          </Route>

          {/* Page not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}
