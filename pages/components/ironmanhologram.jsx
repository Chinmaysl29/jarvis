import React from "react";
import { motion } from "framer-motion";

/**
 * Iron Man Holographic Display Component
 * Shows Iron Man helmet image with spinning arc reactor heart
 */
export default function IronManHologram({ isListening, isActive }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Iron Man Helmet Background Image */}
      <div className="relative z-10 w-full max-w-2xl aspect-square flex items-center justify-center">
        <motion.img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690252188bb668897a21a391/581c8d34d_Gemini_Generated_Image_8zpv4s8zpv4s8zpv.png"
          alt="Iron Man Helmet"
          className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(6,182,212,0.4)]"
          animate={{
            opacity: isActive ? 1 : 0.3,
            filter: isActive 
              ? "drop-shadow(0 0 40px rgba(6,182,212,0.6))" 
              : "drop-shadow(0 0 10px rgba(6,182,212,0.2))"
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Spinning Arc Reactor Heart - positioned at chest/neck area */}
        <div className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ 
              rotate: isActive ? 360 : 0,
              scale: isListening ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: isActive ? 3 : 0, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
            className="relative"
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: isListening
                  ? [
                      "0 0 20px 10px rgba(6,182,212,0.3)",
                      "0 0 40px 20px rgba(6,182,212,0.6)",
                      "0 0 20px 10px rgba(6,182,212,0.3)"
                    ]
                  : isActive
                  ? "0 0 15px 8px rgba(6,182,212,0.2)"
                  : "0 0 5px 2px rgba(6,182,212,0.1)"
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Arc Reactor SVG - Spinning Heart */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="reactorGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <radialGradient id="reactorGradient">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0891b2" />
                </radialGradient>
              </defs>

              {/* Outer ring */}
              <circle
                cx="60"
                cy="60"
                r="55"
                stroke="#06b6d4"
                strokeWidth="2"
                fill="none"
                opacity={isActive ? 0.6 : 0.2}
              />

              {/* Middle technical ring */}
              <circle
                cx="60"
                cy="60"
                r="45"
                stroke="#0ea5e9"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8 4"
                opacity={isActive ? 1 : 0.3}
              />

              {/* Inner ring */}
              <circle
                cx="60"
                cy="60"
                r="35"
                stroke="#06b6d4"
                strokeWidth="2"
                fill="none"
                opacity={isActive ? 1 : 0.3}
              />

              {/* Core circle with gradient */}
              <circle
                cx="60"
                cy="60"
                r="28"
                fill="url(#reactorGradient)"
                filter="url(#reactorGlow)"
                opacity={isActive ? 0.9 : 0.3}
              />

              {/* Bright center */}
              <circle
                cx="60"
                cy="60"
                r="18"
                fill="#22d3ee"
                filter="url(#reactorGlow)"
                opacity={isActive ? 1 : 0.3}
              />

              {/* Center core */}
              <circle
                cx="60"
                cy="60"
                r="10"
                fill="#ffffff"
                opacity={isActive ? 0.8 : 0.2}
              />

              {/* Triangular blades/segments - 8 directions */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                <g key={index} transform={`rotate(${angle} 60 60)`}>
                  <path
                    d="M 60 30 L 65 50 L 55 50 Z"
                    fill="#06b6d4"
                    opacity={isActive ? 0.8 : 0.2}
                  />
                  <line
                    x1="60"
                    y1="30"
                    x2="60"
                    y2="15"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    opacity={isActive ? 1 : 0.2}
                  />
                </g>
              ))}

              {/* Secondary ring details */}
              <circle
                cx="60"
                cy="60"
                r="40"
                stroke="#06b6d4"
                strokeWidth="1"
                fill="none"
                strokeDasharray="2 3"
                opacity={isActive ? 0.4 : 0.1}
              />
            </svg>

            {/* Pulsing inner glow */}
            {isActive && (
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0.3, 0.6]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ filter: "blur(20px)" }}
              />
            )}
          </motion.div>
        </div>

        {/* Energy particles emanating from arc reactor */}
        {isListening && isActive && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-[15%] left-1/2 w-2 h-2 bg-cyan-400 rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0,
                  opacity: 1,
                  scale: 1
                }}
                animate={{
                  x: Math.cos((i * 45) * Math.PI / 180) * 100,
                  y: Math.sin((i * 45) * Math.PI / 180) * 100,
                  opacity: 0,
                  scale: 0.5
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Holographic scan line effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent pointer-events-none"
          style={{ height: "100%" }}
          animate={{
            y: ["-100%", "200%"]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
    </div>
  );
}