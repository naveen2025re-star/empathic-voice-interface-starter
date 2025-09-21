import { NextRequest, NextResponse } from 'next/server';
import { handleCallback, setSessionCookie } from '../../../../server/nextAuthHelpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/auth-error', request.url));
    }
    
    if (!code) {
      return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }
    
    const hostname = request.headers.get('host') || '';
    const { user, sessionData } = await handleCallback(code, hostname);
    
    // Create response with redirect
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Set session cookie
    setSessionCookie(response, sessionData);
    
    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/auth-error', request.url));
  }
}