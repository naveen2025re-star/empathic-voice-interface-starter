import { SalesMetrics } from './salesCoaching';

export interface SessionData {
  id: string;
  timestamp: number;
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

const STORAGE_KEY = 'emoticlose_sessions';
const MAX_SESSIONS = 50; // Limit storage to last 50 sessions

export function saveSession(sessionData: Omit<SessionData, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return; // Server-side guard
  
  try {
    const sessions = getSessionHistory();
    const newSession: SessionData = {
      ...sessionData,
      id: generateSessionId(),
      timestamp: Date.now()
    };
    
    const updatedSessions = [newSession, ...sessions].slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export function getSessionHistory(): SessionData[] {
  if (typeof window === 'undefined') return []; // Server-side guard
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const sessions = JSON.parse(stored);
    return Array.isArray(sessions) ? sessions : [];
  } catch (error) {
    console.error('Error loading sessions:', error);
    return [];
  }
}

export function getSessionById(id: string): SessionData | null {
  const sessions = getSessionHistory();
  return sessions.find(session => session.id === id) || null;
}

export function deleteSession(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const sessions = getSessionHistory();
    const filtered = sessions.filter(session => session.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting session:', error);
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

export function exportSessionsAsJSON(): string {
  const sessions = getSessionHistory();
  return JSON.stringify(sessions, null, 2);
}

export function exportSessionsAsCSV(): string {
  const sessions = getSessionHistory();
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
    new Date(session.timestamp).toISOString().split('T')[0],
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

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Analytics helpers
export function getPerformanceTrend(metric: keyof SalesMetrics, days: number = 7): number[] {
  const sessions = getSessionHistory();
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  return sessions
    .filter(s => s.timestamp > cutoff)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(s => s.averageMetrics[metric]);
}

export function getBestSession(): SessionData | null {
  const sessions = getSessionHistory();
  if (sessions.length === 0) return null;
  
  return sessions.reduce((best, current) => 
    current.averageMetrics.overall_score > best.averageMetrics.overall_score ? current : best
  );
}

export function getSessionsByScript(scriptTitle: string): SessionData[] {
  return getSessionHistory().filter(s => s.scriptTitle === scriptTitle);
}