import React, { useState, useEffect } from "react";
import { getClients } from "../lib/db.js";
import { buildLogoUrl } from "../lib/cloudinary.js";

function LogoCard({ client }) {
  const [imgFailed, setImgFailed] = useState(false);

  const imgEl = client.logo_url && !imgFailed ? (
    <img
      src={buildLogoUrl(client.logo_url)}
      alt={`${client.name} logo`}
      loading="lazy"
      width={260}
      height={135}
      className="select-none"
      style={{
        height: "auto",
        maxHeight: "135px",
        width: "auto",
        maxWidth: "260px",
        objectFit: "contain",
        transition: "opacity 0.3s ease",
        opacity: 0.9
      }}
      onMouseEnter={e => {
        e.target.style.opacity = "1";
      }}
      onMouseLeave={e => {
        e.target.style.opacity = "0.9";
      }}
      onError={() => setImgFailed(true)}
    />
  ) : null;

  return (
    <div
      className="mx-12 md:mx-18 flex items-center justify-center h-36 md:h-44 min-w-[260px] md:min-w-[340px] shrink-0 cursor-default transition-all duration-300 hover:scale-110 opacity-90 hover:opacity-100"
    >
      {imgEl ? (
        client.website_url ? (
          <a 
            href={client.website_url} 
            title={client.name}
            className="flex items-center justify-center w-full h-full cursor-pointer"
          >
            {imgEl}
          </a>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            {imgEl}
          </div>
        )
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
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
      }}
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
      <span className="text-[11px] text-[#6A6A6A] uppercase tracking-[0.3em] font-body">
        Trusted By
      </span>
      <div className="flex-1 border-t border-[#1A1A1A]" />
    </div>
  );
}
