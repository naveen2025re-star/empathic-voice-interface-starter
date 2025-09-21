import { pgTable, serial, text, timestamp, integer, real, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table for potential future user management
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Sessions table to store practice session data
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'), // Optional for future user system
  duration: integer('duration').notNull(), // Duration in milliseconds
  scriptTitle: text('script_title').notNull(),
  scriptContent: text('script_content').notNull(),
  messageCount: integer('message_count').notNull(),
  averageMetrics: jsonb('average_metrics').notNull(), // Store metrics as JSON
  coachingFeedback: jsonb('coaching_feedback').notNull(), // Store feedback array as JSON
  conversationSummary: jsonb('conversation_summary').notNull(), // Store summary as JSON
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;