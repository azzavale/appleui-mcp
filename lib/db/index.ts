import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Create database client
export const db = drizzle(sql, { schema });

// Export schema for convenience
export * from './schema';
