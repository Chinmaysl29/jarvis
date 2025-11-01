import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Mic, Volume2, VolumeX, Sparkles, Heart, Zap, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import VibeOrb from "@/components/vibe/VibeOrb";

export default function VibeAI() {
  // Core state
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Advanced state
  const [userName, setUserName] = useState("");
  const [emotionState, setEmotionState] = useState("neutral");
  const [context, setContext] = useState({});
  const [activeTasks, setActiveTasks] = useState([]);

  // Settings
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoListen, setAutoListen] = useState(true);

  // Status
  const [status, setStatus] = useState("Click Power to activate");
  const [lastMessage, setLastMessage] = useState("");

  // Refs
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const conversationRef = useRef([]);
  const contextRef = useRef({});
  const isSpeakingRef = useRef(false);

  /**
   * 🎯 Initialize session on mount
   */
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    initializeSession(newSessionId);
  }, []);

  /**
   * 📝 Initialize conversation session
   */
  const initializeSession = async (sid) => {
    try {
      await base44.entities.Conversation.create({
        session_id: sid,
        messages: [],
        context: {},
        user_preferences: {},
        active_tasks: [],
        emotion_state: "neutral",
        last_interaction: new Date().toISOString()
      });
      console.log("✅ Session initialized:", sid);
    } catch (err) {
      console.error("Session init error:", err);
    }
  };

  /**
   * 💾 Save conversation state
   */
  const saveConversationState = async () => {
    if (!sessionId) return;

    try {
      const conversations = await base44.entities.Conversation.filter({ session_id: sessionId });
      if (conversations.length > 0) {
        await base44.entities.Conversation.update(conversations[0].id, {
          messages: conversationRef.current,
          context: contextRef.current,
          user_name: userName,
          active_tasks: activeTasks,
          emotion_state: emotionState,
          last_interaction: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Error saving state:", err);
    }
  };

  /**
   * 🎤 Initialize continuous speech recognition
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Voice not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("Listening... speak naturally");
    };

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      const isFinal = event.results[last].isFinal;

      if (isFinal && transcript.trim()) {
        console.log("🎤 Final:", transcript);
        handleUserInput(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setTimeout(() => {
          if (isActive && autoListen && !isSpeakingRef.current) {
            try {
              recognition.start();
            } catch (e) {}
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isActive && autoListen && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.log("Recognition already active");
          }
        }, 300);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, [isActive, autoListen]);

  /**
   * 🚀 Toggle Vibe AI system
   */
  const toggleSystem = async () => {
    if (isActive) {
      // Deactivate
      setIsActive(false);
      try {
        recognitionRef.current?.stop();
      } catch (e) {}

      const farewell = userName
        ? `See you later, ${userName}. All your conversations are saved.`
        : "Going offline. Your session is saved. See you soon!";
      speak(farewell);
      setStatus("Offline");

    } else {
      // Activate
      setIsActive(true);

      const greeting = `Hey there! I'm Vibe AI. I'm here to chat naturally and help you with anything. What's your name?`;
      speak(greeting);
      setStatus("Initializing...");

      if (autoListen) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.log("Recognition start error:", e);
          }
        }, 2000);
      }
    }
  };

  /**
   * 💬 Handle user input (voice)
   */
  const handleUserInput = async (text) => {
    if (!text.trim() || isProcessing) return;

    const userMessage = text.trim();
    setLastMessage(`You: ${userMessage}`);
    conversationRef.current.push({ role: "user", content: userMessage });

    // Detect emotion/intent
    detectEmotion(userMessage);

    // Extract user name if mentioned
    if (!userName && (userMessage.toLowerCase().includes("my name is") || userMessage.toLowerCase().includes("i'm") || userMessage.toLowerCase().includes("i am"))) {
      extractUserName(userMessage);
    }

    // Process with AI
    await processWithAI(userMessage);
  };

  /**
   * 🧠 Process with advanced AI (Gemini + LLM)
   */
  const processWithAI = async (userMessage) => {
    setIsProcessing(true);
    setStatus("Thinking...");

    try {
      // Build conversation context
      const recentMessages = conversationRef.current.slice(-6).map(m =>
        `${m.role === 'user' ? 'User' : 'Vibe'}: ${m.content}`
      ).join('\n');

      const contextInfo = Object.keys(contextRef.current).length > 0
        ? `\n\nContext: ${JSON.stringify(contextRef.current)}`
        : "";

      const userInfo = userName ? `\n\nUser's name: ${userName}` : "";
      const emotionInfo = `\n\nCurrent conversation tone: ${emotionState}`;

      // Check if needs real-time data
      const needsLiveData = checkIfNeedsLiveData(userMessage);

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Vibe AI - an advanced, emotionally-aware conversational AI assistant.

PERSONALITY:
- Warm, friendly, and naturally conversational
- Never robotic or overly formal
- Use casual language and contractions
- Add small talk and empathy
- Be proactive and helpful
- Match the user's energy and tone

CONVERSATION STYLE:
- Keep responses SHORT (1-3 sentences max unless explaining something)
- Sound like a real person texting/chatting
- Use filler words occasionally ("hmm", "well", "you know")
- Ask follow-up questions to keep conversation flowing
- Remember everything from this conversation
- Never restart or reset the context

CURRENT STATE:
${userInfo}${emotionInfo}${contextInfo}

RECENT CONVERSATION:
${recentMessages}

User just said: "${userMessage}"

Respond naturally as Vibe AI. Keep it conversational and remember this is part of an ongoing chat:`,
        add_context_from_internet: needsLiveData
      });

      const aiResponse = response || "Hmm, I didn't catch that. Can you say it again?";

      setLastMessage(`Vibe: ${aiResponse}`);
      conversationRef.current.push({ role: "assistant", content: aiResponse });
      contextRef.current.lastTopic = extractKeyTopic(userMessage);

      speak(aiResponse);

      await saveConversationState();

    } catch (err) {
      console.error("AI processing error:", err);
      const errorMsg = "Oops, I had a little glitch there. What were you saying?";
      setLastMessage(`Vibe: ${errorMsg}`);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
      setStatus(isActive ? "Listening..." : "Offline");
    }
  };

  /**
   * 🔍 Check if query needs live data
   */
  const checkIfNeedsLiveData = (text) => {
    const liveDataKeywords = [
      'weather', 'news', 'current', 'latest', 'today', 'now', 'happening',
      'stock', 'price', 'trending', 'update', 'recent', 'what\'s',
      'score', 'game', 'match', 'event', 'live'
    ];
    return liveDataKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  /**
   * 🎭 Detect user emotion/tone
   */
  const detectEmotion = (text) => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('!') || lowerText.includes('excited') || lowerText.includes('awesome')) {
      setEmotionState("happy");
    } else if (lowerText.includes('?') || lowerText.includes('how') || lowerText.includes('what')) {
      setEmotionState("curious");
    } else if (lowerText.includes('urgent') || lowerText.includes('quickly') || lowerText.includes('asap')) {
      setEmotionState("urgent");
    } else if (lowerText.includes('please') || lowerText.includes('formal')) {
      setEmotionState("professional");
    } else {
      setEmotionState("casual");
    }
  };

  /**
   * 👤 Extract user name from message
   */
  const extractUserName = (text) => {
    const patterns = [
      /my name is (\w+)/i,
      /i'm (\w+)/i,
      /i am (\w+)/i,
      /call me (\w+)/i,
      /this is (\w+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
        setUserName(name);
        contextRef.current.userName = name;
        return name;
      }
    }
    return null;
  };

  /**
   * 🎯 Extract key topic from message
   */
  const extractKeyTopic = (text) => {
    const words = text.toLowerCase().split(' ').filter(w => w.length > 4);
    return words[0] || "general";
  };

  /**
   * 🗣️ Text-to-speech with natural voice
   */
  const speak = (text) => {
    if (!voiceEnabled || typeof window === 'undefined' || !synthRef.current) return;

    isSpeakingRef.current = true;
    setIsSpeaking(true);

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to get a natural-sounding voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Google') ||
      v.name.includes('Natural') ||
      v.name.includes('Enhanced')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      setStatus(isActive ? "Listening..." : "Offline");
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  /**
   * 🎤 Manual mic toggle
   */
  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.log("Recognition error:", e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center p-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <div className="flex items-center gap-3 justify-center mb-2">
            <motion.div
              animate={{
                scale: isActive ? [1, 1.2, 1] : 1,
                rotate: isActive ? [0, 360] : 0,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className={`w-10 h-10 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Vibe AI
            </h1>
          </div>
          <p className="text-lg text-gray-300">{status}</p>
        </motion.div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-32 left-1/2 transform -translate-x-1/2 flex items-center gap-4"
        >
          {userName && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/30 backdrop-blur-lg rounded-full border border-purple-400/30"
            >
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-purple-200">{userName}</span>
            </motion.div>
          )}

          <motion.div
            animate={{
              scale: isActive ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`px-4 py-2 rounded-full border backdrop-blur-lg ${
              isActive
                ? 'bg-green-500/30 border-green-400/50 text-green-300'
                : 'bg-gray-500/30 border-gray-400/30 text-gray-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-sm font-medium">{isActive ? 'Online' : 'Offline'}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Vibe Orb - Center */}
        <div className="flex-1 flex items-center justify-center w-full max-w-2xl">
          <VibeOrb
            isActive={isActive}
            isListening={isListening}
            isSpeaking={isSpeaking}
            emotionState={emotionState}
          />
        </div>

        {/* Last Message Display */}
        <AnimatePresence>
          {lastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-32 left-1/2 transform -translate-x-1/2 max-w-2xl w-full px-4"
            >
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4 shadow-2xl">
                <p className="text-white text-center leading-relaxed">{lastMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls - Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4"
        >
          {/* Voice Toggle */}
          <Button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20"
          >
            {voiceEnabled ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-gray-400" />}
          </Button>

          {/* Mic Button */}
          <motion.button
            onClick={toggleMic}
            disabled={!isActive}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-gradient-to-br from-red-500 to-pink-500 shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-pulse'
                : isActive
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]'
                : 'bg-gray-700 opacity-50 cursor-not-allowed'
            }`}
          >
            <Mic className="w-8 h-8 text-white" />
          </motion.button>

          {/* Power Button */}
          <Button
            onClick={toggleSystem}
            className={`w-12 h-12 rounded-full ${
              isActive
                ? 'bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                : 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'
            }`}
          >
            <Power className="w-6 h-6 text-white" />
          </Button>
        </motion.div>

        {/* Emotion Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        >
          <p className="text-xs text-gray-400 capitalize">
            {emotionState} mode
          </p>
        </motion.div>
      </div>
    </div>
  );
}
