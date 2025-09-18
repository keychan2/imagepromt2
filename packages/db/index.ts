import 'server-only';

import { createKysely } from '@vercel/postgres-kysely';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { DB } from './prisma/types';

export { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

export * from './prisma/types';
export * from './prisma/enums';

// Use Vercel Postgres in production, and a standard pg pool in development/local
export const db =
  process.env.NODE_ENV === 'production'
    ? createKysely<DB>()
    : new Kysely<DB>({
        dialect: new PostgresDialect({
          pool: new Pool({
            connectionString: process.env.POSTGRES_URL,
          }),
        }),
      });
