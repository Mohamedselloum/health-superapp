# Todo List for Health SuperApp Development

## Phase 1: Detailed Requirements Analysis and Architecture Design
- [ ] Review the provided document for all requirements.
- [ ] Identify key architectural components and their interactions.
- [ ] Document design decisions and tradeoffs in DECISIONS.md.
- [ ] Outline the database schema based on the provided table list.
- [ ] Plan the monorepo structure.

## Phase 2: Monorepo Setup and Shared Packages Development
- [x] Initialize pnpm monorepo.
- [x] Create `apps/mobile`, `apps/admin-web`, `apps/backend` directories.
- [x] Create `packages/ui`, `packages/utils`, `packages/config`, `packages/sdk` directories.
- [x] Configure TypeScript, ESLint, Prettier for the monorepo.

## Phase 3: Supabase Integration and Database Setup
- [x] Set up Supabase project.
- [x] Write SQL migrations for all specified tables.
- [x] Implement Row Level Security (RLS) policies.
- [x] Create seed data.

## Phase 4: Backend API Development (NestJS)
- [x] Initialize NestJS project in `apps/backend`.
- [x] Implement authentication module.
- [x] Develop core API modules (users, guides, catalog, orders, delivery, providers, bookings, finder, billing, chat, admin, webhooks).
- [x] Integrate Supabase client.
- [ ] Implement payment abstraction (Stripe, Paysera).
- [x] Implement AI Assistant mock responder.
- [x] Generate OpenAPI Swagger documentation.

## Phase 5: Admin Web Development (Next.js)
- [x] Initialize Next.js project in `apps/admin-web`.
- [x] Implement authentication and role-based access control.
- [x] Develop CMS for health guides, products, orders, deliveries, providers, bookings.
- [x] Integrate with backend API.

## Phase 6: Mobile App Development (React Native Expo)
- [x] Initialize Expo RN project in `apps/mobile`.
- [x] Implement authentication flow.
- [x] Develop core screens (Home, Chat, Marketplace, Express Delivery, Providers, Finder, Settings, Notifications).
- [x] Integrate with backend API.
- [x] Implement navigation and UI components.
- [x] Test on web platform.

## Phase 7: Infrastructure Setup (Terraform & Docker)
- [x] Create Dockerfiles for backend and admin-web.
- [x] Set up `docker-compose.dev.yml`.
- [x] Create Nginx reverse proxy configuration.
- [x] Write main Terraform configurations (variables, outputs).
- [x] Create VPC Terraform module.
- [x] Create Security Groups Terraform module.
- [x] Create RDS Terraform module.
- [x] Create ECS Terraform module.
- [x] Create Redis Terraform module.
- [x] Create S3 Terraform module.
- [x] Create CloudFront Terraform module.
- [x] Create Secrets Manager Terraform module.
- [x] Create Monitoring Terraform module.

## Phase 8: CI/CD Pipeline Configuration (GitHub Actions)
- [x] Configure CI workflows (install, lint, test, typecheck, build).
- [x] Configure CD workflows for development environment.
- [x] Configure CD workflows for production environment.
- [ ] Configure CD workflows (Docker build/push, Terraform plan/apply, Supabase migrations).

## Phase 9: Comprehensive Testing and Debugging
- [x] Outline testing strategy (Unit, Integration, E2E, Performance, Security).
- [x] Implement unit tests for backend authentication service.
- [x] Implement unit tests for other backend modules (health guides, products, chat).
- [x] Implement integration tests for backend API.
- [x] Implement E2E tests for Admin Web.
- [x] Implement E2E tests for Mobile App.
- [x] Conduct performance testing.
- [x] Conduct security testing.
- [x] Debug and fix identified issues.
- [ ] Implement unit tests (Vitest/Jest).
- [ ] Implement e2e tests (Playwright for admin web, Detox placeholder for mobile).
- [ ] Conduct integration testing.
- [ ] Debug and resolve issues.

## Phase 10: Documentation and Project Delivery
- [x] Update `README.md` with local run and deployment steps.
- [x] Populate `DECISIONS.md` with design choices.
- [x] Provide `.env.example` files.
- [x] Ensure conventional commits.
- [x] Deliver the fully bootstrapped monorepo.

