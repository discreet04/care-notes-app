// This function handles the secure token exchange with Google.
// It receives the authorization code from the frontend and exchanges it for an access token.

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

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
    const { code } = JSON.parse(event.body);

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Authorization code is missing.' }),
      };
    }

    // Make a secure POST request to Google's token endpoint
    const tokenResponse = await fetch('[https://oauth2.googleapis.com/token](https://oauth2.googleapis.com/token)', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        // The redirect_uri must match the one you configured in your Google Cloud Console
        redirect_uri: 'https://<your-netlify-site-name>.netlify.app',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Token exchange failed', error: tokenData.error }),
      };
    }

    // Return the token data to the client
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(tokenData),
    };
  } catch (error) {
    console.error('Error during token exchange:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
