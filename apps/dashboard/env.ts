import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
    DATABASE_URL: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_DASHBOARD_URL: z.string().url().optional(),
    NEXT_PUBLIC_MARKETING_URL: z.string().url().optional()
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL,
    NEXT_PUBLIC_MARKETING_URL: process.env.NEXT_PUBLIC_MARKETING_URL
  }
});
