import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import CookieBanner from "./CookieBanner.jsx";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-forge text-text-primary">
      <Navbar />
      <main id="main-content" className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
