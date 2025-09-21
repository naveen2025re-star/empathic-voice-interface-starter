import { NextRequest, NextResponse } from 'next/server';
import { loginUser, createSession } from '@/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Authenticate user
    const user = await loginUser(body);

    // Create session cookie
    await createSession(user.id, user.email);
    
    return NextResponse.json({
      message: 'Login successful',
      user
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Login failed' }, 
      { status: error.message === 'Invalid email or password' ? 401 : 400 }
    );
  }
}