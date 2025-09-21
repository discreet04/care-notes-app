import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Heart, Pill, Activity, Clock, AlertTriangle } from 'lucide-react';

interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  timestamp: Date;
  isUser: boolean;
}

const EnhancedAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! I\'m your AI health assistant. I can help you with medications, symptoms, and general health questions. How can I assist you today?',
      timestamp: new Date(),
      isUser: false
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (message: string): Promise<string> => {
    // Enhanced AI responses based on health context
    const lowerMessage = message.toLowerCase();
    
    // Medication-related queries
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine') || lowerMessage.includes('pill') || lowerMessage.includes('drug')) {
      const medQueries = [
        {
          keywords: ['when', 'time', 'schedule'],
          responses: [
            'For best results, take your medications at the same time each day. This helps maintain consistent levels in your body.',
            'Morning medications are usually best taken 30 minutes before breakfast, unless specified otherwise.',
            'If you have multiple medications, create a schedule to space them out properly.'
          ]
        },
        {
          keywords: ['food', 'eat', 'meal'],
          responses: [
            'Some medications should be taken with food to reduce stomach irritation, while others work better on an empty stomach.',
            'Metformin, for example, should always be taken with food to prevent stomach upset.',
            'Check with your pharmacist about food interactions with your specific medications.'
          ]
        },
        {
          keywords: ['forgot', 'missed', 'skip'],
          responses: [
            'If you miss a dose, take it as soon as you remember, unless it\'s almost time for your next dose.',
            'Never double up on medications to make up for a missed dose.',
            'Consider setting phone alarms or using a pill organizer to help remember your medications.'
          ]
        }
      ];
      
      for (const query of medQueries) {
        if (query.keywords.some(keyword => lowerMessage.includes(keyword))) {
          return query.responses[Math.floor(Math.random() * query.responses.length)];
        }
      }
      
      return 'I can help you with medication timing, food interactions, and reminders. What specific question do you have about your medications?';
    }
    
    // Blood pressure and vital signs
    if (lowerMessage.includes('blood pressure') || lowerMessage.includes('bp') || lowerMessage.includes('hypertension')) {
      const bpResponses = [
        'Normal blood pressure is typically below 120/80 mmHg. Values above 140/90 may indicate hypertension.',
        'Check your blood pressure at the same time each day, preferably in the morning before medications.',
        'Lifestyle factors like salt intake, exercise, and stress can significantly affect blood pressure readings.',
        'If your blood pressure is consistently high, consult your doctor about medication adjustments.'
      ];
      return bpResponses[Math.floor(Math.random() * bpResponses.length)];
    }
    
    // Symptoms and health monitoring
    if (lowerMessage.includes('symptom') || lowerMessage.includes('feel') || lowerMessage.includes('pain') || lowerMessage.includes('dizzy')) {
      const symptomResponses = [
        'It\'s important to track any new or worsening symptoms. Keep a daily log of how you feel.',
        'Dizziness can be related to blood pressure changes, dehydration, or medication side effects.',
        'Any chest pain, severe headache, or difficulty breathing should be reported to your doctor immediately.',
        'Regular symptoms like fatigue or minor aches should still be discussed during your next appointment.'
      ];
      return symptomResponses[Math.floor(Math.random() * symptomResponses.length)];
    }
    
    // Exercise and lifestyle
    if (lowerMessage.includes('exercise') || lowerMessage.includes('walk') || lowerMessage.includes('activity')) {
      const exerciseResponses = [
        'Light walking for 15-30 minutes daily can significantly improve cardiovascular health and blood sugar control.',
        'Chair exercises and gentle stretching are great options if mobility is limited.',
        'Always start slowly and gradually increase activity. Listen to your body and rest when needed.',
        'Consult your doctor before starting any new exercise routine, especially if you have heart conditions.'
      ];
      return exerciseResponses[Math.floor(Math.random() * exerciseResponses.length)];
    }
    
    // Diet and nutrition
    if (lowerMessage.includes('food') || lowerMessage.includes('diet') || lowerMessage.includes('eat') || lowerMessage.includes('sugar')) {
      const dietResponses = [
        'A balanced diet with plenty of vegetables, whole grains, and lean proteins supports overall health.',
        'Limit salt intake to help manage blood pressure. Aim for less than 2300mg sodium per day.',
        'Monitor blood sugar levels if diabetic. Consistent meal timing helps regulate glucose.',
        'Stay hydrated with water throughout the day. Limit caffeine and alcohol consumption.'
      ];
      return dietResponses[Math.floor(Math.random() * dietResponses.length)];
    }
    
    // General health and emergency
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('help')) {
      return 'For medical emergencies, call your local emergency number immediately. For urgent but non-emergency concerns, contact your doctor or nurse hotline. I can provide general information but cannot replace professional medical care.';
    }
    
    // Friendly general responses
    const generalResponses = [
      'I\'m here to help with your health questions. You can ask me about medications, symptoms, blood pressure, exercise, or general wellness.',
      'Remember, I provide general health information. Always consult your doctor for personalized medical advice.',
      'What specific aspect of your health would you like to discuss today?',
      'Feel free to ask about medication reminders, symptom tracking, or healthy lifestyle tips.'
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      timestamp: new Date(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = await getAIResponse(currentMessage);
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: aiResponse,
        timestamp: new Date(),
        isUser: false
      };

      setMessages(prev => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    { text: "When should I take my medications?", icon: Pill },
    { text: "How to check blood pressure correctly?", icon: Heart },
    { text: "What exercises are safe for me?", icon: Activity },
    { text: "I forgot to take my medicine", icon: Clock }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Health Assistant</h2>
            <p className="text-sm text-white/80">Ask me about medications, symptoms, or health tips</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.isUser ? 'bg-red-500 text-white' : 'bg-teal-100 text-teal-700'
            }`}>
              {msg.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`max-w-[80%] ${msg.isUser ? 'text-right' : 'text-left'}`}>
              <div className={`p-3 rounded-2xl ${
                msg.isUser 
                  ? 'bg-red-500 text-white rounded-tr-sm' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.message}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your health, medications, or symptoms..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none resize-none text-sm"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '88px' }}
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
          AI responses are for information only. Always consult your doctor for medical advice.
        </p>
      </div>
    </div>
  );
};

export default EnhancedAIChat;