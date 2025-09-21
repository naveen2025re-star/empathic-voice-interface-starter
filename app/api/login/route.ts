import { NextRequest, NextResponse } from 'next/server';
import { getLoginUrl } from '../../../server/nextAuthHelpers';

export async function GET(request: NextRequest) {
  try {
    const hostname = request.headers.get('host') || '';
    const loginUrl = await getLoginUrl(hostname);
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to initiate login' }, { status: 500 });
  }
}