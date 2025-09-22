import { initializeDatabase } from './db';

// Global flag to ensure initialization runs only once
let isInitialized = false;

export async function ensureDatabaseInitialized() {
  if (!isInitialized) {
    await initializeDatabase();
    isInitialized = true;
  }
}