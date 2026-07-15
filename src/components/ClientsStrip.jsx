import React, { useState, useEffect } from "react";
import { getClients } from "../lib/db.js";
import { IconX } from "@tabler/icons-react";

function LogoCard({ client, onClick }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasHighlight = !!client.highlight_image_url;

  return (
    <div
      onClick={hasHighlight ? onClick : undefined}
      className={`mx-12 md:mx-18 flex items-center justify-center h-32 md:h-40 min-w-[240px] md:min-w-[320px] shrink-0 transition-all duration-300 hover:scale-110 opacity-90 hover:opacity-100 ${
        hasHighlight ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {client.logo_url && !imgFailed ? (
        <img
          src={client.logo_url}
          alt={client.name}
          loading="lazy"
          className="h-[90px] md:h-[120px] w-auto object-contain select-none"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="text-[#888] font-body text-sm font-semibold tracking-wider uppercase">
          {client.name}
        </span>
      )}
    </div>
  );
}

function MarqueeRow({ clients, direction, duration, onClientClick }) {
  const tripled = [...clients, ...clients, ...clients];

  return (
    <div
      className="marquee-row flex w-max"
      style={{
        animation: `${direction} ${duration}s linear infinite`,
      }}
    >
      {tripled.map((c, i) => (
        <LogoCard 
          key={`${c.id}-${i}`} 
          client={c} 
          onClick={() => onClientClick(c)}
        />
      ))}
    </div>
  );
}

export default function ClientsStrip() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(null);

  useEffect(() => {
    getClients().then(({ data }) => {
      if (data) setClients(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="bg-[#0A0A0A] border-y border-[#1A1A1A] py-16 overflow-hidden">
        <div className="flex justify-center gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 w-48 bg-[#111111] animate-pulse rounded-sm" />
          ))}
        </div>
      </section>
    );
  }

  if (clients.length === 0) return null;

  // < 4 logos: static centered row, no animation
  if (clients.length < 4) {
    return (
      <section className="bg-[#0A0A0A] border-y border-[#1A1A1A] py-16 overflow-hidden">
        <Header />
        <div className="flex flex-wrap items-center justify-center gap-8">
          {clients.map((c) => (
            <LogoCard 
              key={c.id} 
              client={c} 
              onClick={() => setActivePhoto(c)}
            />
          ))}
        </div>
        
        {/* Highlight Lightbox */}
        {activePhoto && (
          <Lightbox activePhoto={activePhoto} onClose={() => setActivePhoto(null)} />
        )}
      </section>
    );
  }

  const mid = Math.ceil(clients.length / 2);
  const row1 = clients.slice(0, mid);
  const row2 = clients.slice(mid);
  const r2 = row2.length >= 2 ? row2 : clients;

  return (
    <section
      className="bg-[#0A0A0A] border-y border-[#1A1A1A] py-16 overflow-hidden group relative"
      onMouseEnter={(e) => e.currentTarget.querySelectorAll('.marquee-row').forEach(r => r.style.animationPlayState = 'paused')}
      onMouseLeave={(e) => e.currentTarget.querySelectorAll('.marquee-row').forEach(r => r.style.animationPlayState = 'running')}
    >
      <Header />
      <div className="space-y-4">
        <div className="block">
          <MarqueeRow 
            clients={row1} 
            direction="scroll-left" 
            duration={35} 
            onClientClick={(c) => setActivePhoto(c)} 
          />
        </div>
        <div className="hidden md:block">
          <MarqueeRow 
            clients={r2} 
            direction="scroll-right" 
            duration={28} 
            onClientClick={(c) => setActivePhoto(c)}
          />
        </div>
      </div>

      {/* Highlight Lightbox */}
      {activePhoto && (
        <Lightbox activePhoto={activePhoto} onClose={() => setActivePhoto(null)} />
      )}
    </section>
  );
}

function Lightbox({ activePhoto, onClose }) {
  return (
    <div 
      className="fixed inset-0 z-[999] bg-[#000000]/95 flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 text-ash hover:text-[#F5F5F5] transition-colors p-2 bg-[#111111]/80 border border-[#1A1A1A]"
        onClick={onClose}
      >
        <IconX size={24} />
      </button>
      
      <div 
        className="relative max-w-4xl max-h-[85vh] flex flex-col items-center gap-4 bg-[#0A0A0A] border border-[#1A1A1A] p-3 md:p-6 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={activePhoto.highlight_image_url} 
          alt={activePhoto.name}
          className="max-w-full max-h-[65vh] md:max-h-[70vh] object-contain border border-[#1A1A1A]/50" 
        />
        <div className="text-center w-full mt-2">
          <h3 className="font-display text-xl uppercase tracking-wider text-text-primary">
            {activePhoto.name}
          </h3>
          <p className="text-xs text-ash/80 font-body uppercase tracking-[0.1em] mt-1">
            Workshop & Combat Robotics Highlights
          </p>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center gap-4 max-w-md mx-auto mb-12 px-4">
      <div className="flex-1 border-t border-[#1A1A1A]" />
      <span className="text-[11px] text-[#444] uppercase tracking-[0.3em] font-body">
        Trusted By
      </span>
      <div className="flex-1 border-t border-[#1A1A1A]" />
    </div>
  );
}
