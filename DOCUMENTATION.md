# Health SuperApp - Comprehensive Documentation

## 1. Project Overview

The Health SuperApp is a comprehensive digital health platform designed to provide users with a wide range of health-related services, including personalized health guidance, a marketplace for health products, and an AI-powered chat assistant for symptom assessment and health information. The application is built with scalability, security, and performance in mind, capable of serving millions of subscribers.

### 1.1. Vision and Mission

**Vision:** To empower individuals to take control of their health and well-being through accessible, personalized, and intelligent digital health solutions.

**Mission:** To deliver a seamless and engaging health experience by integrating advanced AI, a robust e-commerce platform, and expert-curated health content, all within a secure and scalable ecosystem.

### 1.2. Key Features

- **Personalized Health Guidance**: Curated articles, guides, and programs tailored to individual health needs and goals.
- **Health Marketplace**: A platform for purchasing health products, supplements, and wellness services with express delivery options.
- **AI Chat Assistant**: An intelligent assistant for symptom assessment, health information, and personalized recommendations, with safety guardrails for medical advice.
- **User Management**: Secure user registration, authentication, and profile management with role-based access control.
- **Admin Web Interface**: A powerful web application for administrators to manage content, products, users, orders, and monitor application performance.
- **Mobile Application**: Intuitive and feature-rich mobile apps for iOS and Android, providing on-the-go access to all platform services.

### 1.3. Target Audience

The Health SuperApp targets individuals seeking proactive health management, access to reliable health information, convenient purchase of health products, and personalized support for their wellness journey. This includes health-conscious consumers, individuals with specific health conditions, and those looking for a holistic approach to well-being.

### 1.4. Architecture Overview

The Health SuperApp employs a modern, scalable microservices architecture, leveraging a monorepo setup for efficient development and deployment. The core components include:

- **Backend (NestJS)**: A robust and scalable API layer handling business logic, data processing, and integrations with external services.
- **Admin Web (Next.js)**: A server-rendered React application providing a rich user interface for administrative tasks.
- **Mobile App (React Native Expo)**: Cross-platform mobile applications for seamless user experience on both iOS and Android devices.
- **Supabase**: A powerful open-source Firebase alternative providing PostgreSQL database, authentication, and real-time capabilities.
- **AWS Cloud Infrastructure**: A highly available and scalable cloud environment utilizing services like ECS Fargate, RDS, ElastiCache, S3, and CloudFront.
- **CI/CD Pipeline (GitHub Actions)**: Automated workflows for continuous integration, testing, and deployment across multiple environments.

This architecture ensures high performance, reliability, security, and ease of maintenance, capable of supporting millions of concurrent users and a vast amount of data.




## 2. Technical Documentation

### 2.1. Backend (NestJS)

The backend of the Health SuperApp is built using NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It leverages TypeScript and follows a modular architecture, making it highly maintainable and extensible.

#### 2.1.1. Technologies Used

- **NestJS**: Framework for building the API.
- **TypeScript**: Primary programming language.
- **Supabase Client**: For interacting with the PostgreSQL database and authentication.
- **Jest**: For unit and integration testing.
- **Swagger (OpenAPI)**: For API documentation and interactive testing.
- **Redis**: For caching and session management.
- **OpenAI API**: For AI chat assistant integration.
- **Stripe/Paysera**: For payment processing (integration points).

#### 2.1.2. Project Structure

```
apps/backend/
├── src/
│   ├── auth/             # Authentication module (login, signup, JWT, guards)
│   ├── chat/             # AI Chat assistant module (symptom intake, responses)
│   ├── config/           # Application configuration (Supabase, environment)
│   ├── health-guides/    # Health guides CMS module (articles, categories)
│   ├── products/         # Marketplace products module (listings, inventory)
│   ├── shared/           # Shared utilities, DTOs, interfaces
│   ├── app.module.ts     # Root application module
│   ├── main.ts           # Application entry point
│   └── ...
├── test/                 # E2E and integration tests
├── Dockerfile            # Dockerization for deployment
├── nest-cli.json         # NestJS CLI configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── ...
```

#### 2.1.3. Key Modules and Functionality

- **Authentication (`auth`)**: Handles user registration, login, and session management using JWT (JSON Web Tokens) and integrates with Supabase for secure user authentication. It includes guards and decorators for role-based access control, ensuring that only authorized users can access specific resources.

- **AI Chat Assistant (`chat`)**: Provides an intelligent conversational interface for users to describe symptoms, ask health-related questions, and receive personalized recommendations. It integrates with the OpenAI API for natural language processing and incorporates safety guardrails to ensure responsible and accurate medical information delivery. The module also manages chat history and user interactions.

- **Health Guides (`health-guides`)**: Implements a comprehensive Content Management System (CMS) for health-related articles, guides, and educational content. It supports content versioning, categorization, and search functionality, allowing administrators to easily manage and publish health information. The module is designed to deliver personalized content based on user profiles and preferences.

- **Products (`products`)**: Manages the health product marketplace, including product listings, inventory management, pricing, and order processing. It supports various product types, categories, and filtering options. Integration points for payment gateways (Stripe, Paysera) are defined to facilitate secure transactions.

- **Configuration (`config`)**: Centralizes application configuration, including database connection strings, API keys, and environment-specific settings. It uses NestJS's `ConfigModule` for secure and efficient configuration management.

#### 2.1.4. API Endpoints

The backend exposes a RESTful API with well-defined endpoints for various functionalities. Swagger (OpenAPI) documentation is automatically generated and available at `/docs` when the application is running, providing an interactive interface for exploring and testing the API.

**Example Endpoints:**

| Endpoint                 | Method | Description                                    | Authentication | Roles       |
| :----------------------- | :----- | :--------------------------------------------- | :------------- | :---------- |
| `/auth/signup`           | `POST` | Register a new user                            | None           | All         |
| `/auth/signin`           | `POST` | Authenticate user and get JWT                  | None           | All         |
| `/health-guides`         | `GET`  | Get all health guides                          | Optional       | All         |
| `/health-guides/:id`     | `GET`  | Get a specific health guide                    | Optional       | All         |
| `/health-guides`         | `POST` | Create a new health guide                      | Required       | Admin       |
| `/products`              | `GET`  | Get all products                               | Optional       | All         |
| `/products/:id`          | `GET`  | Get a specific product                         | Optional       | All         |
| `/chat/message`          | `POST` | Send a message to AI assistant                 | Required       | User        |
| `/chat/history/:userId`  | `GET`  | Get chat history for a user                    | Required       | User        |

#### 2.1.5. Scalability and Performance

- **Stateless Design**: The API is designed to be stateless, allowing for easy horizontal scaling by adding more instances.
- **Caching**: Utilizes Redis for caching frequently accessed data, reducing database load and improving response times.
- **Database Optimization**: Leverages PostgreSQL with proper indexing, query optimization, and connection pooling.
- **Load Balancing**: Designed to work behind an Application Load Balancer (ALB) for distributing traffic across multiple instances.
- **Containerization**: Packaged as Docker images for consistent deployment and easy scaling with container orchestration platforms like ECS Fargate.

#### 2.1.6. Security Considerations

- **JWT Authentication**: Secure token-based authentication for API access.
- **Role-Based Access Control (RBAC)**: Fine-grained control over resource access based on user roles.
- **Input Validation**: All incoming data is rigorously validated to prevent injection attacks and data corruption.
- **HTTPS/SSL**: Enforced for all API communication to ensure data encryption in transit.
- **Secrets Management**: Sensitive information (API keys, database credentials) is stored securely using AWS Secrets Manager.
- **Rate Limiting**: Implemented to protect against brute-force attacks and API abuse.
- **CORS**: Configured to allow only authorized origins to access the API.
- **Logging and Monitoring**: Comprehensive logging and monitoring are in place to detect and respond to security incidents.




### 2.2. Admin Web (Next.js)

The Admin Web interface is a powerful and intuitive web application built with Next.js, a React framework that enables server-side rendering and static site generation. It provides administrators with a comprehensive dashboard to manage all aspects of the Health SuperApp.

#### 2.2.1. Technologies Used

- **Next.js**: React framework for building the web application.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Primary programming language.
- **Tailwind CSS**: For rapid and responsive UI development.
- **Radix UI**: For accessible and customizable UI components.
- **Supabase Client**: For authentication and direct database interactions (for specific admin tasks).
- **SWR**: For data fetching and caching.
- **Playwright**: For end-to-end testing.

#### 2.2.2. Project Structure

```
apps/admin-web/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router (pages, layouts, API routes)
│   ├── components/     # Reusable React components
│   ├── lib/            # Utility functions, API clients, Supabase client
│   ├── styles/         # Tailwind CSS configurations
│   └── ...
├── e2e/                # End-to-end tests
├── Dockerfile          # Dockerization for deployment
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── ...
```

#### 2.2.3. Key Features and Functionality

- **Dashboard**: A central overview providing key metrics, recent activities, and quick access to administrative functions.
- **User Management**: Create, view, update, and delete user accounts. Manage user roles (e.g., admin, user, provider, courier) and permissions.
- **Health Guides CMS**: Full CRUD (Create, Read, Update, Delete) operations for health articles, categories, and tags. Supports rich text editing and content versioning.
- **Product Management**: Manage products in the marketplace, including adding new products, updating inventory, setting prices, and managing product categories and attributes.
- **Order & Delivery Tracking**: View and manage customer orders, track delivery status, and handle returns.
- **Provider Management**: Onboard and manage healthcare providers, including their profiles, services, and availability.
- **Analytics & Reporting**: Visualize key performance indicators (KPIs) related to user engagement, sales, and content popularity.
- **Authentication**: Secure login and session management for administrators, integrated with the backend authentication system.

#### 2.2.4. User Interface and Experience

The Admin Web interface is designed with a focus on usability and efficiency:

- **Modern Design**: Clean, intuitive, and responsive design using Tailwind CSS and Radix UI components.
- **Consistent Layout**: Standardized navigation, forms, and data tables for a consistent user experience.
- **Accessibility**: Built with accessibility best practices in mind to ensure usability for all administrators.
- **Performance**: Optimized for fast loading times and smooth interactions, leveraging Next.js features like server-side rendering and image optimization.

#### 2.2.5. API Integration

The Admin Web communicates with the NestJS backend API to perform all administrative operations. It uses a dedicated API client (`src/lib/api.ts`) to handle requests and responses, ensuring consistent data flow and error handling. Authentication tokens obtained from the backend are used to secure API calls.

#### 2.2.6. Deployment Considerations

The Admin Web application is containerized using Docker, allowing for easy deployment to container orchestration platforms like AWS ECS Fargate. Next.js's `output: 'standalone'` feature ensures that the build output is optimized for Docker images, resulting in smaller image sizes and faster deployments.




### 2.3. Mobile App (React Native Expo)

The Health SuperApp mobile application is developed using React Native with Expo, providing a single codebase for both iOS and Android platforms. This approach ensures a consistent user experience across devices while accelerating development and reducing maintenance overhead.

#### 2.3.1. Technologies Used

- **React Native**: Framework for building native mobile applications using JavaScript and React.
- **Expo**: A framework and platform for universal React applications, simplifying development, build, and deployment processes.
- **TypeScript**: Primary programming language.
- **React Navigation**: For handling navigation and routing within the application.
- **Supabase Client**: For authentication and direct database interactions (if needed for specific mobile features).
- **Detox**: For end-to-end testing (placeholder).

#### 2.3.2. Project Structure

```
apps/mobile/
├── assets/             # Images, fonts, and other static assets
├── src/
│   ├── components/     # Reusable React Native components
│   ├── navigation/     # Navigation stack and routes
│   ├── screens/        # Individual screens of the application
│   ├── services/       # API integration and data fetching logic
│   ├── utils/          # Utility functions
│   └── App.tsx         # Main application component
├── app.json            # Expo configuration
├── babel.config.js     # Babel configuration
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── ...
```

#### 2.3.3. Key Features and Functionality

- **Intuitive User Interface**: Designed for ease of use and a seamless mobile experience, with a focus on clear navigation and engaging visuals.
- **Home Screen**: Personalized dashboard displaying health stats, quick access to key features (AI Chat, Marketplace, Providers), and an emergency services button.
- **AI Chat**: An interactive chat interface for users to communicate with the AI assistant, providing symptom intake, health information, and personalized recommendations.
- **Health Marketplace**: Browse and purchase health products, with features like product listings, search, filters, and express delivery options.
- **Healthcare Providers**: Discover and connect with healthcare professionals, including options for online consultations and appointment booking.
- **User Profile**: Manage personal health information, view past interactions, and customize app settings.
- **Onboarding Experience**: A guided tour for new users to understand the app's features and benefits.

#### 2.3.4. User Experience and Design

The mobile app prioritizes a user-centric design:

- **Responsive Layouts**: Adapts to various screen sizes and orientations for optimal viewing on different devices.
- **Consistent Branding**: Maintains the Health SuperApp's visual identity with a consistent color palette, typography, and iconography.
- **Performance Optimization**: Optimized for smooth animations, fast loading times, and efficient resource usage.
- **Accessibility**: Designed with accessibility guidelines in mind to ensure usability for all users.

#### 2.3.5. API Integration

The mobile app interacts with the NestJS backend API to fetch and send data. It utilizes a service layer (`src/services/api.ts`) to manage API calls, ensuring data consistency and error handling. Secure authentication tokens are used for all API requests.

#### 2.3.6. Deployment Considerations

Expo simplifies the build and deployment process for React Native applications. The app can be easily built for iOS and Android using Expo Application Services (EAS). Over-the-air (OTA) updates can be pushed to users without requiring app store updates, allowing for rapid iteration and bug fixes.




### 2.4. Infrastructure (Terraform & Docker)

The Health SuperApp infrastructure is provisioned and managed using Terraform, an Infrastructure as Code (IaC) tool, and containerized with Docker. This approach ensures consistent, repeatable, and scalable deployments across different environments.

#### 2.4.1. Technologies Used

- **Terraform**: For defining, provisioning, and managing AWS cloud infrastructure.
- **Docker**: For containerizing the backend and admin web applications.
- **AWS**: Cloud provider for hosting the application.
  - **Amazon ECS (Elastic Container Service)**: For running Docker containers with Fargate launch type (serverless containers).
  - **Amazon RDS (Relational Database Service)**: For managed PostgreSQL database.
  - **Amazon ElastiCache**: For managed Redis caching service.
  - **Amazon S3 (Simple Storage Service)**: For object storage (assets, backups, logs).
  - **Amazon CloudFront**: For Content Delivery Network (CDN) and API/Admin web routing.
  - **Amazon ALB (Application Load Balancer)**: For distributing incoming application traffic.
  - **AWS Secrets Manager**: For securely storing and managing sensitive information.
  - **AWS CloudWatch**: For monitoring and logging.

#### 2.4.2. Infrastructure Architecture

The infrastructure is designed for high availability, scalability, and security:

- **Virtual Private Cloud (VPC)**: A logically isolated section of the AWS Cloud where resources are launched. It includes:
  - **Public Subnets**: For public-facing resources like the Application Load Balancer.
  - **Private Subnets**: For application containers (ECS Fargate tasks) and Redis, ensuring they are not directly accessible from the internet.
  - **Database Subnets**: For the RDS PostgreSQL instance, further isolating the database layer.
  - **NAT Gateways**: To allow instances in private subnets to connect to the internet for updates and external services.
  - **Internet Gateway**: To enable communication between the VPC and the internet.

- **Application Load Balancer (ALB)**: Distributes incoming traffic to the ECS services. It handles SSL termination, routing based on paths (e.g., `/api` to backend, `/admin` to admin web), and health checks.

- **ECS Cluster (Fargate)**: A serverless compute engine for Amazon ECS that allows running containers without managing servers. It hosts:
  - **Backend Service**: Runs multiple instances of the NestJS backend application.
  - **Admin Web Service**: Runs multiple instances of the Next.js admin web application.
  - **Auto Scaling**: Configured to automatically adjust the number of running tasks based on CPU utilization to handle varying loads.

- **RDS PostgreSQL**: A fully managed relational database service. It is configured for:
  - **Multi-AZ Deployment**: For high availability and automatic failover.
  - **Read Replicas**: (Optional) For offloading read traffic and improving performance.
  - **Automated Backups**: With configurable retention periods.
  - **Performance Insights**: For monitoring and troubleshooting database performance.

- **ElastiCache Redis**: A fully managed in-memory data store and cache. Used for:
  - **Session Management**: Storing user session data.
  - **Caching**: Reducing database load by caching frequently accessed data.

- **S3 Buckets**: Used for various storage needs:
  - **Assets Bucket**: For storing static assets like images, videos, and documents, served via CloudFront.
  - **Backups Bucket**: For storing database backups and other critical data.
  - **Logs Bucket**: For centralized storage of application and infrastructure logs.

- **CloudFront CDN**: A global content delivery network that speeds up delivery of web content. It is configured to:
  - **Cache Static Assets**: From the S3 assets bucket.
  - **Route API Traffic**: To the ALB for the backend service.
  - **Route Admin Web Traffic**: To the ALB for the admin web service.
  - **SSL/TLS**: Provides HTTPS encryption for all traffic.

- **Secrets Manager**: Securely stores sensitive credentials such as database passwords, API keys (OpenAI, Stripe, Supabase), and JWT secrets. ECS tasks are granted IAM roles to retrieve these secrets at runtime.

- **CloudWatch**: Provides monitoring and observability for the entire infrastructure. It collects metrics, logs, and sets up alarms for critical events (e.g., high CPU utilization, HTTP errors, database connections).

#### 2.4.3. Dockerization

Both the backend and admin web applications are containerized using Docker. `Dockerfile`s are provided for each application, enabling consistent builds and deployments across different environments. The Docker images are optimized for size and performance using multi-stage builds.

#### 2.4.4. Terraform Modules

The Terraform configuration is organized into modular components to promote reusability and maintainability:

- **`vpc`**: Manages the core network infrastructure (VPC, subnets, internet gateway, NAT gateways).
- **`security`**: Defines all necessary security groups for ALB, ECS tasks, RDS, Redis, Bastion, and VPC endpoints.
- **`rds`**: Provisions and configures the PostgreSQL database instance.
- **`redis`**: Sets up the ElastiCache Redis cluster.
- **`ecs`**: Manages the ECS cluster, task definitions, services, and auto-scaling policies.
- **`s3`**: Creates and configures S3 buckets for assets, backups, and logs.
- **`cloudfront`**: Sets up the CloudFront distribution for CDN and routing.
- **`secrets`**: Manages secrets in AWS Secrets Manager.
- **`monitoring`**: Configures CloudWatch log groups, SNS topics, and alarms.

Each module has its own `main.tf`, `variables.tf`, and `outputs.tf` files, encapsulating its resources, inputs, and exposed values. Environment-specific configurations (dev, staging, prod) are managed using `terraform.tfvars` files in separate directories.




### 2.5. CI/CD Pipeline (GitHub Actions)

The Health SuperApp utilizes GitHub Actions for its Continuous Integration (CI) and Continuous Delivery (CD) pipeline. This automation ensures that code changes are thoroughly tested and deployed efficiently and reliably across different environments.

#### 2.5.1. Workflow Overview

Two primary workflows are configured:

- **`ci.yml` (Continuous Integration)**: Triggered on every push to `main` or `develop` branches and on pull requests. It focuses on code quality, security, and build validation.
- **`deploy-dev.yml` (Continuous Deployment to Development)**: Triggered on pushes to the `develop` branch. It builds Docker images, pushes them to ECR, and applies Terraform changes to the development environment.
- **`deploy-prod.yml` (Continuous Deployment to Production)**: Triggered on pushes to the `main` branch. Similar to `deploy-dev.yml` but targets the production environment.

#### 2.5.2. CI Workflow (`ci.yml`)

This workflow ensures that all code changes meet quality and security standards before being merged or deployed. It includes the following jobs:

- **`build`**: 
  - **Checkout repository**: Fetches the latest code.
  - **Setup Node.js & pnpm**: Configures the Node.js environment and installs pnpm.
  - **Install dependencies**: Installs all project dependencies.
  - **Lint**: Runs ESLint to enforce code style and identify potential issues.
  - **Typecheck**: Verifies TypeScript code for type errors.
  - **Run tests**: Executes unit and integration tests for backend, admin web, and mobile apps.
  - **Build all applications**: Compiles the backend, admin web, and mobile applications.
  - **Upload production artifacts**: Saves built artifacts for potential future use in deployment.

- **`terraform-validate`**: 
  - **Setup Terraform**: Configures the Terraform CLI.
  - **Terraform Init**: Initializes the Terraform working directory.
  - **Terraform Validate**: Checks the Terraform configuration for syntax errors and consistency.

- **`docker-build-and-scan`**: 
  - **Build Docker images**: Builds Docker images for the backend and admin web applications.
  - **Docker Scan (Trivy)**: Scans the Docker images for known vulnerabilities (OS packages and application dependencies) with critical and high severity checks.

- **`supabase-lint`**: 
  - **Setup Supabase CLI**: Configures the Supabase CLI.
  - **Lint Supabase migrations**: Checks Supabase database migrations for potential issues in a dry-run mode.

- **`security-scan`**: 
  - **Run ESLint**: Re-runs ESLint for security-specific rules.
  - **CodeQL Analysis**: Performs advanced static analysis for security vulnerabilities using GitHub's CodeQL.

- **`dependency-audit`**: 
  - **Run `pnpm audit`**: Checks for known vulnerabilities in project dependencies.

- **`license-scan`**: 
  - **Run `license-checker`**: Scans for license compliance of project dependencies.

#### 2.5.3. CD Workflows (`deploy-dev.yml` and `deploy-prod.yml`)

These workflows automate the deployment process to the respective environments. They share a similar structure:

- **`deploy` job**: 
  - **Checkout repository**: Fetches the latest code.
  - **Configure AWS Credentials**: Sets up AWS credentials using OIDC for secure access.
  - **Setup Node.js & pnpm**: Configures the Node.js environment and installs pnpm.
  - **Install dependencies**: Installs all project dependencies.
  - **Build Docker images**: Builds the Docker images for the backend and admin web.
  - **Login to ECR**: Authenticates with Amazon Elastic Container Registry (ECR).
  - **Tag and Push Docker images to ECR**: Tags the built Docker images with environment-specific tags and pushes them to ECR.
  - **Setup Terraform**: Configures the Terraform CLI.
  - **Terraform Init**: Initializes Terraform with environment-specific backend configuration.
  - **Terraform Plan**: Generates an execution plan for infrastructure changes.
  - **Terraform Apply**: Applies the planned infrastructure changes, deploying new versions of services.
  - **Notify Deployment Success**: Provides a notification with the deployed application URL.

#### 2.5.4. Environment Variables and Secrets

Sensitive information like AWS credentials, API keys, and database secrets are stored securely in GitHub Secrets and AWS Secrets Manager. The CI/CD pipelines are configured to access these secrets securely, ensuring that sensitive data is never exposed in the codebase or logs.

#### 2.5.5. Scalability and Reliability

- **Automated Testing**: Reduces human error and ensures code quality before deployment.
- **Immutable Infrastructure**: Docker images and Terraform ensure that deployments are consistent and repeatable.
- **Rollback Capability**: Versioned Docker images and Terraform state allow for easy rollbacks to previous stable versions if issues arise.
- **Environment Isolation**: Separate deployment workflows and Terraform states for development and production environments prevent accidental changes and ensure stability.




## 3. Deployment Guide

This guide provides step-by-step instructions for deploying the Health SuperApp to an AWS environment using the provided Terraform configurations and Docker images.

### 3.1. Prerequisites

Before you begin, ensure you have the following installed and configured:

- **AWS Account**: An active AWS account with administrative access.
- **AWS CLI**: Configured with credentials for your AWS account.
- **Terraform**: Version 1.0 or higher installed.
- **Docker**: Installed and running on your local machine.
- **Node.js & pnpm**: Installed for building the applications locally.
- **GitHub Repository**: The Health SuperApp codebase pushed to a GitHub repository.
- **GitHub Actions**: Enabled for your repository.

### 3.2. Initial Setup (One-Time)

#### 3.2.1. Configure AWS S3 Backend for Terraform State

Terraform uses a state file to keep track of your deployed infrastructure. For production environments, it's crucial to store this state remotely and securely, typically in an S3 bucket with DynamoDB locking.

1. **Create S3 Bucket for Terraform State:**
   ```bash
   aws s3api create-bucket --bucket health-superapp-terraform-state --region us-east-1
   ```
   *Note: Replace `us-east-1` with your desired AWS region.*

2. **Enable Versioning on the S3 Bucket:**
   ```bash
   aws s3api put-bucket-versioning --bucket health-superapp-terraform-state --versioning-configuration Status=Enabled
   ```

3. **Create DynamoDB Table for State Locking:**
   ```bash
   aws dynamodb create-table \
       --table-name health-superapp-terraform-locks \
       --attribute-definitions AttributeName=LockID,AttributeType=S \
       --key-schema AttributeName=LockID,KeyType=HASH \
       --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
       --region us-east-1
   ```

#### 3.2.2. Configure AWS IAM Role for GitHub Actions OIDC

To allow GitHub Actions to securely deploy to your AWS account without long-lived credentials, configure an IAM role with OpenID Connect (OIDC).

1. **Create an IAM OIDC Provider:**
   Follow the AWS documentation to create an IAM OIDC provider for `token.actions.githubusercontent.com`.

2. **Create an IAM Role:**
   Create an IAM role (e.g., `github-actions-deploy-role`) with a trust policy that allows `token.actions.githubusercontent.com` to assume the role, conditioned on your GitHub repository.

   Example Trust Policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::YOUR_AWS_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
           },
           "StringLike": {
             "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_ORG/YOUR_REPO_NAME:*"
           }
         }
       }
     ]
   }
   ```
   *Replace `YOUR_AWS_ACCOUNT_ID`, `YOUR_GITHUB_ORG`, and `YOUR_REPO_NAME`.*

3. **Attach Policies to the IAM Role:**
   Attach necessary permissions to this role. For a full deployment, this role will need permissions to create/manage ECS, RDS, S3, CloudFront, Secrets Manager, and other related AWS resources. Example policies include `AmazonECS_FullAccess`, `AmazonRDSFullAccess`, `AmazonS3FullAccess`, `CloudFrontFullAccess`, `SecretsManagerReadWrite`, etc. **For production, adhere to the principle of least privilege and grant only the minimum necessary permissions.**

#### 3.2.3. Configure GitHub Repository Secrets

In your GitHub repository settings, navigate to `Settings > Secrets and variables > Actions` and add the following repository secrets:

- `AWS_ACCOUNT_ID`: Your AWS account ID.
- `AWS_REGION`: The AWS region where you are deploying (e.g., `us-east-1`).
- `JWT_SECRET`: A strong, random secret for JWT signing.
- `OPENAI_API_KEY`: Your OpenAI API key.
- `STRIPE_SECRET_KEY`: Your Stripe secret key.
- `PAYSERA_API_KEY`: Your Paysera API key (if applicable).
- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_ANON_KEY`: Your Supabase public anon key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key.
- `NEXTAUTH_SECRET`: A strong, random secret for NextAuth.

### 3.3. Deployment Steps

Once the initial setup is complete, deployments are automated via GitHub Actions.

#### 3.3.1. Deploy to Development Environment

To deploy to the development environment, push your changes to the `develop` branch:

```bash
git checkout develop
git add .
git commit -m "feat: Implement new feature for dev"
git push origin develop
```

This will trigger the `deploy-dev.yml` GitHub Actions workflow, which will:

1. Build Docker images for the backend and admin web.
2. Push these images to Amazon ECR (Elastic Container Registry).
3. Initialize and apply Terraform configurations for the `dev` environment, provisioning or updating all necessary AWS resources (VPC, ECS, RDS, Redis, S3, CloudFront, Secrets Manager, Monitoring).
4. Deploy the latest Docker images to the ECS services.

You can monitor the deployment progress in the GitHub Actions tab of your repository.

#### 3.3.2. Deploy to Production Environment

To deploy to the production environment, merge your `develop` branch into `main` and push the changes:

```bash
git checkout main
git merge develop
git push origin main
```

This will trigger the `deploy-prod.yml` GitHub Actions workflow, which will:

1. Build Docker images for the backend and admin web (using production tags).
2. Push these images to Amazon ECR.
3. Initialize and apply Terraform configurations for the `prod` environment.
4. Deploy the latest Docker images to the production ECS services.

**Important:** Ensure that your `terraform/environments/prod/terraform.tfvars` file is correctly configured with production-specific values, including the `domain_name` and `ssl_certificate_arn` for CloudFront.

### 3.4. Post-Deployment Verification

After a successful deployment, verify the application's functionality:

- **Access Application**: Navigate to the deployed application URL (outputted by the Terraform apply step in GitHub Actions).
- **Check Admin Panel**: Access the `/admin` path and log in to verify administrative functions.
- **Test API Endpoints**: Use tools like Postman or the Swagger UI (`/api/docs`) to test backend API endpoints.
- **Monitor Logs**: Check CloudWatch logs for any errors or warnings from your ECS tasks.
- **Check Metrics**: Monitor CloudWatch metrics for CPU utilization, memory usage, and other performance indicators.




## 4. User Manuals

### 4.1. Admin Web User Manual

This manual provides a guide for administrators on how to effectively use the Health SuperApp Admin Web interface to manage content, users, products, and monitor the application.

#### 4.1.1. Accessing the Admin Panel

1. Open your web browser and navigate to the Admin Web URL (e.g., `https://admin.yourdomain.com`).
2. Enter your administrator credentials (email and password) in the login form.
3. Click the "Sign In" button. Upon successful login, you will be redirected to the Admin Dashboard.

#### 4.1.2. Dashboard Overview

The Dashboard provides a high-level overview of the application's status and key metrics. You will see:

- **Statistics Cards**: Displaying real-time data such as total users, active health guides, number of products, and recent orders.
- **Quick Actions**: Shortcuts to frequently used administrative tasks like "Add New Health Guide," "Manage Products," or "View Users."
- **Recent Activity**: A timeline of recent administrative actions and system events.

#### 4.1.3. Navigation

The main navigation menu is located on the left sidebar, providing access to different sections of the Admin Panel:

- **Dashboard**: Returns you to the main overview.
- **Users**: Manage user accounts and roles.
- **Health Guides**: Create, edit, and publish health-related content.
- **Products**: Manage product listings, inventory, and categories.
- **Orders**: View and manage customer orders and delivery status.
- **Providers**: Manage healthcare provider profiles.
- **Analytics**: Access detailed reports and insights.
- **Settings**: Configure application-wide settings.

#### 4.1.4. Managing Users

1. Navigate to the "Users" section from the sidebar.
2. **View Users**: A table displays all registered users with their details (name, email, role, status).
3. **Search and Filter**: Use the search bar and filters to find specific users.
4. **Add New User**: Click the "Add User" button to create a new user account. Fill in the required details and assign a role.
5. **Edit User**: Click the "Edit" icon next to a user to modify their information, change their role, or update their status.
6. **Delete User**: Click the "Delete" icon to remove a user account. Confirm the action when prompted.

#### 4.1.5. Managing Health Guides

1. Go to the "Health Guides" section.
2. **View Guides**: A list of all health guides, showing title, author, status, and publish date.
3. **Create New Guide**: Click "Add New Guide." Enter the title, content (using the rich text editor), select categories, and add tags. You can save as a draft or publish immediately.
4. **Edit Guide**: Select a guide from the list to open its editor. Make changes and save or publish.
5. **Manage Categories/Tags**: Create, edit, or delete categories and tags to organize your content.

#### 4.1.6. Managing Products

1. Access the "Products" section.
2. **View Products**: A table listing all products with details like name, price, stock, and status.
3. **Add New Product**: Click "Add Product." Provide product name, description, price, stock quantity, images, and assign to categories.
4. **Edit Product**: Modify existing product details, update stock, or change pricing.
5. **Manage Categories**: Organize products into categories for better browsing.

#### 4.1.7. Managing Orders

1. Navigate to the "Orders" section.
2. **View Orders**: A list of all customer orders with status (e.g., pending, processing, shipped, delivered).
3. **Update Order Status**: Change the status of an order as it progresses through the fulfillment process.
4. **View Order Details**: Click on an order to see detailed information, including customer details, ordered items, and shipping information.

#### 4.1.8. Analytics

The "Analytics" section provides insights into application usage and performance. You can view:

- **User Engagement**: Active users, new registrations, session duration.
- **Sales Performance**: Revenue, popular products, order trends.
- **Content Popularity**: Most viewed health guides, popular search terms.

#### 4.1.9. Settings

Configure various application settings, such as:

- **General Settings**: Application name, contact information.
- **Email Settings**: SMTP configuration for notifications.
- **Integrations**: Manage API keys for external services (e.g., payment gateways).

#### 4.1.10. Logging Out

To securely log out of the Admin Panel, click on your profile icon or name in the top right corner and select "Sign Out."


### 4.2. Mobile App User Manual

This manual guides users on how to navigate and utilize the Health SuperApp mobile application to access health guidance, purchase products, interact with the AI assistant, and manage their health.

#### 4.2.1. Getting Started

1. **Download the App**: Download the Health SuperApp from the Apple App Store (for iOS devices) or Google Play Store (for Android devices).
2. **Sign Up/Log In**: 
   - **New Users**: Tap "Sign Up" and follow the prompts to create your account. You will need to provide your email and create a password.
   - **Existing Users**: Tap "Log In" and enter your registered email and password.
3. **Onboarding**: After logging in for the first time, you will be guided through a brief onboarding process highlighting the app's key features. You can skip this or complete it to get a better understanding of the app.

#### 4.2.2. Home Screen

The Home Screen is your personalized dashboard, providing a quick overview of your health and access to core features:

- **Health Stats**: Displays key health metrics (e.g., steps, sleep, heart rate - if integrated with wearables).
- **Quick Actions**: Large, prominent buttons for immediate access to:
  - **AI Chat**: Start a conversation with the AI health assistant.
  - **Express Delivery**: Quickly order health products for fast delivery.
  - **Find Providers**: Search for healthcare professionals.
- **Recent Activity**: A timeline of your recent interactions, such as new health guides read, products purchased, or chat sessions.
- **Emergency Button**: A clearly visible button for immediate access to emergency services or critical health information.

#### 4.2.3. AI Chat

Access the AI Chat from the Home Screen or the main navigation. This feature allows you to interact with an intelligent health assistant:

1. **Start a Conversation**: Type your question or symptom into the chat input field.
2. **Quick Questions**: Use the pre-defined quick question buttons for common inquiries.
3. **Receive Guidance**: The AI will provide information, assess symptoms, and offer personalized recommendations. Remember, this is for informational purposes only, and you should always consult a medical professional for diagnosis and treatment.
4. **Chat History**: Your conversations are saved, allowing you to revisit past advice.

#### 4.2.4. Health Marketplace

Explore and purchase health products and supplements:

1. **Browse Products**: Navigate through categories or use the search bar to find specific products.
2. **Filters**: Apply filters (e.g., price range, brand, category) to refine your search.
3. **Product Details**: Tap on a product to view detailed descriptions, ingredients, reviews, and pricing.
4. **Add to Cart**: Select the quantity and tap "Add to Cart."
5. **Checkout**: Proceed to the checkout process, where you can review your order, enter delivery details, and make payment.
6. **Order Tracking**: Track the status of your orders from placement to delivery.

#### 4.2.5. Healthcare Providers

Find and connect with healthcare professionals:

1. **Search for Providers**: Use filters to search by specialty, location, or availability.
2. **View Provider Profiles**: Tap on a provider to see their qualifications, experience, patient reviews, and services offered.
3. **Book Appointments**: Schedule online consultations or in-person appointments directly through the app (if available).
4. **Emergency Services**: Access a list of emergency contacts and nearest medical facilities.

#### 4.4.6. Profile and Settings

Manage your personal information and app preferences:

1. **Access Profile**: Tap on the profile icon in the navigation bar.
2. **Personal Information**: View and edit your personal details, health goals, and preferences.
3. **Health Summary**: A summary of your health data and progress.
4. **Settings**: Configure app notifications, language preferences, and privacy settings.
5. **Order History**: Review your past purchases and appointments.
6. **Log Out**: Securely log out of your account.

#### 4.4.7. Notifications

The app will send you notifications for important updates, such as:

- New health guides or articles.
- Order status updates.
- AI chat responses.
- Personalized health reminders.

You can manage your notification preferences in the "Settings" section of your profile.



