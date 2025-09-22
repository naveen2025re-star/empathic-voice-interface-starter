import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Initialize database constraints for data integrity
export async function initializeDatabase() {
  try {
    // Ensure unique constraint for business contexts
    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS uniq_business_context 
      ON business_contexts (business_id)
    `);
    
    // Ensure unique constraint for active voice agents per business
    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_voice_agent 
      ON voice_agents (business_id) 
      WHERE is_active = true
    `);
    
    console.log('Database constraints initialized successfully');
  } catch (error) {
    console.error('Error initializing database constraints:', error);
    throw error;
  }
}
