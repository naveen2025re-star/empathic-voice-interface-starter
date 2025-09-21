import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../server/storage';
import { sessionCreateSchema } from '../../../shared/validation';
import { getCurrentUser } from '@/server/auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const sessions = await storage.getSessionHistory(user.id);
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
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
        details: validationResult.error.issues 
      }, { status: 400 });
    }
    
    // Ensure session is associated with authenticated user
    const sessionData = { ...validationResult.data, userId: user.id };
    const session = await storage.saveSession(sessionData);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}