import { pgTable, serial, text, timestamp, integer, real, jsonb, varchar, index } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// Authentication sessions table (for express-session)
export const authSessions = pgTable(
  "auth_sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table (email-based authentication)
export const users = pgTable('users', {
  id: serial('id').primaryKey(), // Keep existing integer ID
  username: text('username').notNull().unique(), // Keep existing field
  email: text('email').notNull().unique(), // Required for email auth
  passwordHash: text('password_hash').notNull(), // Store hashed passwords
  firstName: text('first_name'), // User profile data
  lastName: text('last_name'), // User profile data
  profileImageUrl: text('profile_image_url'), // User profile data
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Practice sessions table to store practice session data (keeping existing structure)
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Keep existing integer reference
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
export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;