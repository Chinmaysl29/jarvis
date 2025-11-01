import React from 'react';
import { motion } from 'framer-motion';

export default function IronManHologram({ isListening, isActive }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
        animate={{
          scale: isActive ? [1, 1.1, 1] : 1,
          opacity: isActive ? [0.3, 0.6, 0.3] : 0.1,
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut"
        }}
      />

      {/* Inner glow ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-cyan-300/50"
        animate={{
          scale: isListening ? [1, 1.05, 1] : 1,
          opacity: isListening ? [0.5, 0.8, 0.5] : 0.2,
        }}
        transition={{
          duration: 1.5,
          repeat: isListening ? Infinity : 0,
          ease: "easeInOut"
        }}
      />

      {/* Main hologram circle */}
      <motion.div
        className="relative w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm border border-cyan-400/40 flex items-center justify-center"
        animate={{
          boxShadow: isActive
            ? [
                '0 0 20px rgba(6, 182, 212, 0.3)',
                '0 0 40px rgba(6, 182, 212, 0.6)',
                '0 0 20px rgba(6, 182, 212, 0.3)'
              ]
            : '0 0 10px rgba(6, 182, 212, 0.1)',
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* JARVIS Text */}
        <motion.div
          className="text-center"
          animate={{
            scale: isListening ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isListening ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <motion.h2
            className="text-4xl font-bold text-cyan-400 mb-2 tracking-wider"
            animate={{
              textShadow: isActive
                ? [
                    '0 0 10px rgba(6, 182, 212, 0.5)',
                    '0 0 20px rgba(6, 182, 212, 0.8)',
                    '0 0 10px rgba(6, 182, 212, 0.5)'
                  ]
                : 'none',
            }}
            transition={{
              duration: 2,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            JARVIS
          </motion.h2>

          <motion.p
            className="text-sm text-cyan-300/80 font-mono"
            animate={{
              opacity: isActive ? [0.7, 1, 0.7] : 0.5,
            }}
            transition={{
              duration: 3,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {isActive ? "ACTIVE" : "STANDBY"}
          </motion.p>
        </motion.div>

        {/* Scanning lines */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: [
                'conic-gradient(from 0deg, transparent 0deg, rgba(6, 182, 212, 0.1) 90deg, transparent 180deg)',
                'conic-gradient(from 360deg, transparent 0deg, rgba(6, 182, 212, 0.1) 90deg, transparent 180deg)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}

        {/* Pulse effect when listening */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-300"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Floating particles */}
      {isActive && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                marginLeft: '-0.5px',
                marginTop: '-0.5px',
              }}
              animate={{
                x: Math.cos((i * 45 * Math.PI) / 180) * 150,
                y: Math.sin((i * 45 * Math.PI) / 180) * 150,
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
