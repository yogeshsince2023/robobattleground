import React, { useState, useEffect } from "react";
import { getClients } from "../lib/db.js";

function LogoCard({ client }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="mx-12 md:mx-18 flex items-center justify-center h-32 md:h-40 min-w-[240px] md:min-w-[320px] shrink-0 cursor-default transition-all duration-300 hover:scale-110 opacity-90 hover:opacity-100"
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

function MarqueeRow({ clients, direction, duration }) {
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
        />
      ))}
    </div>
  );
}

export default function ClientsStrip() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

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
            />
          ))}
        </div>
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
          />
        </div>
        <div className="hidden md:block">
          <MarqueeRow 
            clients={r2} 
            direction="scroll-right" 
            duration={28} 
          />
        </div>
      </div>
    </section>
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
