import { NextRequest, NextResponse } from 'next/server';
import { getBusinessFromRequest } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const business = await getBusinessFromRequest(request);
    
    if (!business) {
      return NextResponse.json({ error: 'Invalid or missing authorization token' }, { status: 401 });
    }

    // Return business data (without password hash)
    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        email: business.email,
        companyName: business.companyName,
        website: business.website,
        industry: business.industry,
        createdAt: business.createdAt,
        updatedAt: business.updatedAt,
      },
    });

  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}