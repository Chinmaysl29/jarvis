import React from "react";
import { motion } from "framer-motion";
import { Brain, Tag, Clock, TrendingUp, Database } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * Memory Display Component
 * Shows retrieved memories in an organized, visual format
 */
export default function MemoryDisplay({ memories, query, summary }) {
  if (!memories || memories.length === 0) return null;

  const getCategoryColor = (category) => {
    const colors = {
      personal_info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      preference: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      fact: "bg-green-500/20 text-green-400 border-green-500/30",
      conversation: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      command: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      real_time_data: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      learned_knowledge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    };
    return colors[category] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'personal_info': return '👤';
      case 'preference': return '⭐';
      case 'fact': return '📚';
      case 'conversation': return '💬';
      case 'command': return '⚙️';
      case 'real_time_data': return '🌐';
      case 'learned_knowledge': return '🧠';
      default: return '📝';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border-cyan-500/30 p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/20">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-cyan-400 font-semibold text-sm">Memory Recall</h3>
            <p className="text-gray-400 text-xs">
              Found {memories.length} relevant {memories.length === 1 ? 'memory' : 'memories'}
              {query && ` for: "${query}"`}
            </p>
          </div>
        </div>

        {/* Summary if provided */}
        {summary && (
          <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-cyan-400 font-semibold mb-1">Summary</p>
                <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Memories List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border ${getCategoryColor(memory.category)}`}
            >
              {/* Memory Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(memory.category)}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {memory.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {memory.importance && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{memory.importance}/10</span>
                    </div>
                  )}
                  {memory.access_count > 0 && (
                    <div className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      <span>{memory.access_count}x</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Memory Content */}
              <p className="text-sm text-gray-200 leading-relaxed mb-2">
                {memory.content}
              </p>

              {/* Memory Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {memory.tags && memory.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <Tag className="w-3 h-3 text-gray-400" />
                    {memory.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-700/50 rounded-full text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {memory.last_accessed && (
                  <div className="flex items-center gap-1 text-gray-400 ml-auto">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(memory.last_accessed).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Context if available */}
              {memory.context && (
                <div className="mt-2 pt-2 border-t border-gray-700/50">
                  <p className="text-xs text-gray-400 italic">
                    Context: {memory.context}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </motion.div>
  );
}