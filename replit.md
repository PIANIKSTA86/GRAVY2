# GRAVY - Sistema Contable Multiempresa

## Overview

GRAVY is a multi-tenant accounting software system designed for Colombian businesses, built as a SaaS subscription model. The application provides a core accounting module with extensibility planned for inventory management and NIIF (International Financial Reporting Standards) compliance.

The system supports multiple companies (tenants) with isolated data, chart of accounts management, third-party management (clients/suppliers), journal entries, and NIIF policies configuration. All user-facing content, documentation, and code comments are in Spanish.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins for Replit integration
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: REST endpoints defined in shared routes with Zod schemas for validation
- **Build**: esbuild for production bundling with selective dependency bundling

### Data Storage
- **Database**: PostgreSQL via node-postgres (pg)
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Migrations**: Drizzle Kit for schema push operations
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple

### Multi-Tenant Design
- Single shared database with `tenant_id` field on all accounting tables
- Data isolation enforced through SQL filters, middleware, and storage layer
- Tables include audit fields: `fecha_creacion`, `usuario_creacion`, `usuario_modificacion`
- NIIF extension flags built into core tables for future compatibility

### Authentication
- Replit Auth integration via OpenID Connect
- Passport.js with openid-client strategy
- Session-based authentication with PostgreSQL session store
- User-tenant associations stored in `tenant_users` table with role-based access

### Key Design Patterns
- **Shared Schema**: Database schema and Zod validation schemas defined in `shared/schema.ts`
- **Typed API Routes**: Route definitions with input/output schemas in `shared/routes.ts`
- **Storage Interface**: `IStorage` interface in `server/storage.ts` for data access abstraction
- **Path Aliases**: `@/` for client code, `@shared/` for shared code

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, requires `DATABASE_URL` environment variable

### Authentication
- **Replit Auth**: OpenID Connect provider at `https://replit.com/oidc`
- Requires `SESSION_SECRET` and `REPL_ID` environment variables

### UI Libraries
- **Radix UI**: Headless component primitives (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library
- **date-fns**: Date formatting utilities

### Form & Validation
- **Zod**: Schema validation
- **React Hook Form**: Form state management
- **drizzle-zod**: Drizzle schema to Zod schema conversion

### Development Tools
- **Vite**: Development server with HMR
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling