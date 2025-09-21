import { z } from 'zod';

// Sales metrics schema
const salesMetricsSchema = z.object({
  confidence: z.number().min(0).max(1),
  enthusiasm: z.number().min(0).max(1),
  persuasiveness: z.number().min(0).max(1),
  authenticity: z.number().min(0).max(1),
  nervousness: z.number().min(0).max(1),
  overall_score: z.number().min(0).max(1),
});

// Conversation summary schema
const conversationSummarySchema = z.object({
  keyPoints: z.array(z.string()),
  improvements: z.array(z.string()),
  strengths: z.array(z.string()),
});

// Session data schema for API validation
export const sessionCreateSchema = z.object({
  duration: z.number().positive(),
  scriptTitle: z.string().min(1).max(500),
  scriptContent: z.string().min(1),
  messageCount: z.number().min(0),
  averageMetrics: salesMetricsSchema,
  coachingFeedback: z.array(z.string()),
  conversationSummary: conversationSummarySchema,
});

export type SessionCreateData = z.infer<typeof sessionCreateSchema>;