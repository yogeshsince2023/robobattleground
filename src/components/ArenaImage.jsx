import React, { useState } from "react";
import { IconPhoto } from "@tabler/icons-react";

export default function ArenaImage({ src, alt, className = "", overlay = true }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div 
        className={`bg-[#111111] min-h-[200px] flex flex-col items-center justify-center gap-3 p-4 text-center select-none relative overflow-hidden group/placeholder ${className}`}
      >
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        {/* Laser sweep scanner line */}
        <div 
          className="absolute inset-x-0 top-0 h-[2px] bg-fire/40 blur-[1px] pointer-events-none"
          style={{
            animation: "trbg-sweep 3s linear infinite"
          }}
        />

        {/* Laser sweep animation keyframes */}
        <style>{`
          @keyframes trbg-sweep {
            0% { transform: translateY(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(200px); opacity: 0; }
          }
        `}</style>

        <IconPhoto size={48} className="text-[#333333] group-hover/placeholder:text-fire/40 transition-colors duration-300 group-hover/placeholder:scale-110" />
        <span className="Inter text-[13px] uppercase tracking-wider text-[#444444] font-semibold group-hover/placeholder:text-fire/70 transition-colors duration-300">
          Photo coming soon
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
      {overlay && (
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
        />
      )}
    </div>
  );
}
