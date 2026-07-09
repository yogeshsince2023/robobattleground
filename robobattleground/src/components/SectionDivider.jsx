import React from "react";

export default function SectionDivider({ direction = "down", color = "bg-[#0D0D0D]" }) {
  const clipPath = direction === "down"
    ? "polygon(0 0, 100% 0, 100% 100%, 0 85%)"
    : "polygon(0 15%, 100% 0, 100% 100%, 0 100%)";

  const isHex = color.startsWith("#") || color.startsWith("rgb");

  return (
    <div 
      className={`h-[60px] w-full pointer-events-none -mt-1 ${isHex ? "" : color}`}
      style={{ 
        clipPath,
        backgroundColor: isHex ? color : undefined
      }}
      aria-hidden="true"
    />
  );
}
