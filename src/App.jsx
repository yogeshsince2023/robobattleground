import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import ScrollToTop from "./components/ScrollToTop.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";

import PublicLayout from "./components/PublicLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

// Lazy loaded page components
const Home = lazy(() => import("./pages/Home.jsx"));
const Arena = lazy(() => import("./pages/Arena.jsx"));
const Machining = lazy(() => import("./pages/Machining.jsx"));
const Projects = lazy(() => import("./pages/Projects.jsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.jsx"));
const Internships = lazy(() => import("./pages/Internships.jsx"));
const Verify = lazy(() => import("./pages/Verify.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Terms = lazy(() => import("./pages/Terms.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

// Lazy loaded admin components
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const CertificatesAdmin = lazy(() => import("./pages/admin/CertificatesAdmin.jsx"));
const GalleryAdmin = lazy(() => import("./pages/admin/GalleryAdmin.jsx"));
const EnquiriesAdmin = lazy(() => import("./pages/admin/EnquiriesAdmin.jsx"));
const ApplicationsAdmin = lazy(() => import("./pages/admin/ApplicationsAdmin.jsx"));
const MessagesAdmin = lazy(() => import("./pages/admin/MessagesAdmin.jsx"));
const MachiningAdmin = lazy(() => import("./pages/admin/MachiningAdmin.jsx"));
const ProjectsAdmin = lazy(() => import("./pages/admin/ProjectsAdmin.jsx"));
const FinanceAdmin = lazy(() => import("./pages/admin/FinanceAdmin.jsx"));
const ClientsAdmin = lazy(() => import("./pages/admin/ClientsAdmin.jsx"));

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
        <Suspense fallback={
          <div style={{ 
            minHeight: '100vh', 
            background: '#080808',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: 40, height: 40,
              border: '2px solid #1A1A1A',
              borderTop: '2px solid #FF4500',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
          </div>
        }>
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
        </Suspense>
      </AnimatePresence>
    </AuthProvider>
  );
}
