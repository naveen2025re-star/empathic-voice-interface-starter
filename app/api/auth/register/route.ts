import { NextRequest, NextResponse } from 'next/server';
import { registerUser, createSession } from '@/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Register user
    const user = await registerUser(body);

    // Create session cookie for new user
    await createSession(user.id, user.email);
    
    return NextResponse.json({
      message: 'User registered successfully',
      user
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Registration failed' }, 
      { status: error.message?.includes('already exists') ? 409 : 400 }
    );
  }
}