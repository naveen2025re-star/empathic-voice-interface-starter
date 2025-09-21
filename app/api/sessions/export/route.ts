import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../server/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    
    if (format === 'csv') {
      const csvData = await storage.exportSessionsAsCSV();
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="sessions.csv"'
        }
      });
    } else {
      const jsonData = await storage.exportSessionsAsJSON();
      return new NextResponse(jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="sessions.json"'
        }
      });
    }
  } catch (error) {
    console.error('Error exporting sessions:', error);
    return NextResponse.json({ error: 'Failed to export sessions' }, { status: 500 });
  }
}