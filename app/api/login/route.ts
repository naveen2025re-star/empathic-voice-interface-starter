import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // For demo purposes, redirect to a simple auth flow
  // In production, this would integrate with Replit Auth
  const redirectUrl = new URL('/auth-demo', request.url);
  return NextResponse.redirect(redirectUrl);
}