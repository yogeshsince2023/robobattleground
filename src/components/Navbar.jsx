import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.jpg";

const links = [
  { to: "/", label: "Home" },
  { to: "/arena", label: "Arena" },
  { to: "/machining", label: "Machining" },
  { to: "/projects", label: "Projects" },
  { to: "/internships", label: "Internships" },
  { to: "/verify", label: "Verify Certificate" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];

const Logo = () => (
  <img src={logo} alt="The Robo Battle Ground Logo" className="w-8 h-8 object-contain shrink-0" />
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-20 flex items-center ${
          scrolled 
            ? "bg-[#080808]/95 backdrop-blur-md border-b border-fire/20" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <Logo />
            <div className="flex flex-col leading-none font-display">
              <span className="text-[18px] text-text-primary uppercase font-black tracking-wider">THE ROBO</span>
              <span className="text-[12px] text-fire uppercase tracking-widest">BATTLE GROUND</span>
            </div>
          </Link>

          {/* Desktop Nav Zone */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-body">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-[12px] font-semibold uppercase tracking-[0.15em] transition-all duration-200 py-1.5 border-b-2 ${
                    isActive 
                      ? "text-fire border-fire" 
                      : "text-ash border-transparent hover:text-fire"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Side System Status & CTA */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            {/* Blinking status badge */}
            <div className="flex items-center gap-2 font-body text-[11px] font-semibold tracking-wider text-[#22c55e]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
              ARENA ONLINE
            </div>
            
            {/* CTA Button */}
            <Link 
              to="/internships"
              className="bg-fire hover:bg-[#cc3700] text-forge font-display text-[16px] tracking-[0.1em] px-4 py-2 uppercase transition-all duration-200 select-none rounded-none"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 text-text-primary hover:text-fire transition-colors"
              aria-label="Open menu"
            >
              <IconMenu2 size={28} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer (Framer Motion) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 w-full h-screen bg-[#080808] z-50 flex flex-col font-display"
          >
            {/* Top Close Row */}
            <div className="h-20 px-4 flex items-center justify-between border-b border-plate">
              <div className="flex items-center gap-2">
                <Logo />
                <div className="flex flex-col leading-none">
                  <span className="text-[18px] text-text-primary uppercase font-black tracking-wider">THE ROBO</span>
                  <span className="text-[12px] text-fire uppercase tracking-widest">BATTLE GROUND</span>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-text-primary hover:text-fire transition-colors"
                aria-label="Close menu"
              >
                <IconX size={28} />
              </button>
            </div>

            {/* Menu Links List */}
            <nav className="flex-grow flex flex-col justify-start">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `h-14 px-6 flex items-center border-b border-plate uppercase tracking-widest text-[20px] transition-colors ${
                      isActive 
                        ? "text-fire bg-steel" 
                        : "text-text-primary hover:text-fire"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="p-6">
                <Link
                  to="/internships"
                  onClick={() => setMenuOpen(false)}
                  className="w-full h-14 bg-fire text-forge text-[22px] tracking-[0.1em] uppercase flex items-center justify-center transition-all duration-200 rounded-none"
                >
                  Apply Now
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
