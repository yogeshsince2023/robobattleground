import React, { useState, useEffect } from "react";
import { getClients } from "../lib/db.js";
import { IconX, IconMaximize } from "@tabler/icons-react";

function LogoCard({ client, onHover, onClick }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasHighlight = !!client.highlight_image_url;

  return (
    <div
      onMouseEnter={hasHighlight ? onHover : undefined}
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

function MarqueeRow({ clients, direction, duration, onClientHover, onClientClick }) {
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
          onHover={() => onClientHover(c)}
          onClick={() => onClientClick(c)}
        />
      ))}
    </div>
  );
}

export default function ClientsStrip() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeClient, setActiveClient] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    getClients().then(({ data }) => {
      if (data && data.length > 0) {
        setClients(data);
        // Find first client with a highlight image to show as default
        const defaultClient = data.find(c => c.highlight_image_url) || data[0];
        setActiveClient(defaultClient);
      }
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

  const handleHover = (client) => {
    setActiveClient(client);
  };

  const handleClick = (client) => {
    setActiveClient(client);
    setShowLightbox(true);
  };

  // Render method for the interactive showcase frame
  const renderPreviewFrame = () => {
    if (!activeClient || !activeClient.highlight_image_url) return null;

    return (
      <div className="max-w-2xl mx-auto px-4 mb-12">
        <div 
          className="relative group/frame cursor-pointer border border-[#1A1A1A] bg-[#111111]/30 p-2 md:p-3 overflow-hidden transition-all duration-300 hover:border-fire/40"
          onClick={() => setShowLightbox(true)}
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          <img 
            src={activeClient.highlight_image_url} 
            alt={activeClient.name}
            className="w-full h-[220px] md:h-[340px] object-cover border border-[#1A1A1A]/50 transition-all duration-500 group-hover/frame:scale-[1.01]" 
          />
          
          {/* Expand icon overlay */}
          <div className="absolute inset-0 bg-[#000000]/60 opacity-0 group-hover/frame:opacity-100 flex items-center justify-center transition-all duration-200">
            <div className="flex items-center gap-2 border border-fire text-fire bg-[#080808] px-4 py-2 text-xs uppercase tracking-widest font-display font-semibold select-none">
              <IconMaximize size={14} /> Expand View
            </div>
          </div>

          {/* Description overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-[#080808]/90 border border-[#1A1A1A] p-3 backdrop-blur-sm flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm uppercase tracking-wider text-text-primary">
                {activeClient.name}
              </h3>
              <p className="text-[10px] text-ash/70 font-body uppercase tracking-[0.1em] mt-0.5">
                TRBG Workshop & Tech Highlights
              </p>
            </div>
            <span className="text-[10px] border border-fire/30 bg-fire/5 px-2 py-0.5 text-fire uppercase tracking-widest font-bold font-mono">
              Live Feed
            </span>
          </div>
        </div>
      </div>
    );
  };

  // < 4 logos: static centered row, no animation
  if (clients.length < 4) {
    return (
      <section className="bg-[#0A0A0A] border-y border-[#1A1A1A] py-16 overflow-hidden">
        <Header />
        {renderPreviewFrame()}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {clients.map((c) => (
            <LogoCard 
              key={c.id} 
              client={c} 
              onHover={() => handleHover(c)}
              onClick={() => handleClick(c)}
            />
          ))}
        </div>
        
        {/* Highlight Lightbox */}
        {showLightbox && activeClient && (
          <Lightbox activePhoto={activeClient} onClose={() => setShowLightbox(false)} />
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
      {renderPreviewFrame()}
      <div className="space-y-4">
        <div className="block">
          <MarqueeRow 
            clients={row1} 
            direction="scroll-left" 
            duration={35} 
            onClientHover={handleHover}
            onClientClick={handleClick} 
          />
        </div>
        <div className="hidden md:block">
          <MarqueeRow 
            clients={r2} 
            direction="scroll-right" 
            duration={28} 
            onClientHover={handleHover}
            onClientClick={handleClick}
          />
        </div>
      </div>

      {/* Highlight Lightbox */}
      {showLightbox && activeClient && (
        <Lightbox activePhoto={activeClient} onClose={() => setShowLightbox(false)} />
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
