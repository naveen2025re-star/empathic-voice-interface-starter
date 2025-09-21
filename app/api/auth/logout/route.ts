import { NextResponse } from 'next/server';
import { destroySession } from '@/server/auth';

export async function POST() {
  try {
    // Destroy session cookie
    await destroySession();
    
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