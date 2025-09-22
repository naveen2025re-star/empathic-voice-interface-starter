import 'server-only';

import { fetchAccessToken } from "hume";

export const getHumeAccessToken = async () => {
  const apiKey = process.env.HUME_API_KEY;
  const secretKey = process.env.HUME_SECRET_KEY;

  // Return null gracefully if credentials are missing
  if (!apiKey || !secretKey) {
    console.warn('🔑 Hume AI credentials not found in environment variables.');
    return null;
  }

  try {
    const accessToken = await fetchAccessToken({
      apiKey: String(apiKey),
      secretKey: String(secretKey),
    });

    if (accessToken === "undefined" || !accessToken) {
      console.warn('⚠️ Unable to get Hume access token - check your API credentials.');
      return null;
    }

    console.log('✅ Successfully authenticated with Hume AI!');
    return accessToken;
  } catch (error: any) {
    // Handle invalid credentials specifically
    if (error.message?.includes('invalid_client') || error.message?.includes('Client credentials are invalid')) {
      console.warn('🚫 Invalid Hume AI credentials detected.');
      console.warn('💡 To fix this:');
      console.warn('   1. Visit https://platform.hume.ai/ to get valid API keys');
      console.warn('   2. Update your .env.local file with real credentials');
      console.warn('   3. Restart the development server');
      return null;
    }
    
    console.warn('❌ Error fetching Hume access token:', error.message || error);
    return null;
  }
};
