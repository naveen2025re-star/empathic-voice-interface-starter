import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/shared/validation';
import { loginUser } from '@/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = loginSchema.parse(body);
    
    // Authenticate user
    const user = await loginUser(validatedData.email, validatedData.password);

    // Create session
    // Note: In a full Express app, we'd set req.session.userId here
    // For now, we'll return user data and handle session client-side
    const { passwordHash, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid credentials') {
      return NextResponse.json(
        { message: 'Invalid email or password' }, 
        { status: 401 }
      );
    }
    
    if (error.issues) {
      // Zod validation error
      return NextResponse.json(
        { message: 'Invalid input', errors: error.issues }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}