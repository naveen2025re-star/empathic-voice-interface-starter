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

    const voiceAgent = await storage.getVoiceAgent(business.id);
    
    return NextResponse.json({
      success: true,
      voiceAgent: voiceAgent || null,
    });

  } catch (error) {
    console.error('Get voice agent error:', error);
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
      agentName,
      personalityType,
      greetingMessage,
      conversationRules,
      humeConfigId
    } = await request.json();

    // Validate required fields
    if (!agentName || !greetingMessage) {
      return NextResponse.json(
        { error: 'Agent name and greeting message are required' },
        { status: 400 }
      );
    }

    // Upsert voice agent (deactivate old, create new)
    const voiceAgent = await storage.upsertVoiceAgent({
      businessId: business.id,
      agentName,
      personalityType: personalityType || 'professional',
      greetingMessage,
      conversationRules,
      humeConfigId,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      voiceAgent,
    });

  } catch (error) {
    console.error('Save voice agent error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}