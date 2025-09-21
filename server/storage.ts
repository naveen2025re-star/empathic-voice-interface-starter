import { sessions, users, type Session, type InsertSession, type User, type UpsertUser } from "../shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // Session operations
  saveSession(sessionData: Omit<InsertSession, 'id' | 'createdAt'>): Promise<Session>;
  getSessionHistory(userId?: number): Promise<Session[]>;
  getSession(id: number): Promise<Session | undefined>;
  deleteSession(id: number): Promise<void>;
  exportSessionsAsCSV(userId: number): Promise<string>;
  exportSessionsAsJSON(userId: number): Promise<string>;
  
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

  async getSessionHistory(userId?: number): Promise<Session[]> {
    if (userId) {
      return await db
        .select()
        .from(sessions)
        .where(eq(sessions.userId, userId))
        .orderBy(desc(sessions.createdAt));
    } else {
      return await db
        .select()
        .from(sessions)
        .orderBy(desc(sessions.createdAt));
    }
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

  async exportSessionsAsCSV(userId: number): Promise<string> {
    const userSessions = await this.getSessionHistory(userId);
    if (userSessions.length === 0) return '';
    
    const headers = ['Date', 'Script', 'Duration (min)', 'Messages', 'Overall Score', 'Confidence', 'Enthusiasm', 'Persuasiveness'];
    const csvRows = [headers.join(',')];
    
    userSessions.forEach(session => {
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

  async exportSessionsAsJSON(userId: number): Promise<string> {
    const userSessions = await this.getSessionHistory(userId);
    return JSON.stringify(userSessions, null, 2);
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