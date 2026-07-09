import React, { useState } from "react";
import { IconPhoto } from "@tabler/icons-react";

export default function ArenaImage({ src, alt, className = "", overlay = true }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`bg-[#111111] flex flex-col items-center justify-center gap-2 p-4 text-center select-none ${className}`}>
        <IconPhoto size={36} className="text-[#333333]" />
        <span className="text-xs uppercase tracking-wider text-[#444444] font-semibold">
          Image coming soon
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
