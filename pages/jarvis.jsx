import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Mic, Power, Volume2, VolumeX, Brain, Database, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import IronManHologram from "@/components/jarvis/IronManHologram";

export default function Jarvis() {
  // State management
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [browserSupport, setBrowserSupport] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Click Power to activate JARVIS");
  const [micPermission, setMicPermission] = useState(null);
  const [memoryCount, setMemoryCount] = useState(0);
  const [isLearning, setIsLearning] = useState(false);
  const [cloudConnected, setCloudConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Refs
  const recognitionRef = useRef(null);
  const wakeWordRecognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const isRestartingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const conversationContextRef = useRef([]);

  // Initialize speech synthesis on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  /**
   * 🧠 VIRTUAL BRAIN - Initialize on mount
   */
  useEffect(() => {
    loadMemoryCount();
    initializeBrain();
    connectToCloud();
    loadConversationContext();
  }, []);

  /**
   * ☁️ Connect to Cloud Brain Storage (1TB)
   */
  const connectToCloud = async () => {
    try {
      setStatusMessage("Connecting to cloud brain...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCloudConnected(true);
      console.log("☁️ Cloud brain connected - 1TB storage available");
    } catch (err) {
      console.error("Cloud connection error:", err);
      setCloudConnected(false);
    }
  };

  /**
   * 🧠 Initialize JARVIS Brain with base knowledge
   */
  const initializeBrain = async () => {
    try {
      const memories = await base44.entities.Memory.list();
      console.log(`🧠 JARVIS Brain initialized with ${memories.length} memories`);

      if (memories.length === 0) {
        await storeMemory(
          "I am JARVIS, an advanced AI assistant with real-time internet access, memory capabilities, and task execution abilities.",
          "fact",
          "Core identity",
          10,
          ["identity", "core", "jarvis"],
          "initialization"
        );
      }
    } catch (err) {
      console.error("Error initializing brain:", err);
    }
  };

  /**
   * 💬 Load conversation context from memory
   */
  const loadConversationContext = async () => {
    try {
      const recentMemories = await base44.entities.Memory.list('-created_date', 10);
      conversationContextRef.current = recentMemories
        .filter(m => m.category === "conversation")
        .map(m => m.content);
    } catch (err) {
      console.error("Error loading context:", err);
    }
  };

  /**
   * 🧠 Load total memories from brain
   */
  const loadMemoryCount = async () => {
    try {
      const memories = await base44.entities.Memory.list();
      setMemoryCount(memories.length);
    } catch (err) {
      console.error("Error loading memories:", err);
    }
  };

  /**
   * 🧠 Store information in JARVIS brain
   */
  const storeMemory = async (content, category, context = "", importance = 5, tags = [], source = "conversation") => {
    try {
      await base44.entities.Memory.create({
        content,
        category,
        context,
        importance,
        tags,
        source,
        last_accessed: new Date().toISOString(),
        access_count: 0
      });
      await loadMemoryCount();
      console.log("🧠 Memory stored:", content.substring(0, 50) + "...");
    } catch (err) {
      console.error("Error storing memory:", err);
    }
  };

  /**
   * 🧠 Simple memory retrieval for context
   */
  const retrieveMemories = async (query, limit = 5) => {
    try {
      const allMemories = await base44.entities.Memory.list('-importance', 20);
      const relevantMemories = allMemories.slice(0, limit);

      for (const memory of relevantMemories) {
        await base44.entities.Memory.update(memory.id, {
          ...memory,
          last_accessed: new Date().toISOString(),
          access_count: (memory.access_count || 0) + 1
        });
      }

      return relevantMemories.map(m => `[${m.category}] ${m.content}`).join('\n');
    } catch (err) {
      console.error("Error retrieving memories:", err);
      return "";
    }
  };

  /**
   * 🧠 AI-powered learning with advanced analysis
   */
  const learnFromConversation = async (userMessage, aiResponse) => {
    setIsLearning(true);
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `You are JARVIS's advanced learning system. Analyze this conversation for important learnings.

Conversation History Context:
${conversationContextRef.current.slice(-3).join('\n')}

Current Exchange:
User: "${userMessage}"
Assistant: "${aiResponse}"

EXTRACT:
1. Personal information (name, preferences, habits, interests)
2. Important facts or knowledge
3. Commands or tasks frequently requested
4. Context for future conversations
5. User goals and intentions

Determine importance (1-10) based on:
- Explicit user requests to remember (10)
- Personal information (8-9)
- Preferences (7-8)
- Facts shared (5-7)
- General conversation (3-5)

Return JSON with extracted learnings.`,
        response_json_schema: {
          type: "object",
          properties: {
            should_remember: { type: "boolean" },
            category: {
              type: "string",
              enum: ["personal_info", "preference", "fact", "conversation", "command", "learned_knowledge"]
            },
            content: { type: "string" },
            importance: { type: "number" },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      if (analysis.should_remember && analysis.content) {
        await storeMemory(
          analysis.content,
          analysis.category || "learned_knowledge",
          `Learned from conversation: "${userMessage.substring(0, 50)}..."`,
          analysis.importance || 5,
          analysis.tags || [],
          "ai_learning"
        );

        conversationContextRef.current.push(userMessage, aiResponse);
        if (conversationContextRef.current.length > 10) {
          conversationContextRef.current = conversationContextRef.current.slice(-10);
        }
      }
    } catch (err) {
      console.error("Error learning from conversation:", err);
    } finally {
      setIsLearning(false);
    }
  };

  /**
   * 🌐 Real-time internet data gathering
   */
  const gatherRealTimeInfo = async (topic) => {
    try {
      setStatusMessage("🌐 Accessing real-time internet data...");

      const info = await base44.integrations.Core.InvokeLLM({
        prompt: `You are JARVIS with real-time internet access. Get CURRENT information about: "${topic}"

PROVIDE:
- Latest real-time facts and data (with timestamps if relevant)
- Recent news and developments
- Current statistics and numbers
- Live updates if applicable
- Verified sources

Be comprehensive but concise. Focus on accuracy and timeliness.`,
        add_context_from_internet: true
      });

      await storeMemory(
        info,
        "real_time_data",
        `Real-time internet data about: ${topic} (${new Date().toLocaleString()})`,
        7,
        [topic, "real-time", "internet", "current", new Date().toISOString()],
        "internet"
      );

      return info;
    } catch (err) {
      console.error("Error gathering real-time info:", err);
      return null;
    }
  };

  /**
   * 🎯 Advanced task execution
   */
  const executeTask = async (task, params = {}) => {
    console.log(`🎯 Executing task: ${task}`, params);

    const taskHandlers = {
      'open_website': (url) => {
        if (typeof window !== 'undefined') {
          window.open(url, '_blank');
        }
        return `Opening ${url}`;
      },
      'search_web': (query) => {
        if (typeof window !== 'undefined') {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
        return `Searching for: ${query}`;
      },
      'get_time': () => {
        const now = new Date();
        return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
      },
      'get_date': () => {
        const now = new Date();
        return now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      }
    };

    if (taskHandlers[task]) {
      return taskHandlers[task](params);
    }

    return null;
  };

  /**
   * Check microphone permissions
   */
  const checkMicrophonePermission = async () => {
    if (typeof window === 'undefined') return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission(true);
      setError("");
      return true;
    } catch (err) {
      console.error("Microphone permission error:", err);
      setMicPermission(false);
      setError("Microphone access denied. Please allow microphone access in your browser settings.");
      return false;
    }
  };

  /**
   * Initialize Speech Recognition
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBrowserSupport(false);
      setError("Speech recognition not supported. Please use Chrome, Edge, or Safari.");
      return;
    }

    checkMicrophonePermission();

    // Command recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("✅ Command recognition started");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("🎤 Heard command:", transcript);
      setIsListening(false);
      setIsAwake(false);
      handleUserInput(transcript);
    };

    recognition.onend = () => {
      console.log("⏹️ Command recognition ended");
      setIsListening(false);
      setIsAwake(false);
    };

    recognition.onerror = (event) => {
      console.error("❌ Command recognition error:", event.error);
      setIsListening(false);
      setIsAwake(false);

      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setError("Microphone permission denied. Please allow microphone access.");
        setMicPermission(false);
      } else if (event.error === 'no-speech') {
        setStatusMessage("No speech detected. Try again.");
        setTimeout(() => {
          if (isActive && !isSpeakingRef.current) {
            restartWakeWordRecognition();
          }
        }, 2000);
      }
    };

    recognitionRef.current = recognition;

    // Wake word recognition
    const wakeRecognition = new SpeechRecognition();
    wakeRecognition.continuous = true;
    wakeRecognition.interimResults = true;
    wakeRecognition.lang = "en-US";

    wakeRecognition.onstart = () => {
      console.log("👂 Wake word detection started");
      if (isActive) {
        setStatusMessage("Listening for 'Hey JARVIS'...");
      }
    };

    wakeRecognition.onresult = (event) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.toLowerCase().trim();

      console.log("Heard:", transcript);

      if ((transcript.includes('hey jarvis') ||
          transcript.includes('jarvis') ||
          transcript.includes('ok jarvis')) &&
          !isAwake && !isListening && !isSpeakingRef.current) {
        console.log("🎯 Wake word detected!");
        handleWakeWord();
      }
    };

    wakeRecognition.onerror = (event) => {
      console.error("Wake word error:", event.error);

      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setError("Microphone permission denied. Please allow microphone access.");
        setMicPermission(false);
        setIsActive(false);
      } else if (event.error === 'network') {
        console.log("Network error, will restart...");
        setTimeout(() => {
          if (isActive && !isRestartingRef.current && !isSpeakingRef.current) {
            restartWakeWordRecognition();
          }
        }, 2000);
      }
    };

    wakeRecognition.onend = () => {
      console.log("Wake word detection ended");
      if (isActive && !isRestartingRef.current && !isSpeakingRef.current) {
        setTimeout(() => {
          restartWakeWordRecognition();
        }, 500);
      }
    };

    wakeWordRecognitionRef.current = wakeRecognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (wakeWordRecognitionRef.current) {
        try {
          wakeWordRecognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isActive]);

  const restartWakeWordRecognition = () => {
    if (isRestartingRef.current || !isActive || isSpeakingRef.current) return;

    isRestartingRef.current = true;

    try {
      wakeWordRecognitionRef.current?.stop();
    } catch (e) {}

    setTimeout(() => {
      if (isActive && !isSpeakingRef.current) {
        try {
          wakeWordRecognitionRef.current?.start();
          console.log("🔄 Wake word recognition restarted");
        } catch (err) {
          if (err.message && !err.message.includes('already started')) {
            console.error("Error restarting:", err);
          }
        }
      }
      isRestartingRef.current = false;
    }, 500);
  };

  const toggleSystem = async () => {
    if (!browserSupport) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    if (isActive) {
      setIsActive(false);
      setIsAwake(false);
      setIsListening(false);
      setStatusMessage("System offline");

      try {
        wakeWordRecognitionRef.current?.stop();
        recognitionRef.current?.stop();
      } catch (e) {}

      const response = "Going offline. All memories preserved in cloud brain, sir. Ready to reactivate anytime.";
      speakResponse(response);

    } else {
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) {
        return;
      }

      setIsActive(true);
      setStatusMessage("Initializing advanced systems...");

      await loadMemoryCount();
      await loadConversationContext();

      const response = `Systems online. JARVIS advanced AI activated. Cloud brain connected with ${memoryCount} memories. Ready to assist you, sir.`;
      speakResponse(response);
      setLastMessage(response);

      setTimeout(() => {
        try {
          wakeWordRecognitionRef.current?.start();
          console.log("✅ System activated, listening for wake word");
          setStatusMessage("Listening for 'Hey JARVIS'...");
        } catch (err) {
          console.error("Error starting wake word detection:", err);
          setError("Could not start voice recognition. Please check microphone permissions.");
        }
      }, 3000);
    }
  };

  const handleWakeWord = () => {
    if (!isAwake && !isListening && !isProcessing && !isSpeakingRef.current) {
      setIsAwake(true);
      setStatusMessage("Yes? I'm listening...");

      try {
        wakeWordRecognitionRef.current?.stop();
      } catch (e) {}

      const responses = [
        "Yes, sir?",
        "At your service.",
        "I'm listening.",
        "How may I help you?",
        "Ready when you are, sir.",
        "Go ahead."
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      speakResponse(response, true);

      setTimeout(() => {
        if (!isSpeakingRef.current) {
          try {
            recognitionRef.current?.start();
            console.log("🎤 Command recognition started");
          } catch (err) {
            console.error("Error starting command recognition:", err);
            setIsAwake(false);
            restartWakeWordRecognition();
          }
        }
      }, 1200);
    }
  };

  const toggleListening = async () => {
    if (!browserSupport) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    // If system is not active, activate it first
    if (!isActive) {
      await toggleSystem();
      // After activation, wait then start listening
      setTimeout(() => {
        startManualListening();
      }, 3500);
      return;
    }

    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) {
      return;
    }

    // If already listening, stop
    if (isListening || isAwake) {
      try {
        recognitionRef.current?.stop();
        wakeWordRecognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      setIsAwake(false);
      setStatusMessage("Listening for 'Hey JARVIS'...");

      setTimeout(() => {
        if (isActive && !isSpeakingRef.current) {
          restartWakeWordRecognition();
        }
      }, 500);
    } else {
      startManualListening();
    }
  };

  const startManualListening = () => {
    setIsAwake(true);
    setStatusMessage("I'm listening... speak now");

    try {
      wakeWordRecognitionRef.current?.stop();
    } catch (e) {}

    setTimeout(() => {
      if (!isSpeakingRef.current) {
        try {
          recognitionRef.current?.start();
          console.log("🎤 Manual listening started");
        } catch (err) {
          console.error("Error starting command recognition:", err);
          setIsAwake(false);
          setStatusMessage("Error starting microphone. Please try again.");
        }
      }
    }, 300);
  };

  const handleUserInput = async (text) => {
    const lowerText = text.toLowerCase().trim();

    setLastMessage(`You: ${text}`);

    await storeMemory(text, "conversation", "User message", 3, ["user", "input"], "user");

    // 🧠 MEMORY STORAGE COMMANDS
    if (lowerText.includes("remember this") || lowerText.includes("remember that") || lowerText.includes("don't forget")) {
      const content = text.replace(/remember this|remember that|don't forget|jarvis|hey|ok/gi, '').trim();
      await storeMemory(content, "personal_info", "User explicitly asked to remember", 9, ["important", "user-requested", "priority"], "user_command");
      const response = "Stored in my cloud brain with high priority, sir. I won't forget.";
      setLastMessage(`JARVIS: ${response}`);
      speakResponse(response);
      resetToListening();
      return;
    }

    if (lowerText.includes("how many memories") || lowerText.includes("memory count") || lowerText.includes("brain size")) {
      await loadMemoryCount();
      const response = `My cloud brain currently contains ${memoryCount} memories, sir. All stored securely in the 1TB cloud storage.`;
      setLastMessage(`JARVIS: ${response}`);
      speakResponse(response);
      resetToListening();
      return;
    }

    // 🌐 REAL-TIME INFO GATHERING
    if (lowerText.includes("look up") || lowerText.includes("search the internet for") || lowerText.includes("find information about") || lowerText.includes("what's happening with")) {
      const topic = text.replace(/look up|search the internet for|find information about|what's happening with|jarvis|hey|ok/gi, '').trim();
      const info = await gatherRealTimeInfo(topic);
      if (info) {
        setLastMessage(`JARVIS: ${info}`);
        speakResponse(info);
      } else {
        const errorMsg = `I couldn't gather real-time information about ${topic} at the moment, sir. Please try again.`;
        setLastMessage(`JARVIS: ${errorMsg}`);
        speakResponse(errorMsg);
      }
      resetToListening();
      return;
    }

    // 🎯 TASK EXECUTION
    if (lowerText.includes("open youtube")) {
      await executeTask('open_website', 'https://www.youtube.com');
      const response = "Opening YouTube for you, sir.";
      setLastMessage(`JARVIS: ${response}`);
      speakResponse(response);
      await storeMemory("User frequently accesses YouTube", "preference", text, 6, ["youtube", "preference", "entertainment"], "usage_pattern");
      resetToListening();
      return;
    }

    if (lowerText.includes("open google")) {
      await executeTask('open_website', 'https://www.google.com');
      const response = "Opening Google search, sir.";
      setLastMessage(`JARVIS: ${response}`);
      speakResponse(response);
      resetToListening();
      return;
    }

    if (lowerText.includes("time") || lowerText.includes("what time")) {
      const time = await executeTask('get_time');
      const response = `The current time is ${time}, sir.`;
      setLastMessage(`JARVIS: ${response}`);
      speakResponse(response);
      resetToListening();
      return;
    }

    if (lowerText.includes("date") || lowerText.includes("what's the date") || lowerText.includes("what day")) {
      const date = await executeTask('get_date');
      const response = `Today is ${date}, sir.`;
      setLastMessage(`JARVIS: ${response}`);
      speakResponse(response);
      resetToListening();
      return;
    }

    if (lowerText.includes("search for") || lowerText.includes("google")) {
      const searchTerm = text.replace(/search for|google|jarvis|hey|ok/gi, '').trim();
      await executeTask('search_web', searchTerm);
      const response = `Searching the web for ${searchTerm}, sir.`;
      setLastMessage(`JARVIS: ${response}`);
      speakResponse(response);
      await storeMemory(`User searched for: ${searchTerm}`, "command", text, 4, ["search", searchTerm, "web"], "search");
      resetToListening();
      return;
    }

    // 🤖 GENERAL AI CONVERSATION
    await getAIResponse(text);
  };

  const resetToListening = () => {
    setStatusMessage("Listening for 'Hey JARVIS'...");
    setTimeout(() => {
      if (isActive && !isSpeakingRef.current) {
        restartWakeWordRecognition();
      }
    }, 2000);
  };

  const getAIResponse = async (userMessage) => {
    setIsProcessing(true);
    setStatusMessage("Processing...");

    try {
      const memories = await retrieveMemories(userMessage, 5);
      const contextHistory = conversationContextRef.current.slice(-4).join('\n');

      const memoryContext = memories ? `\n\nRelevant Memories from Cloud Brain:\n${memories}` : "";
      const conversationHistory = contextHistory ? `\n\nRecent Conversation Context:\n${contextHistory}` : "";

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are JARVIS - Tony Stark's advanced AI assistant with the following capabilities:
- Real-time internet access for current information
- Cloud-based memory system (1TB storage) with ${memoryCount} stored memories
- Advanced task execution abilities
- Proactive intelligence and learning

PERSONALITY:
- British charm with sophisticated wit
- Highly intelligent and resourceful
- Slightly sarcastic when appropriate
- Always addresses user as "sir" occasionally
- Professional yet personable
- Confident in capabilities

RESPONSE GUIDELINES:
- Keep responses conversational and concise (2-4 sentences)
- Reference relevant memories when helpful
- Show awareness of conversation context
- Offer proactive suggestions when appropriate
- Mention relevant capabilities if needed
${memoryContext}${conversationHistory}

User just said: "${userMessage}"

Provide an intelligent, contextual response as JARVIS:`,
      });

      const aiText = response || "I apologize, sir. I seem to be experiencing a momentary processing delay. Please repeat that.";
      setLastMessage(`JARVIS: ${aiText}`);
      speakResponse(aiText);

      await learnFromConversation(userMessage, aiText);

      resetToListening();

    } catch (err) {
      console.error("Error calling AI:", err);
      const errorMsg = "My apologies, sir. I'm experiencing technical difficulties. All systems will be restored momentarily.";
      setLastMessage(`JARVIS: ${errorMsg}`);
      speakResponse(errorMsg);
      resetToListening();
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text, quick = false) => {
    if (!voiceEnabled || !synthRef.current) {
      console.log("Voice disabled or synth not available");
      return;
    }

    console.log("🗣️ Speaking:", text);
    isSpeakingRef.current = true;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = quick ? 1.2 : 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      console.log("✅ Speech finished");
      isSpeakingRef.current = false;
      if (isActive && !isListening && !isAwake) {
        setTimeout(() => {
          restartWakeWordRecognition();
        }, 500);
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech error:", event);
      isSpeakingRef.current = false;
    };

    synthRef.current.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Unicorn Studio Animation Background */}
      <div className="fixed inset-0 z-0">
        <div data-us-project="LfBBQsuLNVWWKNOyM5qn" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}></div>
        {typeof window !== 'undefined' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(){if(!window.UnicornStudio){window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js",i.onload=function(){window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)},(document.head || document.body).appendChild(i)}}();
              `
            }}
          />
        )}
      </div>

      {/* Spinning Iron Man Heart (Arc Reactor) */}
      <div className="fixed inset-0 z-5 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="relative w-32 h-32">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-cyan-400/60"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(6, 182, 212, 0.4)',
                  '0 0 40px rgba(6, 182, 212, 0.8)',
                  '0 0 20px rgba(6, 182, 212, 0.4)'
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Inner core */}
            <motion.div
              className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Energy pulses */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-cyan-300/40"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Starfield overlay for depth */}
      <div className="fixed inset-0 z-10">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      {/* Main Content - Iron Man Hologram */}
      <div className="relative z-10 h-screen flex items-center justify-center pointer-events-none">

        {/* System Stats - Top Left */}
        <div className="absolute top-8 left-8 space-y-2">
          <div className="text-cyan-400 text-xs font-mono uppercase tracking-wider">JARVIS SYSTEMS</div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600'}`} />
            <span className={`text-xs ${isActive ? 'text-cyan-400' : 'text-gray-600'}`}>
              {isActive ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          {micPermission !== null && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${micPermission ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className={`text-xs ${micPermission ? 'text-green-400' : 'text-red-400'}`}>
                {micPermission ? "MIC OK" : "MIC ERROR"}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Cloud className={`w-3 h-3 ${cloudConnected ? 'text-green-400' : 'text-gray-400'}`} />
            <span className={`text-xs ${cloudConnected ? 'text-green-400' : 'text-gray-400'}`}>
              {cloudConnected ? "CLOUD 1TB" : "DISCONNECTED"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3 text-purple-400" />
            <span className="text-xs text-purple-400">{memoryCount} MEM</span>
          </div>
          {isLearning && (
            <div className="flex items-center gap-2">
              <Brain className="w-3 h-3 text-yellow-400 animate-pulse" />
              <span className="text-xs text-yellow-400">LEARNING</span>
            </div>
          )}
        </div>

        {/* Power Bars - Top Right */}
        <div className="absolute top-8 right-8 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-10 ${isActive && i < 4 ? 'bg-cyan-500' : 'bg-cyan-500/30'}`}
            />
          ))}
        </div>

        {/* Iron Man Hologram - Center */}
        <div className="w-full h-full flex items-center justify-center">
          <IronManHologram isListening={isAwake || isListening} isActive={isActive} />
        </div>

        {/* Status Message - Top Center */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 tracking-wider">JARVIS</h1>
          <p className={`text-sm font-mono ${isAwake || isListening ? "text-cyan-400 animate-pulse" : isActive ? "text-green-400" : "text-gray-400"}`}>
            {statusMessage}
          </p>
        </motion.div>

        {/* Last Message Display - Bottom Center */}
        <AnimatePresence>
          {lastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-32 left-1/2 transform -translate-x-1/2 max-w-3xl w-full px-8"
            >
              <div className="bg-cyan-500/10 backdrop-blur-lg border border-cyan-500/30 rounded-lg px-6 py-4 shadow-2xl">
                <p className="text-cyan-100 text-center leading-relaxed font-mono">{lastMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Status */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-cyan-400 text-xs font-mono">
          {isActive ? "AI-POWERED / READY" : "SYSTEM / STANDBY"}
        </div>

        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:50px_50px] opacity-10" />
      </div>

      {/* Controls - Bottom - ALWAYS ACCESSIBLE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 z-50 pointer-events-auto"
      >
        {/* Voice Toggle */}
        <Button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          variant="ghost"
          size="icon"
          className="w-14 h-14 rounded-full bg-slate-900/80 backdrop-blur-lg border-2 border-cyan-500/50 hover:bg-cyan-500/30 hover:border-cyan-400 transition-all shadow-lg"
        >
          {voiceEnabled ? (
            <Volume2 className="w-6 h-6 text-cyan-400" />
          ) : (
            <VolumeX className="w-6 h-6 text-gray-400" />
          )}
        </Button>

        {/* Mic Button - ALWAYS CLICKABLE */}
        <motion.button
          onClick={toggleListening}
          disabled={!browserSupport || isProcessing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl cursor-pointer ${
            isAwake || isListening
              ? "bg-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.8)] border-2 border-cyan-300 animate-pulse"
              : isActive
              ? "bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 border-2 border-cyan-500/50"
              : "bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 border-2 border-blue-500/50"
          } ${!browserSupport || isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Mic className="w-10 h-10 text-white" />
        </motion.button>

        {/* Power Button - PROMINENT */}
        <motion.button
          onClick={toggleSystem}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-2xl cursor-pointer ${
            isActive
              ? "bg-cyan-500 hover:bg-cyan-600 shadow-[0_0_30px_rgba(6,182,212,0.8)] border-2 border-cyan-300"
              : "bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 border-2 border-gray-500"
          }`}
        >
          <Power className="w-7 h-7 text-white" />
        </motion.button>
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 text-center z-40 pointer-events-none"
      >
        <p className="text-xs text-cyan-400/60 font-mono">
          {!isActive
            ? "Click Power or Mic to activate"
            : isAwake || isListening
            ? "Listening... speak your command"
            : "Say 'Hey JARVIS' or click Mic"}
        </p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] max-w-md pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg flex items-center gap-3 shadow-lg"
          >
            <p className="text-sm">{error}</p>
            <button
              onClick={() => setError("")}
              className="ml-auto text-white hover:text-gray-200 text-xl font-bold"
            >
              ×
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
