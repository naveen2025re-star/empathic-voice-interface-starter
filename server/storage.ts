import { sessions, users, type Session, type InsertSession, type User, type UpsertUser } from "../shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // Session operations
  saveSession(sessionData: Omit<InsertSession, 'id' | 'createdAt'>): Promise<Session>;
  getSessionHistory(): Promise<Session[]>;
  getSession(id: number): Promise<Session | undefined>;
  deleteSession(id: number): Promise<void>;
  exportSessionsAsCSV(): Promise<string>;
  exportSessionsAsJSON(): Promise<string>;
  
  // User operations (email-based authentication)
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<UpsertUser>): Promise<User>;
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

  // User operations (email-based authentication)
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();