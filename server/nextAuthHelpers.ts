import { NextRequest, NextResponse } from 'next/server';
import * as client from "openid-client";
import memoize from "memoizee";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export interface UserSession {
  claims: any;
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}

async function upsertUser(claims: any) {
  return await storage.upsertUser({
    replitUserId: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    username: claims["email"] || `user_${claims["sub"]}`, // Required field
  });
}

export async function getLoginUrl(hostname: string): Promise<string> {
  const config = await getOidcConfig();
  const authorizationUrl = client.buildAuthorizationUrl(config, {
    client_id: process.env.REPL_ID!,
    response_type: 'code',
    scope: 'openid email profile offline_access',
    redirect_uri: `https://${hostname}/api/auth/callback`,
    prompt: 'login consent',
  });
  return authorizationUrl.href;
}

export async function handleCallback(
  code: string, 
  hostname: string
): Promise<{ user: any; sessionData: UserSession }> {
  const config = await getOidcConfig();
  
  // Create a URL representing the callback with the authorization code
  const callbackUrl = new URL(`https://${hostname}/api/auth/callback?code=${code}`);
  
  const tokenResponse = await client.authorizationCodeGrant(
    config,
    callbackUrl
  );

  const claims = tokenResponse.claims();
  const dbUser = await upsertUser(claims);
  
  const sessionData: UserSession = {
    claims,
    access_token: tokenResponse.access_token,
    refresh_token: tokenResponse.refresh_token,
    expires_at: claims?.exp || 0,
  };

  return { user: dbUser, sessionData };
}

export async function getUserFromSession(sessionData: UserSession): Promise<any> {
  if (!sessionData.claims?.sub) {
    return null;
  }

  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  if (now > sessionData.expires_at) {
    // Try to refresh if we have a refresh token
    if (sessionData.refresh_token) {
      try {
        const config = await getOidcConfig();
        const tokenResponse = await client.refreshTokenGrant(config, sessionData.refresh_token);
        
        // Update session data
        sessionData.claims = tokenResponse.claims();
        sessionData.access_token = tokenResponse.access_token;
        sessionData.refresh_token = tokenResponse.refresh_token;
        sessionData.expires_at = sessionData.claims?.exp || 0;
      } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
      }
    } else {
      return null;
    }
  }

  return await storage.getUserByReplitId(sessionData.claims.sub);
}

export async function getLogoutUrl(hostname: string): Promise<string> {
  const config = await getOidcConfig();
  return client.buildEndSessionUrl(config, {
    client_id: process.env.REPL_ID!,
    post_logout_redirect_uri: `https://${hostname}`,
  }).href;
}

// Helper to get session from cookies
export function getSessionFromRequest(request: NextRequest): UserSession | null {
  try {
    const sessionCookie = request.cookies.get('auth-session');
    if (!sessionCookie?.value) {
      return null;
    }
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

// Helper to set session cookie
export function setSessionCookie(response: NextResponse, sessionData: UserSession | null) {
  if (sessionData) {
    response.cookies.set('auth-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 1 week
      sameSite: 'lax',
      path: '/',
    });
  } else {
    response.cookies.delete('auth-session');
  }
  return response;
}