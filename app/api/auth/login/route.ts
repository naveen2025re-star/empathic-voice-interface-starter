import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../server/storage';
import { createToken } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Get business by email (normalize email)
    const business = await storage.getBusinessByEmail(email.toLowerCase().trim());
    if (!business) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await storage.verifyPassword(password, business.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create JWT token
    const token = createToken(business);

    // Return success response
    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        email: business.email,
        companyName: business.companyName,
        website: business.website,
        industry: business.industry,
      },
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}