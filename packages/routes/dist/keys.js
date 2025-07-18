import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
export const keys = () => createEnv({
    server: {
        NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
        DATABASE_URL: z.string().url().optional(),
        NEXTAUTH_SECRET: z.string().min(1).optional(),
        NEXTAUTH_URL: z.string().url().optional()
    },
    client: {
        NEXT_PUBLIC_DASHBOARD_URL: z.string().url().optional(),
        NEXT_PUBLIC_MARKETING_URL: z.string().url().optional()
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL,
        NEXT_PUBLIC_MARKETING_URL: process.env.NEXT_PUBLIC_MARKETING_URL
    }
});
