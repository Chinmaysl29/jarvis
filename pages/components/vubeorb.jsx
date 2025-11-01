import React from "react";
import { motion } from "framer-motion";

export default function VibeOrb({ isActive, isListening, isSpeaking, emotionState }) {
  const getEmotionColors = (emotion) => {
    const colors = {
      happy: { primary: "#FCD34D", secondary: "#FB923C" },
      curious: { primary: "#60A5FA", secondary: "#22D3EE" },
      urgent: { primary: "#F87171", secondary: "#FB7185" },
      professional: { primary: "#818CF8", secondary: "#A78BFA" },
      casual: { primary: "#C084FC", secondary: "#E879F9" },
      neutral: { primary: "#A78BFA", secondary: "#E879F9" }
    };
    return colors[emotion] || colors.neutral;
  };

  const colors = getEmotionColors(emotionState);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer rings */}
      <motion.div
        animate={{
          scale: isListening ? [1, 1.3, 1] : isSpeaking ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.3, 0.6, 0.3] : 0.1,
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute w-96 h-96 rounded-full border-2 border-purple-400/30"
      />
      
      <motion.div
        animate={{
          scale: isListening ? [1, 1.5, 1] : isSpeaking ? [1, 1.4, 1] : 1,
          opacity: isActive ? [0.2, 0.4, 0.2] : 0.05,
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-[32rem] h-[32rem] rounded-full border border-pink-400/20"
      />

      {/* Main orb */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.15, 1] : isListening ? [1, 1.1, 1] : isActive ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="relative w-64 h-64"
      >
        {/* Gradient orb */}
        <motion.div
          animate={{
            background: isActive
              ? [
                  `radial-gradient(circle, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  `radial-gradient(circle, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                  `radial-gradient(circle, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                ]
              : "radial-gradient(circle, #4B5563 0%, #1F2937 100%)",
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-full h-full rounded-full shadow-2xl"
          style={{
            boxShadow: isActive
              ? `0 0 60px ${colors.primary}80, 0 0 100px ${colors.secondary}60`
              : "0 0 20px rgba(0,0,0,0.5)",
          }}
        />

        {/* Inner glow */}
        <motion.div
          animate={{
            scale: isSpeaking ? [1, 1.3, 1] : [1, 1.2, 1],
            opacity: isActive ? [0.4, 0.8, 0.4] : 0,
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.primary}60 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />

        {/* Voice waves */}
        {(isListening || isSpeaking) && (
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-1 rounded-full"
                style={{ backgroundColor: colors.primary }}
                animate={{
                  scaleX: [0.5, 1.5, 0.5],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}

        {/* Particles */}
        {isActive && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? colors.primary : colors.secondary,
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: Math.cos((i * 30 * Math.PI) / 180) * 120,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 120,
                  scale: [1, 1.5, 0],
                  opacity: [1, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Status text */}
      <motion.div
        animate={{ opacity: isActive ? 1 : 0.3 }}
        className="absolute bottom-10 text-center"
      >
        <p className="text-lg font-semibold text-white">
          {isSpeaking ? "Speaking..." : isListening ? "Listening..." : isActive ? "Ready to chat" : "Offline"}
        </p>
        <p className="text-sm text-gray-400 mt-1 capitalize">
          {emotionState} mode
        </p>
      </motion.div>
    </div>
  );
}