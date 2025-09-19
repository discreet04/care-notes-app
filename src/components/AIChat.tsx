import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import healthSymbols from '@/assets/health-symbols.jpg';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: input, language }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header with Background */}
      <Card className="border-none">
        <CardContent className="p-0">
          <div className="relative h-32 rounded-lg overflow-hidden">
            <img 
              src={healthSymbols} 
              alt="AI Health Assistant" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 text-white">
              <h2 className="text-lg font-bold">{t('aiHealthAssistant')}</h2>
              <p className="text-sm">{t('askAnything')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="p-4 flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                <p className="text-muted-foreground text-sm">
                  {t('askAnything')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`max-w-[85%] rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 opacity-70`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">{t('thinking')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          
          {/* Input Area */}
          <div className="flex gap-2 pt-4 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('typeMessage')}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChat;