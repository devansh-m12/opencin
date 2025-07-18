# .cursor Folder - Opendov Development Guidelines

This folder contains Cursor-specific configurations, rules, prompts, and workflows for the **opendov** project - an open-source alternative to Canva and CapCut.

## 📁 Folder Structure

```
.cursor/
├── rules/               # Reusable development rules and guidelines
│   ├── accessibility.mdc
│   ├── api-design.mdc
│   ├── authentication.mdc
│   ├── auth-package.mdc
│   ├── ci-cd.mdc
│   ├── common-package.mdc
│   ├── component-architecture.mdc
│   ├── database.mdc
│   ├── documentation.mdc
│   ├── error-handling.mdc
│   ├── general-principles.mdc
│   ├── intelligent-application.mdc
│   ├── monorepo.mdc
│   ├── naming-conventions.mdc
│   ├── nextjs.mdc
│   ├── package-structure.mdc
│   ├── performance.mdc
│   ├── routes-package.mdc
│   ├── seo.mdc
│   ├── security.mdc
│   ├── state-management.mdc
│   ├── testing.mdc
│   ├── tooling.mdc
│   ├── typescript.mdc
│   ├── ui-and-styling.mdc
│   ├── ui-package.mdc
│   └── webhooks-package.mdc
├── prompts/             # AI prompt templates for common tasks
│   ├── code-review.mdc
│   ├── component-creation.mdc
│   └── refactor-function.mdc
├── workflows/           # Step-by-step guides for development processes
│   ├── bug-fix.mdc
│   ├── new-feature.mdc
│   └── performance-optimization.mdc
├── settings.json        # Cursor-specific editor settings
└── README.md           # This file
```

## 🎯 Project Overview

**Opendov** is an open-source alternative to Canva and CapCut, combining:
- **Photo Editing**: Advanced image manipulation and design tools
- **Video Editing**: Timeline-based video editing with effects and transitions
- **Real-time Collaboration**: Multi-user editing capabilities
- **Cross-platform**: Web-based application with responsive design

## 🚀 How to Use This Folder

### Rules System
The `rules/` folder contains intelligent development rules that automatically apply based on:
- **File Types**: TypeScript, React components, API routes, etc.
- **Context**: Performance, security, accessibility requirements
- **Keywords**: Specific terms that trigger relevant rule sets
- **Package Structure**: Rules specific to auth, ui, routes, webhooks, etc.

### AI Prompts
Use the `prompts/` templates for:
- **Code Reviews**: Comprehensive review with opendov-specific considerations
- **Component Creation**: Building React components with proper TypeScript and accessibility
- **Function Refactoring**: Improving existing code with best practices

### Workflows
Follow the `workflows/` guides for:
- **New Features**: Complete implementation process
- **Bug Fixes**: Systematic debugging and resolution
- **Performance Optimization**: Improving application speed and efficiency

## 🛠️ Development Guidelines

### Package Structure
```
packages/
├── auth/          # Authentication and authorization
├── ui/            # Shared UI components and design system
├── routes/        # API route handlers and server actions
├── webhooks/      # Webhook handlers and integrations
├── common/        # Shared utilities, types, and constants
├── apikeys/       # API key management and validation
└── tooling/       # Build tools and configurations
```

### Key Technologies
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Radix UI
- **Authentication**: Auth.js (NextAuth)
- **Database**: Prisma with PostgreSQL
- **State Management**: Zustand, React Query
- **Testing**: Jest, React Testing Library
- **Build Tools**: Turborepo, pnpm workspaces

### Performance Requirements
- **Real-time Editing**: Sub-100ms response times
- **Media Processing**: Efficient handling of large files
- **Cross-browser**: Consistent performance across modern browsers
- **Mobile**: Optimized touch interactions
- **Accessibility**: WCAG 2.1 AA compliance

## 📋 Development Workflow

1. **Feature Development**
   - Follow the `new-feature.mdc` workflow
   - Use appropriate package structure
   - Implement proper TypeScript types
   - Add comprehensive tests

2. **Code Quality**
   - Use AI prompts for code reviews
   - Follow intelligent rule application
   - Maintain accessibility standards
   - Optimize for performance

3. **Testing & Deployment**
   - Run full test suite
   - Performance testing with large files
   - Cross-browser compatibility testing
   - Accessibility testing

## 🔧 Cursor Settings

The `settings.json` file configures:
- **Formatting**: Prettier and ESLint integration
- **TypeScript**: Auto-imports and type checking
- **Tailwind**: CSS class suggestions and validation
- **Git**: Smart commits and auto-fetch
- **File Associations**: Proper handling of `.mdc` files

## 📚 Best Practices

### Code Organization
- Use proper package boundaries
- Follow naming conventions
- Implement proper error handling
- Add comprehensive documentation

### Performance
- Optimize bundle size
- Implement code splitting
- Use proper caching strategies
- Monitor real user metrics

### Security
- Validate all user inputs
- Implement proper authentication
- Use secure API key management
- Regular security audits

### Accessibility
- Follow WCAG 2.1 AA guidelines
- Implement keyboard navigation
- Use proper ARIA labels
- Test with screen readers

## 🤝 Contributing

When contributing to opendov:
1. Follow the established workflows
2. Use the AI prompts for guidance
3. Apply the intelligent rules system
4. Maintain code quality standards
5. Test thoroughly before submitting

## 📞 Support

For questions about the development setup:
- Check the workflow guides
- Use the AI prompts for guidance
- Review the rules for specific requirements
- Follow the package structure guidelines

---

**Happy coding! 🎨✨** 