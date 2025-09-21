import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../server/storage';

export async function GET() {
  try {
    const sessions = await storage.getSessionHistory();
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await storage.saveSession(body);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}