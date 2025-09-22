import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../server/storage';
import { createToken } from '../../../../lib/auth';
import { ensureDatabaseInitialized } from '../../../../server/initialize';

export async function POST(request: NextRequest) {
  // Ensure database constraints are initialized
  await ensureDatabaseInitialized();
  try {
    const { email, password, companyName, website, industry } = await request.json();

    // Validate required fields
    if (!email || !password || !companyName) {
      return NextResponse.json({ error: 'Email, password, and company name are required' }, { status: 400 });
    }

    // Check if business already exists
    const existingBusiness = await storage.getBusinessByEmail(email);
    if (existingBusiness) {
      return NextResponse.json({ error: 'Business already exists with this email' }, { status: 409 });
    }

    // Hash password and create business
    const passwordHash = await storage.hashPassword(password);
    
    try {
      const business = await storage.createBusiness({
        email: email.toLowerCase().trim(),
        passwordHash,
        companyName,
        website,
        industry,
      });

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

    } catch (dbError: any) {
      // Handle unique constraint violations
      if (dbError?.code === '23505' || dbError?.constraint?.includes('email')) {
        return NextResponse.json({ error: 'Business already exists with this email' }, { status: 409 });
      }
      throw dbError;
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}