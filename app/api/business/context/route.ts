import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../server/storage';
import { getBusinessFromRequest } from '../../../../lib/auth';
import { ensureDatabaseInitialized } from '../../../../server/initialize';

export async function GET(request: NextRequest) {
  try {
    const business = await getBusinessFromRequest(request);
    
    if (!business) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = await storage.getBusinessContext(business.id);
    
    return NextResponse.json({
      success: true,
      context: context || null,
    });

  } catch (error) {
    console.error('Get business context error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Ensure database constraints are initialized
  await ensureDatabaseInitialized();
  try {
    const business = await getBusinessFromRequest(request);
    
    if (!business) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      companyDescription,
      productsServices,
      pricingInfo,
      faqs,
      policies,
      strictRules,
      additionalContext
    } = await request.json();

    // Validate required fields
    if (!companyDescription || !productsServices) {
      return NextResponse.json(
        { error: 'Company description and products/services are required' },
        { status: 400 }
      );
    }

    // Upsert business context (create or update atomically)
    const context = await storage.upsertBusinessContext({
      businessId: business.id,
      companyDescription,
      productsServices,
      pricingInfo,
      faqs,
      policies,
      strictRules,
      additionalContext,
    });

    return NextResponse.json({
      success: true,
      context,
    });

  } catch (error) {
    console.error('Save business context error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}