import { NextRequest, NextResponse } from 'next/server';
import { getLogoutUrl, setSessionCookie } from '../../../../server/nextAuthHelpers';

export async function GET(request: NextRequest) {
  try {
    const hostname = request.headers.get('host') || '';
    const logoutUrl = await getLogoutUrl(hostname);
    
    // Create response with redirect
    const response = NextResponse.redirect(logoutUrl);
    
    // Clear session cookie
    setSessionCookie(response, null);
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Fallback: clear session and redirect to home
    const response = NextResponse.redirect(new URL('/', request.url));
    setSessionCookie(response, null);
    return response;
  }
}