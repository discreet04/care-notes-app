export const speakText = (text: string, lang: string = 'en-US') => {
  // Stop any speech that is currently active.
  window.speechSynthesis.cancel();

  // Create a new speech utterance.
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set properties for the utterance.
  utterance.lang = lang;
  utterance.rate = 1; // Speed of speech.
  utterance.pitch = 1; // Pitch of the voice.
  
  // Speak the text.
  window.speechSynthesis.speak(utterance);
};
