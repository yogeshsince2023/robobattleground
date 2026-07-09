import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IconArrowLeft } from "@tabler/icons-react";
import PageWrapper from "../components/PageWrapper.jsx";
import useDocumentMetadata from "../hooks/useDocumentMetadata.js";

export default function NotFound() {
  useDocumentMetadata("Page Not Found — The Robo Battle Ground", "The requested coordinate has self-destructed or is out of bounds in the fight grid.");

  return (
    <PageWrapper>

      <div className="bg-forge text-text-primary h-screen w-full flex flex-col items-center justify-center text-center p-4 overflow-hidden relative">
        
        {/* Background radial highlight */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at center, rgba(255,69,0,0.06) 0%, transparent 60%)"
          }}
        />

        <div className="relative z-10 max-w-md space-y-6">
          
          {/* Animated 404 Number */}
          <motion.span
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              duration: 0.8 
            }}
            className="font-display text-[150px] md:text-[200px] text-fire block leading-none font-black select-none"
          >
            404
          </motion.span>

          <h2 className="font-display text-[clamp(28px,5vw,48px)] font-black uppercase text-text-primary tracking-wider">
            BOT NOT FOUND
          </h2>
          
          <p className="text-ash text-sm md:text-base leading-relaxed font-light">
            The page you're looking for self-destructed in the arena.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-fire hover:bg-[#cc3700] text-forge font-display text-xl uppercase tracking-wider transition-colors rounded-none"
          >
            <IconArrowLeft size={20} /> Return to Base
          </Link>

        </div>
      </div>
    </PageWrapper>
  );
}
