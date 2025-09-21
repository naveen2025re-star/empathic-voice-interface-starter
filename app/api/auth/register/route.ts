import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/shared/validation';
import { registerUser } from '@/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);
    
    // Register user
    const user = await registerUser(
      validatedData.email,
      validatedData.password,
      validatedData.firstName,
      validatedData.lastName
    );

    // Return user data (without password hash)
    const { passwordHash, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'User registered successfully',
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { message: 'User with this email already exists' }, 
        { status: 409 }
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