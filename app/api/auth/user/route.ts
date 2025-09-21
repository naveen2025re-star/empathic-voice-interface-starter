import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getUserFromSession } from '../../../../server/nextAuthHelpers';

export async function GET(request: NextRequest) {
  try {
    const sessionData = getSessionFromRequest(request);
    
    if (!sessionData) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    
    const user = await getUserFromSession(sessionData);
    
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in auth check:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}