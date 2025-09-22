import { pgTable, serial, text, timestamp, integer, json, boolean, varchar, unique } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// Business accounts table
export const businesses = pgTable('businesses', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  website: text('website'),
  industry: varchar('industry', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Business context - the knowledge base for each business
export const businessContexts = pgTable('business_contexts', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').references(() => businesses.id).notNull().unique(),
  companyDescription: text('company_description').notNull(),
  productsServices: text('products_services').notNull(),
  pricingInfo: text('pricing_info'),
  faqs: text('faqs'),
  policies: text('policies'),
  strictRules: text('strict_rules'),
  additionalContext: json('additional_context'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Voice agent configuration
export const voiceAgents = pgTable('voice_agents', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').references(() => businesses.id).notNull(),
  agentName: varchar('agent_name', { length: 100 }).notNull(),
  personalityType: varchar('personality_type', { length: 50 }).default('professional').notNull(),
  greetingMessage: text('greeting_message').notNull(),
  conversationRules: text('conversation_rules'),
  isActive: boolean('is_active').default(true).notNull(),
  humeConfigId: varchar('hume_config_id', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Conversations table for tracking customer interactions
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').references(() => businesses.id).notNull(),
  voiceAgentId: integer('voice_agent_id').references(() => voiceAgents.id).notNull(),
  customerSessionId: varchar('customer_session_id', { length: 255 }).notNull(),
  messages: json('messages').notNull(), // Array of conversation messages
  emotionData: json('emotion_data'), // Hume AI emotion analysis data
  duration: integer('duration'), // Conversation duration in seconds
  customerInfo: json('customer_info'), // Any captured customer details
  status: varchar('status', { length: 20 }).default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Analytics table for business intelligence
export const conversationAnalytics = pgTable('conversation_analytics', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').references(() => conversations.id).notNull(),
  businessId: integer('business_id').references(() => businesses.id).notNull(),
  customerIntent: varchar('customer_intent', { length: 100 }),
  productsMentioned: json('products_mentioned'), // Array of products discussed
  conversionIndicators: json('conversion_indicators'), // Buying signals detected
  satisfactionScore: integer('satisfaction_score'), // 1-10 based on emotion analysis
  engagementLevel: varchar('engagement_level', { length: 20 }),
  keyInsights: text('key_insights'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Widget embeddings for tracking where the bot is deployed
export const widgetEmbeddings = pgTable('widget_embeddings', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').references(() => businesses.id).notNull(),
  voiceAgentId: integer('voice_agent_id').references(() => voiceAgents.id).notNull(),
  embedCode: text('embed_code').notNull(),
  websiteUrl: text('website_url'),
  widgetPosition: varchar('widget_position', { length: 50 }).default('bottom-right'),
  widgetTheme: varchar('widget_theme', { length: 20 }).default('light'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relationships
export const businessesRelations = relations(businesses, ({ one, many }) => ({
  businessContext: one(businessContexts),
  voiceAgents: many(voiceAgents),
  conversations: many(conversations),
  analytics: many(conversationAnalytics),
  embeddings: many(widgetEmbeddings),
}));

export const businessContextsRelations = relations(businessContexts, ({ one }) => ({
  business: one(businesses, {
    fields: [businessContexts.businessId],
    references: [businesses.id],
  }),
}));

export const voiceAgentsRelations = relations(voiceAgents, ({ one, many }) => ({
  business: one(businesses, {
    fields: [voiceAgents.businessId],
    references: [businesses.id],
  }),
  conversations: many(conversations),
  embeddings: many(widgetEmbeddings),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  business: one(businesses, {
    fields: [conversations.businessId],
    references: [businesses.id],
  }),
  voiceAgent: one(voiceAgents, {
    fields: [conversations.voiceAgentId],
    references: [voiceAgents.id],
  }),
  analytics: many(conversationAnalytics),
}));

export const conversationAnalyticsRelations = relations(conversationAnalytics, ({ one }) => ({
  conversation: one(conversations, {
    fields: [conversationAnalytics.conversationId],
    references: [conversations.id],
  }),
  business: one(businesses, {
    fields: [conversationAnalytics.businessId],
    references: [businesses.id],
  }),
}));

export const widgetEmbeddingsRelations = relations(widgetEmbeddings, ({ one }) => ({
  business: one(businesses, {
    fields: [widgetEmbeddings.businessId],
    references: [businesses.id],
  }),
  voiceAgent: one(voiceAgents, {
    fields: [widgetEmbeddings.voiceAgentId],
    references: [voiceAgents.id],
  }),
}));

// Export types
export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = typeof businesses.$inferInsert;
export type BusinessContext = typeof businessContexts.$inferSelect;
export type InsertBusinessContext = typeof businessContexts.$inferInsert;
export type VoiceAgent = typeof voiceAgents.$inferSelect;
export type InsertVoiceAgent = typeof voiceAgents.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;
export type ConversationAnalytics = typeof conversationAnalytics.$inferSelect;
export type InsertConversationAnalytics = typeof conversationAnalytics.$inferInsert;
export type WidgetEmbedding = typeof widgetEmbeddings.$inferSelect;
export type InsertWidgetEmbedding = typeof widgetEmbeddings.$inferInsert;