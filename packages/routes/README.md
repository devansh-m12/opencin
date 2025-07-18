# @workspace/routes

A centralized package for managing application routes and URL configurations across the monorepo.

## Features

- **Centralized Route Management**: All application routes are defined in one place
- **Type Safety**: Full TypeScript support with strict typing
- **Environment Configuration**: Environment variable validation and management
- **URL Utilities**: Helper functions for pathname manipulation

## Usage

### Importing Routes

```typescript
import { routes, baseUrl, getPathname } from '@workspace/routes';

// Marketing routes
routes.marketing.Index // '/'
routes.marketing.About // '/about'
routes.marketing.Contact // '/contact'
routes.marketing.Pricing // '/pricing'
routes.marketing.Blog // '/blog'
routes.marketing.Careers // '/careers'
routes.marketing.Story // '/story'
routes.marketing.Docs // '/docs'
routes.marketing.Roadmap // '/roadmap'
routes.marketing.Privacy // '/privacy-policy'
routes.marketing.Terms // '/terms-of-use'
routes.marketing.Cookie // '/cookie-policy'

// Dashboard routes
routes.dashboard.Index // '/'
routes.dashboard.Profile // '/profile'
routes.dashboard.Settings // '/settings'
routes.dashboard.Dashboard // '/dashboard'
routes.dashboard.auth.SignIn // '/auth/signin'
routes.dashboard.auth.SignUp // '/auth/signup'
routes.dashboard.organizations.Index // '/organizations'
```

### Base URLs

```typescript
import { baseUrl } from '@workspace/routes';

baseUrl.Dashboard // 'http://localhost:3000' (or env value)
baseUrl.Marketing // 'http://localhost:3001' (or env value)
```

### Pathname Utilities

```typescript
import { getPathname } from '@workspace/routes';

// Remove base URL from pathname
getPathname('http://localhost:3001/about', 'http://localhost:3001') // '/about'
getPathname('/about') // '/about'
```

### Environment Variables

The package includes environment variable validation for:

- `NEXT_PUBLIC_DASHBOARD_URL`
- `NEXT_PUBLIC_MARKETING_URL`
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NODE_ENV`

## Structure

```
packages/routes/
├── src/
│   ├── index.ts      # Main exports (routes, baseUrl, getPathname)
│   └── keys.ts       # Environment variable validation
├── package.json
├── tsconfig.json
└── eslint.config.mjs
```

## Dependencies

- `@t3-oss/env-nextjs`: Environment variable validation
- `zod`: Schema validation
- `@types/node`: Node.js type definitions 