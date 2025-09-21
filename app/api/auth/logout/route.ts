import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // For Next.js API routes, we'll handle logout client-side
    // In a full Express app, we'd destroy the session here
    
    return NextResponse.json({
      message: 'Logout successful'
    });

  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}