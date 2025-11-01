import React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Animated Microphone Button Component
 * Shows different states: idle, listening, and processing
 * Features a glowing pulse animation when active
 */
export default function MicrophoneButton({ 
  isListening, 
  isProcessing, 
  onClick, 
  disabled 
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
        disabled 
          ? "bg-gray-700 cursor-not-allowed opacity-50"
          : isListening
          ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_50px_rgba(6,182,212,0.6)]"
          : "bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 shadow-lg"
      }`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={isListening ? {
        boxShadow: [
          "0 0 20px rgba(6,182,212,0.4)",
          "0 0 60px rgba(6,182,212,0.8)",
          "0 0 20px rgba(6,182,212,0.4)",
        ],
      } : {}}
      transition={{
        boxShadow: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      {/* Outer glow ring when listening */}
      {isListening && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-cyan-400"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Icon */}
      <div className="relative z-10">
        {isProcessing ? (
          <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-white animate-spin" />
        ) : isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </motion.div>
        ) : (
          <MicOff className="w-12 h-12 md:w-16 md:h-16 text-white" />
        )}
      </div>

      {/* Sound wave animation when listening */}
      {isListening && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-cyan-300 rounded-full"
              animate={{
                height: ["4px", "20px", "4px"],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}