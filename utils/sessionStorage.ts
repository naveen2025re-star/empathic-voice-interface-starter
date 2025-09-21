import { SalesMetrics } from './salesCoaching';

export interface SessionData {
  id: number;
  createdAt?: Date;
  duration: number;
  scriptTitle: string;
  scriptContent: string;
  messageCount: number;
  averageMetrics: SalesMetrics;
  coachingFeedback: string[];
  conversationSummary: {
    keyPoints: string[];
    improvements: string[];
    strengths: string[];
  };
}

// Legacy localStorage key for backward compatibility and offline fallback
const STORAGE_KEY = 'emoticlose_sessions';
const MAX_SESSIONS = 50; // Limit storage to last 50 sessions

export async function saveSession(sessionData: Omit<SessionData, 'id' | 'createdAt'>): Promise<void> {
  if (typeof window === 'undefined') return; // Server-side guard
  
  try {
    // Try to save to database first
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save to database');
    }
    
    // Dispatch event to refresh achievements
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('session-saved'));
    }
  } catch (error) {
    console.error('Error saving session to database, falling back to localStorage:', error);
    
    // Fallback to localStorage
    try {
      const sessions = await getSessionHistory();
      const newSession: SessionData = {
        ...sessionData,
        id: Math.floor(Math.random() * 1000000), // Temporary ID for localStorage
        createdAt: new Date()
      };
      
      const updatedSessions = [newSession, ...sessions].slice(0, MAX_SESSIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('session-saved'));
      }
    } catch (fallbackError) {
      console.error('Error saving session to localStorage:', fallbackError);
    }
  }
}

export async function getSessionHistory(): Promise<SessionData[]> {
  if (typeof window === 'undefined') return []; // Server-side guard
  
  try {
    // Try to fetch from database first
    const response = await fetch('/api/sessions');
    if (response.ok) {
      const sessions = await response.json();
      return Array.isArray(sessions) ? sessions : [];
    }
    
    throw new Error('Failed to fetch from database');
  } catch (error) {
    console.error('Error loading sessions from database, falling back to localStorage:', error);
    
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored);
      return Array.isArray(sessions) ? sessions : [];
    } catch (fallbackError) {
      console.error('Error loading sessions from localStorage:', fallbackError);
      return [];
    }
  }
}

export async function getSessionById(id: number): Promise<SessionData | null> {
  if (typeof window === 'undefined') return null;
  
  try {
    const response = await fetch(`/api/sessions/${id}`);
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch from database');
  } catch (error) {
    console.error('Error loading session from database, falling back to localStorage:', error);
    
    // Fallback to localStorage
    try {
      const sessions = await getSessionHistory();
      return sessions.find(session => session.id === id) || null;
    } catch (fallbackError) {
      console.error('Error loading session:', fallbackError);
      return null;
    }
  }
}

export async function deleteSession(id: number): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const response = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Failed to delete from database');
    }
  } catch (error) {
    console.error('Error deleting session from database, falling back to localStorage:', error);
    
    // Fallback to localStorage
    try {
      const sessions = await getSessionHistory();
      const filtered = sessions.filter(session => session.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (fallbackError) {
      console.error('Error deleting session from localStorage:', fallbackError);
    }
  }
}

export function clearAllSessions(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing sessions:', error);
  }
}

export async function exportSessionsAsJSON(): Promise<string> {
  try {
    const response = await fetch('/api/sessions/export?format=json');
    if (response.ok) {
      return await response.text();
    }
    
    throw new Error('Failed to export from database');
  } catch (error) {
    console.error('Error exporting sessions from database, falling back to localStorage:', error);
    
    // Fallback to localStorage
    const sessions = await getSessionHistory();
    return JSON.stringify(sessions, null, 2);
  }
}

export async function exportSessionsAsCSV(): Promise<string> {
  try {
    const response = await fetch('/api/sessions/export?format=csv');
    if (response.ok) {
      return await response.text();
    }
    
    throw new Error('Failed to export from database');
  } catch (error) {
    console.error('Error exporting sessions from database, falling back to localStorage:', error);
    
    // Fallback to localStorage
    const sessions = await getSessionHistory();
    if (sessions.length === 0) return '';
    
    const headers = [
      'Date',
      'Duration (min)',
      'Script',
      'Messages',
      'Overall Score',
      'Confidence',
      'Enthusiasm', 
      'Persuasiveness',
      'Authenticity',
      'Nervousness'
    ];
    
    const rows = sessions.map(session => [
      session.createdAt ? new Date(session.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      (session.duration / 60000).toFixed(1),
      session.scriptTitle,
      session.messageCount,
      session.averageMetrics.overall_score.toFixed(1),
      session.averageMetrics.confidence.toFixed(1),
      session.averageMetrics.enthusiasm.toFixed(1),
      session.averageMetrics.persuasiveness.toFixed(1),
      session.averageMetrics.authenticity.toFixed(1),
      session.averageMetrics.nervousness.toFixed(1)
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Analytics helpers
export async function getPerformanceTrend(metric: keyof SalesMetrics, days: number = 7): Promise<number[]> {
  const sessions = await getSessionHistory();
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  return sessions
    .filter(s => {
      const sessionDate = s.createdAt ? new Date(s.createdAt).getTime() : 0;
      return sessionDate > cutoff;
    })
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    })
    .map(s => s.averageMetrics[metric]);
}

export async function getBestSession(): Promise<SessionData | null> {
  const sessions = await getSessionHistory();
  if (sessions.length === 0) return null;
  
  return sessions.reduce((best, current) => 
    current.averageMetrics.overall_score > best.averageMetrics.overall_score ? current : best
  );
}

export async function getSessionsByScript(scriptTitle: string): Promise<SessionData[]> {
  const sessions = await getSessionHistory();
  return sessions.filter(s => s.scriptTitle === scriptTitle);
}