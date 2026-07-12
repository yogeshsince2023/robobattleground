import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
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
            {[
              { icon: <IconBrandInstagram size={20} />, href: "https://www.instagram.com/the_robobattleground?igsh=b2V5NGdsZDhidTR0&utm_source=qr" },
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
        <span>© 2025 The Robo Battle Ground. All Rights Reserved.</span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#333] hover:text-[#555] transition-colors select-all">Udyam No: UDYAM-RJ-21-0091002</span>
        <span>Made with ⚡ in India</span>
      </div>

    </footer>
  );
}
