import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../server/storage';
import { getBusinessFromRequest } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const business = await getBusinessFromRequest(request);
    
    if (!business) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check onboarding completion status
    const context = await storage.getBusinessContext(business.id);
    const voiceAgent = await storage.getVoiceAgent(business.id);
    
    const onboardingStatus = {
      hasBusinessContext: !!context,
      hasVoiceAgent: !!voiceAgent,
      isComplete: !!(context && voiceAgent),
      steps: {
        businessInfo: !!context,
        voiceAgentConfig: !!voiceAgent,
      }
    };

    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        email: business.email,
        companyName: business.companyName,
        website: business.website,
        industry: business.industry,
      },
      onboardingStatus,
      context: context || null,
      voiceAgent: voiceAgent || null,
    });

  } catch (error) {
    console.error('Get onboarding status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}