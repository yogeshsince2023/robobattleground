import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { 
  IconBrandInstagram, 
  IconMail, 
  IconMapPin, 
  IconClock 
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#080808] border-t border-fire/15 relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Col 1 — Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <img src={logo} alt="The Robo BG Logo" className="w-6 h-6 object-contain shrink-0" />
            <span className="font-display text-xl text-text-primary uppercase tracking-wider font-black">
              THE ROBO <span className="text-fire">BG</span>
            </span>
          </div>
          <p className="font-body text-[13px] text-[#555] leading-relaxed">
            India's Premier Combat Robotics Arena.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-4 pt-2">
            <a 
              href="https://www.instagram.com/the_robobattleground?igsh=b2V5NGdsZDhidTR0&utm_source=qr" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#555] hover:text-fire transition-colors"
              aria-label="Instagram"
            >
              <IconBrandInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <h3 className="font-display text-[16px] text-fire uppercase tracking-[0.15em] mb-4">
            QUICK LINKS
          </h3>
          <div className="flex flex-col gap-2 font-body text-[13px] text-[#555]">
            <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
            <Link to="/arena" className="hover:text-text-primary transition-colors">Arena</Link>
            <Link to="/internships" className="hover:text-text-primary transition-colors">Internships</Link>
            <Link to="/about" className="hover:text-text-primary transition-colors">About</Link>
            <Link to="/contact" className="hover:text-text-primary transition-colors">Contact</Link>
          </div>
        </div>

        {/* Col 3 — Services */}
        <div>
          <h3 className="font-display text-[16px] text-fire uppercase tracking-[0.15em] mb-4">
            SERVICES
          </h3>
          <div className="flex flex-col gap-2 font-body text-[13px] text-[#555]">
            <span className="hover:text-text-primary cursor-pointer transition-colors">RoboWar Arena</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">BattleBot Pit</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">Autonomous Tracks</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">Internship Programs</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">Certificate Verification</span>
          </div>
        </div>

        {/* Col 4 — Contact */}
        <div className="space-y-4">
          <h3 className="font-display text-[16px] text-fire uppercase tracking-[0.15em] mb-2">
            CONTACT
          </h3>
          <div className="space-y-3 font-body text-[13px] text-[#555]">
            <div className="flex items-center gap-2">
              <IconMail size={16} className="text-[#555]" />
              <a href="mailto:therobobattleground@gmail.com" className="hover:text-text-primary transition-colors font-mono">
                therobobattleground@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <IconMapPin size={16} className="text-[#555]" />
              <span>Jaipur, Rajasthan, India</span>
            </div>
            <div className="flex items-center gap-2">
              <IconClock size={16} className="text-[#555]" />
              <span>Mon-Sat, 10AM - 7PM</span>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto px-6 border-t border-[#111] py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-[#444] font-body">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
          <span>© 2025 The Robo Battle Ground. All Rights Reserved.</span>
          <Link to="/terms" className="hover:text-text-primary transition-colors underline decoration-fire/40 underline-offset-4">
            Terms & Conditions
          </Link>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#333] hover:text-[#555] transition-colors select-all">Udyam No: UDYAM-RJ-21-0091002</span>
        <span>Made with ⚡ in India</span>
      </div>

    </footer>
  );
}
