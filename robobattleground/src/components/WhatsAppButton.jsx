import React from "react";
import { motion } from "framer-motion";
import { IconBrandWhatsapp } from "@tabler/icons-react";

export default function WhatsAppButton() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: 2 
      }}
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 select-none"
    >
      {/* Tooltip on hover */}
      <span className="opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-steel border border-plate text-text-primary text-xs font-semibold px-3 py-1.5 uppercase tracking-wider shadow-md whitespace-nowrap">
        Chat with us
      </span>

      {/* Button link */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:scale-110 hover:shadow-[0_8px_24px_rgba(37,211,102,0.4)] active:scale-95 transition-all duration-200"
        aria-label="Chat with us on WhatsApp"
      >
        <IconBrandWhatsapp size={28} />
      </a>
    </motion.div>
  );
}
