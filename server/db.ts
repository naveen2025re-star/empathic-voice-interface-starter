import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "../shared/schema";

// Enable caching for better performance
neonConfig.fetchConnectionCache = true;

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }
  
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
}

export const db = getDb();
