import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../server/storage';
import { sessionCreateSchema } from '../../../shared/validation';

export const runtime = 'nodejs';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const sessions = await storage.getSessionHistory();
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const body = await request.json();
    
    // Validate request body
    const validationResult = sessionCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }
    
    const session = await storage.saveSession(validationResult.data);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}