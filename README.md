# Health SuperApp - Monorepo

A comprehensive health platform built with modern technologies, designed to handle millions of subscribers with scalable architecture.

## 🏗️ Architecture Overview

This is a monorepo containing:

- **Mobile App** (React Native Expo) - User-facing mobile application
- **Admin Web** (Next.js) - Browser-based CMS and operations console
- **Backend API** (NestJS) - Strongly typed TypeScript API server
- **Shared Packages** - UI components, utilities, configuration, and SDK
- **Infrastructure** - Docker, Terraform, and CI/CD configurations
- **Database** - Supabase (PostgreSQL + Auth + Storage) with migrations and RLS

## 🚀 Features

### Core Functionality
- **Subscriptions & Paywall**: Stripe + Paysera integration with free/premium tiers
- **AI Health Assistant**: Symptom intake, triage, and empathetic health guidance
- **Marketplace**: Product catalog with express delivery (≤1h) capability
- **Health Providers**: Book nurses/doctors for on-site visits
- **Finder**: Locate nearby doctors/hospitals (OpenStreetMap + Google Places)
- **Localization**: English, French, Arabic with RTL support

### Safety & Compliance
- Hard guardrails for medical content
- Emergency detection and crisis intervention
- Prominent medical disclaimers
- Audit logging for critical actions
- No diagnostic claims policy

## 📁 Project Structure

```
health-superapp/
├── apps/
│   ├── mobile/              # Expo React Native app
│   ├── admin-web/           # Next.js admin interface
│   └── backend/             # NestJS API server
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── utils/               # Shared utilities
│   ├── config/              # Shared configuration
│   └── sdk/                 # API client SDK
├── infra/
│   ├── docker/              # Docker configurations
│   └── terraform/           # Infrastructure as Code
├── supabase/
│   ├── migrations/          # Database migrations
│   └── seed/                # Seed data
├── .github/workflows/       # CI/CD pipelines
└── docs/                    # Documentation
```

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Supabase Auth
- **API Documentation**: OpenAPI/Swagger
- **Validation**: class-validator + class-transformer
- **Rate Limiting**: @nestjs/throttler

### Frontend
- **Mobile**: React Native with Expo
- **Admin Web**: Next.js with TypeScript
- **UI Framework**: React Native Web compatible components
- **State Management**: Context API / Redux Toolkit
- **Styling**: Styled Components / Tailwind CSS

### Infrastructure
- **Cloud Provider**: AWS (default)
- **Containerization**: Docker
- **Infrastructure**: Terraform
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (optional)

### Payments & External Services
- **Payments**: Stripe, Paysera
- **Maps**: OpenStreetMap/Nominatim, Google Places API (optional)
- **AI**: OpenAI API (configurable)

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- Supabase CLI (optional)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd health-superapp
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment templates
   cp .env.example .env
   cp apps/backend/.env.example apps/backend/.env
   cp apps/admin-web/.env.example apps/admin-web/.env
   cp apps/mobile/.env.example apps/mobile/.env
   
   # Configure your environment variables
   # See Environment Variables section below
   ```

3. **Database Setup**
   ```bash
   # Run Supabase migrations (if using Supabase CLI)
   supabase db reset
   
   # Or apply migrations manually to your Supabase project
   ```

4. **Development**
   ```bash
   # Start backend API
   cd apps/backend
   pnpm run start:dev
   
   # Start admin web (new terminal)
   cd apps/admin-web
   pnpm run dev
   
   # Start mobile app (new terminal)
   cd apps/mobile
   pnpm run start
   ```

### Environment Variables

#### Root `.env`
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PAYSERA_PROJECT_ID=your_project_id
PAYSERA_PASSWORD=your_password

# External APIs (Optional)
GOOGLE_PLACES_API_KEY=your_google_places_api_key
OPENAI_API_KEY=your_openai_api_key

# Security
JWT_SECRET=your-jwt-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
```

## 🏃‍♂️ Development Workflow

### Backend Development
```bash
cd apps/backend

# Development
pnpm run start:dev

# Testing
pnpm run test
pnpm run test:e2e

# Build
pnpm run build

# API Documentation
# Available at http://localhost:3001/docs
```

### Frontend Development
```bash
# Admin Web
cd apps/admin-web
pnpm run dev

# Mobile App
cd apps/mobile
pnpm run start
pnpm run ios     # iOS simulator
pnpm run android # Android emulator
```

### Database Management
```bash
# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db reset

# Generate types
supabase gen types typescript --local > types/supabase.ts
```

## 🧪 Testing

### Unit Tests
```bash
# Backend
cd apps/backend && pnpm run test

# Frontend packages
cd packages/utils && pnpm run test
```

### E2E Tests
```bash
# Admin web
cd apps/admin-web && pnpm run test:e2e

# Mobile (when configured)
cd apps/mobile && pnpm run test:e2e
```

## 🚀 Deployment

### Docker Development
```bash
# Start all services
docker-compose -f infra/docker/docker-compose.dev.yml up

# Build production images
docker build -f infra/docker/Dockerfile.backend -t health-superapp-backend .
docker build -f infra/docker/Dockerfile.admin-web -t health-superapp-admin .
```

### AWS Deployment
```bash
cd infra/terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply
```

### CI/CD
The project includes GitHub Actions workflows for:
- **CI**: Lint, test, type-check, build
- **CD**: Docker build/push, Terraform deployment, database migrations

## 📊 Database Schema

### Core Tables
- `profiles` - User profiles extending Supabase auth
- `subscriptions` - User subscription management
- `health_guides` - CMS-managed health content
- `products` - Marketplace product catalog
- `orders` - E-commerce order management
- `chat_sessions` & `chat_messages` - AI assistant conversations
- `providers` & `provider_services` - Healthcare provider marketplace
- `bookings` - Provider appointment scheduling
- `deliveries` - Order fulfillment tracking

### Security
- Row Level Security (RLS) policies for all tables
- Role-based access control (user, admin, provider, courier)
- Audit logging for critical operations

## 🔒 Security Considerations

### Medical Content Safety
- Emergency symptom detection with immediate escalation
- Crisis intervention for mental health concerns
- Prominent medical disclaimers on all health content
- No diagnostic claims policy
- Content moderation hooks

### Data Protection
- HIPAA-compliant data handling practices
- Encrypted data transmission (TLS)
- Secure authentication with JWT
- Rate limiting and DDoS protection
- Regular security audits

## 🌍 Internationalization

### Supported Languages
- **English** (default)
- **French**
- **Arabic** (with RTL support)

### Implementation
- i18next for translation management
- Automatic locale detection
- User preference override
- Server-side locale handling for emails/notifications

## 📈 Scalability Features

### Performance Optimizations
- Database indexing for high-traffic queries
- Caching strategies (Redis integration ready)
- CDN for static assets
- Image optimization and lazy loading
- API response pagination

### Infrastructure Scaling
- Containerized microservices architecture
- Auto-scaling groups in AWS
- Load balancing with Application Load Balancer
- Database read replicas support
- Horizontal scaling capabilities

## 🤝 Contributing

### Development Guidelines
1. Follow conventional commit messages
2. Use TypeScript for all new code
3. Write tests for new features
4. Update documentation for API changes
5. Follow ESLint and Prettier configurations

### Code Review Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Submit pull request with description
4. Address review feedback
5. Merge after approval and CI passes

## 📚 API Documentation

### Swagger/OpenAPI
- **Development**: http://localhost:3001/docs
- **Production**: https://api.your-domain.com/docs

### Key Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User authentication
- `GET /api/health-guides` - Public health content
- `GET /api/products` - Product catalog
- `POST /api/chat/sessions` - Start AI chat session
- `POST /api/orders` - Create marketplace order

## 🆘 Support & Troubleshooting

### Common Issues
1. **Build Errors**: Ensure all environment variables are set
2. **Database Connection**: Verify Supabase credentials
3. **Mobile App**: Check Expo CLI version and dependencies
4. **API Errors**: Review logs in backend console

### Getting Help
- Check the [Issues](link-to-issues) page
- Review [Documentation](link-to-docs)
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Supabase for backend infrastructure
- Expo for mobile development platform
- NestJS for robust API framework
- The open-source community for excellent tools and libraries

---

**⚠️ Important Medical Disclaimer**: This application provides general health information only and is not intended to diagnose, treat, cure, or prevent any disease. Always consult with qualified healthcare professionals for medical advice, diagnosis, and treatment.

