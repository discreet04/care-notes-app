// This function acts as a secure proxy for the AI chatbot API.
// It receives a user message from the frontend and sends it to the AI service.

const { OPENAI_API_KEY } = process.env;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Message is missing.' }),
      };
    }

    // Call the AI service API with the secret key
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // You can change this to your desired model
        messages: [{ role: 'user', content: message }],
      }),
    });

    const aiData = await aiResponse.json();

    if (aiData.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'AI API call failed', error: aiData.error }),
      };
    }

    // Return the AI's response to the client
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(aiData.choices[0].message),
    };
  } catch (error) {
    console.error('Error calling AI API:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
