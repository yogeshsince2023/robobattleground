import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  IconBrandInstagram, 
  IconBrandYoutube, 
  IconBrandLinkedin, 
  IconBrandGithub, 
  IconMail, 
  IconMapPin, 
  IconClock 
} from "@tabler/icons-react";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#080808] border-t border-fire/15 relative z-10">
      
      {/* PRE-FOOTER CTA STRIP */}
      <div className="w-full bg-fire py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="font-display text-4xl font-black text-forge uppercase leading-none mb-1">
              COMPLETED AN INTERNSHIP?
            </h2>
            <p className="font-body text-sm text-forge/70">
              Verify your certificate instantly — free, permanent, and tamper-proof.
            </p>
          </div>
          <button
            onClick={() => navigate("/verify")}
            className="w-full md:w-auto px-8 py-4 bg-[#080808] hover:bg-[#1A1A1A] text-white font-display text-[18px] uppercase tracking-wider transition-colors rounded-none shrink-0"
          >
            VERIFY CERTIFICATE →
          </button>
        </div>
      </div>

      {/* MAIN FOOTER BODY */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Col 1 — Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M6 6H26V20L20 26H12L6 20V6Z" fill="#F5F5F5" />
              <rect x="9" y="10" width="4" height="4" fill="#080808" />
              <rect x="19" y="10" width="4" height="4" fill="#080808" />
              <rect x="10" y="11" width="2" height="2" fill="#FF4500" />
              <rect x="20" y="11" width="2" height="2" fill="#FF4500" />
              <line x1="12" y1="20" x2="12" y2="23" stroke="#080808" strokeWidth="2" />
              <line x1="16" y1="20" x2="16" y2="23" stroke="#080808" strokeWidth="2" />
              <line x1="20" y1="20" x2="20" y2="23" stroke="#080808" strokeWidth="2" />
            </svg>
            <span className="font-display text-xl text-text-primary uppercase tracking-wider font-black">
              THE ROBO <span className="text-fire">BG</span>
            </span>
          </div>
          <p className="font-body text-[13px] text-[#555] leading-relaxed">
            India's Premier Combat Robotics Arena.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-4 pt-2">
            {[
              { icon: <IconBrandInstagram size={20} />, href: "https://instagram.com" },
              { icon: <IconBrandYoutube size={20} />, href: "https://youtube.com" },
              { icon: <IconBrandLinkedin size={20} />, href: "https://linkedin.com" },
              { icon: <IconBrandGithub size={20} />, href: "https://github.com" }
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.href} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#555] hover:text-fire transition-colors"
              >
                {social.icon}
              </a>
            ))}
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
            <Link to="/verify" className="hover:text-text-primary transition-colors">Verify Certificate</Link>
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
              <a href="mailto:contact@therobobattleground.in" className="hover:text-text-primary transition-colors font-mono">
                contact@therobobattleground.in
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
        <span>© 2025 The Robo Battle Ground. All Rights Reserved.</span>
        <span>Made with ⚡ in India</span>
      </div>

    </footer>
  );
}
