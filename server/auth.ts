import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { loginSchema, registerSchema } from '@/shared/validation';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const sql = neon(process.env.DATABASE_URL!);

// Require JWT_SECRET in production
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-key-only-for-development'
);

export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  createdAt: string;
}

export interface SessionPayload extends Record<string, unknown> {
  userId: number;
  email: string;
}

export async function createSession(userId: number, email: string): Promise<string> {
  const payload: SessionPayload = { userId, email };
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  // Set secure HTTP-only cookie
  const cookieStore = cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete('session');
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const result = await sql`
    SELECT id, email, first_name, last_name, username, created_at
    FROM users 
    WHERE id = ${session.userId}
  `;

  if (result.length === 0) {
    return null;
  }

  const user = result[0];
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    createdAt: user.created_at,
  };
}

async function generateUniqueUsername(email: string): Promise<string> {
  // Extract base username from email (part before @)
  const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Check if base username is available
  let username = baseUsername;
  let counter = 1;
  
  while (true) {
    const existing = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;
    
    if (existing.length === 0) {
      return username;
    }
    
    // Add number suffix if username exists
    username = `${baseUsername}${counter}`;
    counter++;
    
    // Prevent infinite loops
    if (counter > 1000) {
      username = `${baseUsername}${Date.now()}`;
      break;
    }
  }
  
  return username;
}

export async function registerUser(data: { email: string; password: string; firstName?: string; lastName?: string }): Promise<User> {
  const validation = registerSchema.safeParse(data);
  if (!validation.success) {
    throw new Error('Invalid input data');
  }

  const { email, password, firstName, lastName } = validation.data;

  // Check if user already exists
  const existingUser = await sql`
    SELECT id FROM users WHERE email = ${email}
  `;

  if (existingUser.length > 0) {
    throw new Error('User already exists with this email');
  }

  // Generate unique username from email
  const username = await generateUniqueUsername(email);

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user with auto-generated username
  const result = await sql`
    INSERT INTO users (email, password_hash, first_name, last_name, username)
    VALUES (${email}, ${passwordHash}, ${firstName || null}, ${lastName || null}, ${username})
    RETURNING id, email, first_name, last_name, username, created_at
  `;

  const user = result[0];
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    createdAt: user.created_at,
  };
}

export async function loginUser(data: { email: string; password: string }): Promise<User> {
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    throw new Error('Invalid input data');
  }

  const { email, password } = validation.data;

  // Get user by email
  const result = await sql`
    SELECT id, email, password_hash, first_name, last_name, username, created_at
    FROM users 
    WHERE email = ${email}
  `;

  if (result.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result[0];

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    createdAt: user.created_at,
  };
}