import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Sparkles } from "lucide-react";

export default function ConversationFlow({ conversation = [], isTyping = false, emotionState = "neutral" }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isTyping]);

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: "from-yellow-400 to-orange-400",
      curious: "from-blue-400 to-cyan-400",
      urgent: "from-red-400 to-pink-400",
      professional: "from-indigo-400 to-purple-400",
      casual: "from-purple-400 to-pink-400",
      neutral: "from-purple-400 to-pink-400"
    };
    return colors[emotion] || colors.neutral;
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <AnimatePresence>
        {conversation && conversation.length > 0 && conversation.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role !== "user" && (
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${getEmotionColor(emotionState)} flex items-center justify-center flex-shrink-0`}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg border border-white/20"
                  : msg.role === "system"
                  ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30"
                  : "bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-lg border border-white/20"
              } shadow-xl`}
            >
              <p className="text-white leading-relaxed">
                {msg.content}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>

            {msg.role === "user" && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${getEmotionColor(emotionState)} flex items-center justify-center`}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-lg border border-white/20 rounded-2xl px-5 py-3">
            <div className="flex gap-2">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-white rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-white rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-white rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}

      <div ref={endRef} />
    </div>
  );
}