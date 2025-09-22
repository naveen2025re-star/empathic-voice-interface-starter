import { 
  businesses, 
  businessContexts, 
  voiceAgents, 
  conversations, 
  conversationAnalytics,
  widgetEmbeddings,
  type Business, 
  type InsertBusiness,
  type BusinessContext,
  type InsertBusinessContext,
  type VoiceAgent,
  type InsertVoiceAgent,
  type Conversation,
  type InsertConversation,
  type ConversationAnalytics,
  type InsertConversationAnalytics,
  type WidgetEmbedding,
  type InsertWidgetEmbedding
} from "../shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Business management
  createBusiness(insertBusiness: InsertBusiness): Promise<Business>;
  getBusinessByEmail(email: string): Promise<Business | undefined>;
  getBusinessById(id: number): Promise<Business | undefined>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  
  // Business context management
  createBusinessContext(insertContext: InsertBusinessContext): Promise<BusinessContext>;
  getBusinessContext(businessId: number): Promise<BusinessContext | undefined>;
  updateBusinessContext(businessId: number, updates: Partial<InsertBusinessContext>): Promise<BusinessContext>;
  
  // Voice agent management
  createVoiceAgent(insertAgent: InsertVoiceAgent): Promise<VoiceAgent>;
  getVoiceAgent(businessId: number): Promise<VoiceAgent | undefined>;
  updateVoiceAgent(businessId: number, updates: Partial<InsertVoiceAgent>): Promise<VoiceAgent>;
  
  // Conversation management
  createConversation(insertConversation: InsertConversation): Promise<Conversation>;
  getConversations(businessId: number, limit?: number): Promise<Conversation[]>;
  updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation>;
  
  // Analytics
  createAnalytics(insertAnalytics: InsertConversationAnalytics): Promise<ConversationAnalytics>;
  getAnalytics(businessId: number, limit?: number): Promise<ConversationAnalytics[]>;
  
  // Widget embeddings
  createWidgetEmbedding(insertEmbedding: InsertWidgetEmbedding): Promise<WidgetEmbedding>;
  getWidgetEmbeddings(businessId: number): Promise<WidgetEmbedding[]>;
}

export class DatabaseStorage implements IStorage {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const [business] = await db
      .insert(businesses)
      .values(insertBusiness)
      .returning();
    return business;
  }

  async getBusinessByEmail(email: string): Promise<Business | undefined> {
    const [business] = await db
      .select()
      .from(businesses)
      .where(eq(businesses.email, email));
    return business || undefined;
  }

  async getBusinessById(id: number): Promise<Business | undefined> {
    const [business] = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id));
    return business || undefined;
  }

  async createBusinessContext(insertContext: InsertBusinessContext): Promise<BusinessContext> {
    const [context] = await db
      .insert(businessContexts)
      .values(insertContext)
      .returning();
    return context;
  }

  async getBusinessContext(businessId: number): Promise<BusinessContext | undefined> {
    const [context] = await db
      .select()
      .from(businessContexts)
      .where(eq(businessContexts.businessId, businessId));
    return context || undefined;
  }

  async updateBusinessContext(businessId: number, updates: Partial<InsertBusinessContext>): Promise<BusinessContext> {
    const [context] = await db
      .update(businessContexts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businessContexts.businessId, businessId))
      .returning();
    return context;
  }

  async upsertBusinessContext(insertContext: InsertBusinessContext): Promise<BusinessContext> {
    // Use proper database-level upsert with INSERT ... ON CONFLICT DO UPDATE
    const [context] = await db
      .insert(businessContexts)
      .values(insertContext)
      .onConflictDoUpdate({
        target: businessContexts.businessId,
        set: {
          companyDescription: insertContext.companyDescription,
          productsServices: insertContext.productsServices,
          pricingInfo: insertContext.pricingInfo,
          faqs: insertContext.faqs,
          policies: insertContext.policies,
          strictRules: insertContext.strictRules,
          additionalContext: insertContext.additionalContext,
          updatedAt: sql`NOW()`,
        },
      })
      .returning();
    return context;
  }

  async createVoiceAgent(insertAgent: InsertVoiceAgent): Promise<VoiceAgent> {
    const [agent] = await db
      .insert(voiceAgents)
      .values(insertAgent)
      .returning();
    return agent;
  }

  async getVoiceAgent(businessId: number): Promise<VoiceAgent | undefined> {
    const [agent] = await db
      .select()
      .from(voiceAgents)
      .where(and(eq(voiceAgents.businessId, businessId), eq(voiceAgents.isActive, true)))
      .orderBy(desc(voiceAgents.createdAt))
      .limit(1);
    return agent || undefined;
  }

  async updateVoiceAgent(businessId: number, updates: Partial<InsertVoiceAgent>): Promise<VoiceAgent> {
    const [agent] = await db
      .update(voiceAgents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(voiceAgents.businessId, businessId))
      .returning();
    return agent;
  }

  async upsertVoiceAgent(insertAgent: InsertVoiceAgent): Promise<VoiceAgent> {
    // Use database transaction with proper constraint handling
    return await db.transaction(async (tx) => {
      // First deactivate any existing agents for this business
      await tx
        .update(voiceAgents)
        .set({ isActive: false, updatedAt: sql`NOW()` })
        .where(and(eq(voiceAgents.businessId, insertAgent.businessId), eq(voiceAgents.isActive, true)));

      // Then create the new agent (always active)
      // The unique constraint will prevent concurrent inserts of multiple active agents
      const [agent] = await tx
        .insert(voiceAgents)
        .values({ ...insertAgent, isActive: true })
        .returning();
      
      // Post-condition check: verify only one active agent exists
      const activeCount = await tx
        .select({ count: sql<number>`COUNT(*)` })
        .from(voiceAgents)
        .where(and(eq(voiceAgents.businessId, insertAgent.businessId), eq(voiceAgents.isActive, true)));
      
      if (activeCount[0].count > 1) {
        throw new Error('Data integrity violation: Multiple active voice agents detected');
      }
      
      return agent;
    });
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async getConversations(businessId: number, limit: number = 50): Promise<Conversation[]> {
    return db
      .select()
      .from(conversations)
      .where(eq(conversations.businessId, businessId))
      .orderBy(desc(conversations.createdAt))
      .limit(limit);
  }

  async updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation> {
    const [conversation] = await db
      .update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return conversation;
  }

  async createAnalytics(insertAnalytics: InsertConversationAnalytics): Promise<ConversationAnalytics> {
    const [analytics] = await db
      .insert(conversationAnalytics)
      .values(insertAnalytics)
      .returning();
    return analytics;
  }

  async getAnalytics(businessId: number, limit: number = 100): Promise<ConversationAnalytics[]> {
    return db
      .select()
      .from(conversationAnalytics)
      .where(eq(conversationAnalytics.businessId, businessId))
      .orderBy(desc(conversationAnalytics.createdAt))
      .limit(limit);
  }

  async createWidgetEmbedding(insertEmbedding: InsertWidgetEmbedding): Promise<WidgetEmbedding> {
    const [embedding] = await db
      .insert(widgetEmbeddings)
      .values(insertEmbedding)
      .returning();
    return embedding;
  }

  async getWidgetEmbeddings(businessId: number): Promise<WidgetEmbedding[]> {
    return db
      .select()
      .from(widgetEmbeddings)
      .where(eq(widgetEmbeddings.businessId, businessId));
  }
}

export const storage = new DatabaseStorage();