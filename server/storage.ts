import { sessions, type Session, type InsertSession } from "../shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  saveSession(sessionData: Omit<InsertSession, 'id' | 'createdAt'>): Promise<Session>;
  getSessionHistory(): Promise<Session[]>;
  getSession(id: number): Promise<Session | undefined>;
  deleteSession(id: number): Promise<void>;
  exportSessionsAsCSV(): Promise<string>;
  exportSessionsAsJSON(): Promise<string>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async saveSession(sessionData: Omit<InsertSession, 'id' | 'createdAt'>): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async getSessionHistory(): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .orderBy(desc(sessions.createdAt));
  }

  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id));
    return session || undefined;
  }

  async deleteSession(id: number): Promise<void> {
    await db
      .delete(sessions)
      .where(eq(sessions.id, id));
  }

  async exportSessionsAsCSV(): Promise<string> {
    const allSessions = await this.getSessionHistory();
    if (allSessions.length === 0) return '';
    
    const headers = ['Date', 'Script', 'Duration (min)', 'Messages', 'Overall Score', 'Confidence', 'Enthusiasm', 'Persuasiveness'];
    const csvRows = [headers.join(',')];
    
    allSessions.forEach(session => {
      const metrics = session.averageMetrics as any;
      const duration = Math.round(session.duration / 60000);
      const row = [
        session.createdAt?.toISOString().split('T')[0] || '',
        `"${session.scriptTitle}"`,
        duration.toString(),
        session.messageCount.toString(),
        Math.round(metrics.overall_score || 0).toString(),
        Math.round((metrics.confidence || 0) * 100).toString(),
        Math.round((metrics.enthusiasm || 0) * 100).toString(),
        Math.round((metrics.persuasiveness || 0) * 100).toString()
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  async exportSessionsAsJSON(): Promise<string> {
    const allSessions = await this.getSessionHistory();
    return JSON.stringify(allSessions, null, 2);
  }
}

export const storage = new DatabaseStorage();