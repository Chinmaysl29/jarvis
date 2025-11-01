import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Conversation History Component
 * Displays the full conversation log between user and AI
 * Shows messages with different styling for user vs AI
 */
export default function ConversationHistory({ conversation = [], onClear }) {
  if (!conversation || conversation.length === 0) {
    return null;
  }

  return (
    <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-cyan-400 uppercase tracking-wider">
          Conversation History
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.type === "ai" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.type === "user"
                    ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white"
                    : "bg-slate-800/80 text-gray-100 border border-blue-500/20"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>

              {msg.type === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </Card>
  );
}