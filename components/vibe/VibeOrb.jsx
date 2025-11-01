import React from "react";
import { motion } from "framer-motion";

/**
 * VibeOrb Component
 * Animated orb that responds to conversation state
 */
export default function VibeOrb({ isActive, isListening, isSpeaking, emotionState }) {
  const getOrbColor = () => {
    if (!isActive) return "from-gray-500 to-gray-600";
    if (isSpeaking) return "from-green-400 to-emerald-500";
    if (isListening) return "from-blue-400 to-cyan-500";
    if (emotionState === "happy") return "from-yellow-400 to-orange-500";
    if (emotionState === "curious") return "from-purple-400 to-pink-500";
    if (emotionState === "urgent") return "from-red-400 to-pink-500";
    return "from-purple-400 to-blue-500";
  };

  const getPulseIntensity = () => {
    if (isSpeaking) return 1.3;
    if (isListening) return 1.2;
    if (isActive) return 1.1;
    return 1.0;
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-white/10"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </>
      )}

      {/* Main orb */}
      <motion.div
        className={`w-48 h-48 rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl relative overflow-hidden`}
        animate={{
          scale: isActive ? [1, getPulseIntensity(), 1] : 1,
        }}
        transition={{
          duration: isSpeaking ? 0.5 : isListening ? 1 : 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {/* Inner energy core */}
        <motion.div
          className="absolute inset-4 rounded-full bg-white/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Energy particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
            }}
            animate={{
              rotate: 360,
              x: [0, 80, 0],
              y: [0, 0, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Emotion indicator */}
        {emotionState && isActive && (
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-white text-xs font-medium capitalize px-3 py-1 bg-black/20 rounded-full backdrop-blur-sm">
              {emotionState}
            </div>
          </motion.div>
        )}

        {/* Status text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            animate={{
              scale: isActive ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="text-white text-2xl font-bold mb-1">
              {isSpeaking ? "🗣️" : isListening ? "👂" : isActive ? "✨" : "💤"}
            </div>
            <div className="text-white/80 text-sm font-medium">
              {isSpeaking ? "Speaking" : isListening ? "Listening" : isActive ? "Active" : "Inactive"}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating elements */}
      {isActive && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
