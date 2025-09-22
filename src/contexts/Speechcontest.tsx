import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { speakText } from '@/utils/speech';

interface SpeechContextType {
  isSpeechEnabled: boolean;
  toggleSpeech: () => void;
  speak: (text: string, lang?: string) => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(false);

  const toggleSpeech = () => {
    setIsSpeechEnabled(prev => {
      if (!prev) {
        speakText("Text to speech enabled.");
      } else {
        speakText("Text to speech disabled.");
      }
      return !prev;
    });
  };

  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if (isSpeechEnabled) {
      speakText(text, lang);
    }
  }, [isSpeechEnabled]);

  return (
    <SpeechContext.Provider value={{ isSpeechEnabled, toggleSpeech, speak }}>
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (context === undefined) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
};
