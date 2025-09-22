import 'server-only';

import { fetchAccessToken } from "hume";

export const getHumeAccessToken = async () => {
  const apiKey = process.env.HUME_API_KEY;
  const secretKey = process.env.HUME_SECRET_KEY;

  // Return null gracefully if credentials are missing instead of throwing error
  if (!apiKey || !secretKey) {
    console.warn('Hume AI credentials not found. Voice interface disabled.');
    return null;
  }

  try {
    const accessToken = await fetchAccessToken({
      apiKey: String(apiKey),
      secretKey: String(secretKey),
    });

    if (accessToken === "undefined" || !accessToken) {
      console.warn('Unable to get Hume access token. Voice interface disabled.');
      return null;
    }

    return accessToken;
  } catch (error) {
    console.warn('Error fetching Hume access token:', error);
    return null;
  }
};
