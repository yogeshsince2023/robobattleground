import React, { useState, useEffect } from "react";
import { getClients } from "../lib/db.js";

function LogoCard({ client }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="mx-8 md:mx-12 flex items-center justify-center h-20 md:h-24 min-w-[160px] md:min-w-[200px] shrink-0 cursor-default transition-all duration-300 hover:scale-110 opacity-80 hover:opacity-100"
    >
      {client.logo_url && !imgFailed ? (
        <img
          src={client.logo_url}
          alt={client.name}
          loading="lazy"
          className="h-[48px] md:h-[60px] w-auto object-contain select-none"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="text-[#888] font-body text-xs font-semibold tracking-wider uppercase">
          {client.name}
        </span>
      )}
    </div>
  );
}

function MarqueeRow({ clients, direction, duration }) {
  // ponytail: tripled for seamless loop; if list grows huge, cap at ~30 items
  const tripled = [...clients, ...clients, ...clients];

  return (
    <div
      className="marquee-row flex w-max"
      style={{
        animation: `${direction} ${duration}s linear infinite`,
      }}
    >
      {tripled.map((c, i) => (
        <LogoCard key={`${c.id}-${i}`} client={c} />
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
            <div key={i} className="h-10 w-32 bg-[#111111] animate-pulse rounded-sm" />
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
            <LogoCard key={c.id} client={c} />
          ))}
        </div>
      </section>
    );
  }

  // Split clients into two rows
  const mid = Math.ceil(clients.length / 2);
  const row1 = clients.slice(0, mid);
  const row2 = clients.slice(mid);
  // If row2 is too short, just use the full list for both
  const r2 = row2.length >= 2 ? row2 : clients;

  return (
    <section
      className="bg-[#0A0A0A] border-y border-[#1A1A1A] py-16 overflow-hidden group"
      style={{ /* pause on hover */ }}
      onMouseEnter={(e) => e.currentTarget.querySelectorAll('.marquee-row').forEach(r => r.style.animationPlayState = 'paused')}
      onMouseLeave={(e) => e.currentTarget.querySelectorAll('.marquee-row').forEach(r => r.style.animationPlayState = 'running')}
    >
      <Header />
      <div className="space-y-4">
        {/* Desktop: two rows, Mobile: one row */}
        <div className="block">
          <MarqueeRow clients={row1} direction="scroll-left" duration={35} />
        </div>
        <div className="hidden md:block">
          <MarqueeRow clients={r2} direction="scroll-right" duration={28} />
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
