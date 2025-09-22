import jwt from 'jsonwebtoken';
import { storage } from '../server/storage';
import type { Business } from '../shared/schema';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthToken {
  businessId: number;
  email: string;
}

export async function verifyToken(token: string): Promise<Business | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthToken;
    const business = await storage.getBusinessById(decoded.businessId);
    return business || null;
  } catch (error) {
    return null;
  }
}

export function createToken(business: Business): string {
  return jwt.sign(
    { businessId: business.id, email: business.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function getBusinessFromRequest(request: Request): Promise<Business | null> {
  const authorization = request.headers.get('authorization');
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.substring(7);
  return verifyToken(token);
}