import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language = 'en' } = await req.json();

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const systemPrompt = language === 'hi' 
      ? `आप एक सहायक स्वास्थ्य AI असिस्टेंट हैं जो बुजुर्गों की मदद करता है। आप दवाओं, स्वास्थ्य युक्तियों और सामान्य कल्याण के बारे में जानकारी देते हैं। हमेशा स्पष्ट, दयालु और समझने योग्य भाषा का उपयोग करें। यदि कोई गंभीर चिकित्सा चिंता है तो हमेशा डॉक्टर से सलाह लेने की सिफारिश करें। आयुर्वेदिक और पारंपरिक भारतीय उपचारों का उल्लेख करना उपयोगी है।`
      : `You are a helpful health AI assistant for elderly patients. You provide information about medications, health tips, and general wellness. Always use clear, kind, and understandable language. Always recommend consulting with a doctor for any serious medical concerns. It's helpful to mention Ayurvedic and traditional Indian remedies when appropriate.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});