import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Heart,
  Pill,
  Activity,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  timestamp: Date;
  isUser: boolean;
}

interface EnhancedAIChatProps {
  initialContext?: string;
}

const EnhancedAIChat: React.FC<EnhancedAIChatProps> = ({ initialContext }) => {
  // 🔹 Chat State
const [messages, setMessages] = useState<ChatMessage[]>([
  {
    id: "1",
    message: initialContext || 
      "Hello! I'm your AI health assistant. I can help you with medications, symptoms, and general health questions. How can I assist you today?",
    timestamp: new Date(),
    isUser: false,
  },
]);

  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔹 Compliance Tracker
  const [takenDays, setTakenDays] = useState<number>(0); // how many days meds taken
  const totalDays = 7;

  // 🔹 Daily Health Tip
  const tips = [
    "Stay hydrated — drink 6-8 glasses of water daily.",
    "Aim for 20–30 minutes of light walking every day.",
    "Take medications at the same time daily for best results.",
    "Reduce salt and processed food to help manage blood pressure.",
    "Practice deep breathing to reduce stress and improve heart health.",
    "Get 7–8 hours of quality sleep every night.",
    "Always consult your doctor before making medication changes.",
  ];
  const [dailyTip, setDailyTip] = useState<string>("");

  useEffect(() => {
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  // 🔹 Panic Button
  const [panicActive, setPanicActive] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (panicActive && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500]);
      }
    }
    return () => clearTimeout(timer);
  }, [panicActive, countdown]);

  // Scroll messages down
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔹 AI Response Logic
  const getAIResponse = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("medication") ||
      lowerMessage.includes("medicine") ||
      lowerMessage.includes("pill") ||
      lowerMessage.includes("drug")
    ) {
      return "For best results, take your medications at the same time each day.";
    }

    if (
      lowerMessage.includes("blood pressure") ||
      lowerMessage.includes("bp") ||
      lowerMessage.includes("hypertension")
    ) {
      return "Normal blood pressure is below 120/80 mmHg. Track it daily at the same time.";
    }

    if (
      lowerMessage.includes("symptom") ||
      lowerMessage.includes("pain") ||
      lowerMessage.includes("dizzy")
    ) {
      return "Track symptoms daily. Severe pain or chest issues should be reported immediately.";
    }

    if (
      lowerMessage.includes("exercise") ||
      lowerMessage.includes("walk") ||
      lowerMessage.includes("activity")
    ) {
      return "Light walking 20–30 minutes a day is excellent for heart health.";
    }

    if (
      lowerMessage.includes("food") ||
      lowerMessage.includes("diet") ||
      lowerMessage.includes("sugar")
    ) {
      return "Eat balanced meals with vegetables, whole grains, and lean proteins.";
    }

    if (
      lowerMessage.includes("emergency") ||
      lowerMessage.includes("urgent") ||
      lowerMessage.includes("help")
    ) {
      return "For emergencies, call your local emergency number immediately.";
    }

    return "I'm here to help with medications, symptoms, or wellness tips!";
  };

  // 🔹 Send Message
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      timestamp: new Date(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    setTimeout(async () => {
      const aiResponse = await getAIResponse(currentMessage);
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: aiResponse,
        timestamp: new Date(),
        isUser: false,
      };

      setMessages((prev) => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick Questions
  const quickQuestions = [
    { text: "When should I take my medications?", icon: Pill },
    { text: "How to check blood pressure correctly?", icon: Heart },
    { text: "What exercises are safe for me?", icon: Activity },
    { text: "I forgot to take my medicine", icon: Clock },
  ];

  // Toggle Meds Taken (streak system)
  const toggleTakenToday = () => {
    if (takenDays < totalDays) {
      setTakenDays((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Health Assistant</h2>
            <p className="text-sm text-white/80">
              Ask me about medications, symptoms, or health tips
            </p>
          </div>
        </div>
        {/* Panic Button */}
        <button
          onClick={() => {
            setPanicActive(true);
            setCountdown(5);
          }}
          className="flex items-center gap-2 bg-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-700"
        >
          <AlertTriangle className="h-4 w-4" /> Panic
        </button>
      </div>

      {/* Panic Toast */}
      {panicActive && (
        <div className="bg-red-100 text-red-700 text-center py-2 text-sm">
          🚨 Calling caretaker in {countdown}...
        </div>
      )}

      {/* Compliance Tracker */}
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="text-sm text-gray-700 mb-1">
          Medication Compliance ({takenDays}/{totalDays} days)
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${(takenDays / totalDays) * 100}%` }}
          ></div>
        </div>
        <button
          onClick={toggleTakenToday}
          className="mt-2 px-3 py-1 text-xs bg-green-100 rounded-lg hover:bg-green-200"
        >
          Mark Today as Taken
        </button>
      </div>

      {/* Daily Tip */}
      <div className="px-4 py-3 border-b border-gray-200 bg-teal-50 text-teal-800 text-sm">
        💡 Doctor’s Tip: {dailyTip}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.isUser ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.isUser
                  ? "bg-red-500 text-white"
                  : "bg-teal-100 text-teal-700"
              }`}
            >
              {msg.isUser ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div
              className={`max-w-[80%] ${msg.isUser ? "text-right" : "text-left"}`}
            >
              <div
                className={`p-3 rounded-2xl ${
                  msg.isUser
                    ? "bg-red-500 text-white rounded-tr-sm"
                    : "bg-gray-100 text-gray-800 rounded-tl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.message}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-teal-700" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {quickQuestions.map((question, index) => {
            const Icon = question.icon;
            return (
              <button
                key={index}
                onClick={() => setCurrentMessage(question.text)}
                className="flex items-center gap-2 p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <Icon className="h-3 w-3 text-teal-600 flex-shrink-0" />
                <span className="truncate">{question.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your health, medications, or symptoms..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none resize-none text-sm"
            rows={1}
            style={{ minHeight: "44px", maxHeight: "88px" }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isTyping}
            className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI responses are for information only. Always consult your doctor for
          medical advice.
        </p>
      </div>
    </div>
  );
};

export default EnhancedAIChat;
