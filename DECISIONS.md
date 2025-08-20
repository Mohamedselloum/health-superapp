# Design Decisions and Tradeoffs for Health SuperApp

## 1. Monorepo Structure
- **Decision:** Use pnpm workspaces for monorepo management.
- **Rationale:** pnpm's efficient disk space usage and strict dependency hoisting align well with a large-scale monorepo containing multiple applications and shared packages. It also provides better control over dependency versions.
- **Alternatives Considered:** Yarn Workspaces, Lerna (can be used with Yarn/npm, but pnpm offers better performance for large repos).

## 2. Backend Framework
- **Decision:** NestJS for the Backend API.
- **Rationale:** NestJS provides a robust, scalable, and strongly-typed framework built on TypeScript, which aligns with the requirement for strongly-typed backend. Its modular architecture, dependency injection, and built-in support for OpenAPI/Swagger make it suitable for complex enterprise-grade applications.
- **Alternatives Considered:** Express.js (more lightweight but requires more boilerplate for large apps), Koa.js.

## 3. Database and Authentication
- **Decision:** Supabase for Postgres, Auth, and Storage.
- **Rationale:** Supabase offers a powerful PostgreSQL database with real-time capabilities, built-in authentication, and storage solutions, significantly accelerating development. Its Row Level Security (RLS) features are crucial for implementing fine-grained access control.
- **Alternatives Considered:** Firebase (NoSQL, less flexible for complex relational data), custom PostgreSQL setup with separate auth service (more setup and maintenance overhead).

## 4. Mobile Application Framework
- **Decision:** React Native Expo for the Mobile App.
- **Rationale:** Expo simplifies React Native development by handling build processes, native module linking, and providing a managed workflow, allowing for faster iteration and deployment. It supports both iOS and Android from a single codebase.
- **Alternatives Considered:** Bare React Native (more control but higher complexity), Flutter (different language, steeper learning curve for existing JS/TS team).

## 5. Admin Web Framework
- **Decision:** Next.js for the Admin Web CMS.
- **Rationale:** Next.js provides server-side rendering (SSR) and static site generation (SSG) capabilities, which are beneficial for performance and SEO (though less critical for an admin panel, it's a robust React framework). Its API routes can also be used for backend-for-frontend patterns if needed.
- **Alternatives Considered:** Create React App (client-side rendering only), plain React with custom routing.

## 6. Infrastructure as Code (IaC)
- **Decision:** Terraform for AWS infrastructure.
- **Rationale:** Terraform allows for declarative infrastructure provisioning, enabling consistent and repeatable deployments across environments. AWS is a widely adopted cloud provider with a comprehensive suite of services.
- **Alternatives Considered:** AWS CloudFormation (vendor-locked), Pulumi (supports multiple languages, but Terraform is more mature for IaC).

## 7. CI/CD
- **Decision:** GitHub Actions for CI/CD pipelines.
- **Rationale:** GitHub Actions is tightly integrated with GitHub repositories, providing a seamless and automated workflow for building, testing, and deploying the monorepo applications. It supports complex workflows and matrix builds.
- **Alternatives Considered:** GitLab CI/CD, Jenkins, CircleCI.

## 8. Payment Gateways
- **Decision:** Stripe and Paysera with an abstraction layer.
- **Rationale:** Stripe is a leading payment gateway for subscriptions and general payments. Paysera provides regional payment solutions. An abstraction layer ensures flexibility and allows for easy integration of future payment providers without significant code changes.
- **Alternatives Considered:** PayPal, Braintree (less regional coverage for Paysera's use case).

## 9. Location Services
- **Decision:** OpenStreetMap/Nominatim by default, with Google Places API as an optional fallback.
- **Rationale:** Prioritizing OpenStreetMap/Nominatim reduces initial costs and reliance on proprietary APIs. The option to switch to Google Places API provides more comprehensive and accurate data when a key is provided, offering flexibility based on project needs and budget.
- **Alternatives Considered:** Exclusively Google Places API (higher cost), other mapping services (less comprehensive data).

## 10. AI Assistant Implementation
- **Decision:** Provider-agnostic interface with a mock responder initially, allowing for future integration of real LLMs (e.g., OpenAI).
- **Rationale:** This approach decouples the application logic from a specific LLM provider, making it easier to switch or integrate different AI models in the future. Starting with a mock allows for parallel development of the chat UI and backend logic without immediate LLM integration.
- **Alternatives Considered:** Direct integration with a specific LLM from the start (vendor lock-in, harder to switch).

## 11. Localization
- **Decision:** i18next for localization with EN/FR/AR support and RTL for Arabic.
- **Rationale:** i18next is a popular and flexible internationalization framework for JavaScript, supporting various frameworks and providing features like language detection and RTL layout. Storing locale in user profiles ensures consistent language experience across devices and server-side communications.
- **Alternatives Considered:** React-intl, custom localization solutions.

## 12. Testing Frameworks
- **Decision:** Vitest/Jest for unit testing, Playwright for admin web e2e, Detox (optional placeholder) for mobile e2e.
- **Rationale:** This combination provides comprehensive testing coverage across different parts of the monorepo. Vitest/Jest are fast and widely used for JavaScript/TypeScript projects. Playwright offers reliable end-to-end testing for web applications. Detox is a popular choice for React Native e2e testing.
- **Alternatives Considered:** Cypress (for web e2e), Appium (for mobile e2e).

## 13. Content Moderation and Safety
- **Decision:** Implement hard guardrails for medical and mental-health content, including prominent disclaimers and emergency call-to-actions.
- **Rationale:** This is a critical safety and legal requirement for a health application. Prioritizing user safety and avoiding diagnostic claims is paramount. An audit log for critical actions enhances accountability.
- **Alternatives Considered:** Less strict moderation (not acceptable for a health app).

## 14. Version Control and Commits
- **Decision:** Conventional Commits for commit messages.
- **Rationale:** Conventional Commits provide a standardized format for commit messages, making the commit history more readable, enabling automated changelog generation, and facilitating semantic versioning.
- **Alternatives Considered:** Ad-hoc commit messages (leads to inconsistent and less informative history).

## 15. Environment Variables
- **Decision:** Use `.env.example` files for root, mobile, admin-web, and backend.
- **Rationale:** This provides clear documentation for required environment variables and simplifies the setup process for developers across different environments.
- **Alternatives Considered:** Hardcoding environment variables (bad practice), relying solely on documentation without examples.



## 16. Subscriptions & Paywall
- **Decision:** Implement subscription management using Stripe and Paysera, with a free tier and premium features.
- **Rationale:** This allows for flexible monetization and caters to different user needs. Stripe is a robust platform for recurring payments, and Paysera addresses regional payment requirements.
- **Considerations:** Clear communication of free vs. premium features, secure handling of payment information, and robust webhook processing for subscription status updates.

## 17. AI Health Assistant
- **Decision:** Implement an AI Health Assistant with structured symptom intake, empathetic tone, non-diagnostic guidance, self-care suggestions, and triage capabilities. Integrate with curated health guides and product upsells.
- **Rationale:** Provides immediate, personalized health information and guidance to users, enhancing engagement and offering value. The non-diagnostic approach and safety guardrails are crucial for a health application.
- **Considerations:** Careful prompt engineering for empathetic tone and non-diagnostic responses, robust content moderation, and clear disclaimers. The LLM integration will be provider-agnostic initially.

## 18. Marketplace & Fast Delivery
- **Decision:** Develop a product catalog with inventory, cart, checkout, and express delivery capabilities via pluggable courier providers.
- **Rationale:** Enables e-commerce functionality within the app, offering convenience and potentially generating revenue. The pluggable courier system ensures flexibility for delivery options.
- **Considerations:** Real-time inventory management, secure payment processing, efficient order fulfillment, and reliable delivery tracking.

## 19. Health Providers On-Site
- **Decision:** Implement a provider marketplace for booking nurses/doctors for home visits, including scheduling, pricing, and verification.
- **Rationale:** Expands the app's service offerings to include in-person care, providing a comprehensive health solution. Verification ensures trust and quality of service.
- **Considerations:** Robust scheduling system, secure communication between users and providers, and a clear verification process for health professionals.

## 20. Finder (Doctors/Hospitals Near Me)
- **Decision:** Integrate location-based search for doctors/hospitals, defaulting to OpenStreetMap/Nominatim and optionally switching to Google Places API.
- **Rationale:** Provides essential utility for users to find nearby healthcare facilities. The dual-provider approach offers cost-effectiveness and flexibility.
- **Considerations:** Efficient geocoding and distance sorting, caching of results to reduce API calls, and clear user interface for displaying search results.

## 21. Admin CMS
- **Decision:** Develop a role-based Admin CMS for managing health guides (with versioning and workflow), products, providers, orders, and deliveries.
- **Rationale:** Essential for content management, operational control, and data management. Role-based access ensures security and proper segregation of duties.
- **Considerations:** Intuitive user interface for content creators and administrators, robust versioning for health guides, and comprehensive dashboards for monitoring operations.

## 22. Safety & Compliance
- **Decision:** Implement hard guardrails for medical and mental-health content, including prominent disclaimers, emergency call-to-actions, and no diagnostic claims.
- **Rationale:** This is a paramount requirement for a health application to ensure user safety, legal compliance, and ethical operation. An audit log will track critical actions.
- **Considerations:** Continuous monitoring of content, clear escalation paths for emergency situations, and regular review of disclaimers and safety protocols.


