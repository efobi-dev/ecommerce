# E-commerce Store

This project is a self-hosted, multi-store e-commerce platform designed for bulk purchasing with seamless continuous integration, automated rollbacks, and real-time monitoring.

## Key Features

- **Multi-store setup** allowing multiple stores to be managed within one application.
- **Role-based access control** with defined roles:
  - **Admin**: Manages specific stores and products.
  - **Superadmin**: Oversees the entire application.
  - **User**: Accesses profile, purchases products, and views order history.
- **In-built theming support** for light and dark modes.
- **Continuous deployment and rollback** using GitHub Actions, PM2, and Bash scripts.
- **Comprehensive monitoring** with alerts and logs to track system health.

## Tech Stack

- **Next.js**: Leveraging server components and server actions for a full-stack, performant application.
- **PostgreSQL**: Relational database for secure and reliable data storage.
- **Prisma ORM**: Simplifies database queries and migrations.
- **Tailwind CSS**: Provides responsive and customizable styling.
- **Shadcn UI**: UI library for seamless and cohesive design.
- **@oslojs**: Manages authentication and permissions, enhancing security.
- **Paystack**: Payment gateway integration for secure transactions.
- **Cloudflare**: Protects the platform with DDoS protection and rate limiting.
- **Bash Scripts, PM2, and GitHub Actions**: Enable continuous integration, deployments, and automatic rollbacks.

## Getting Started

### Prerequisites

1. **Node.js** (v20+ recommended)
2. **PostgreSQL** (for database setup)
3. **PM2** (for process management)
4. **GitHub Actions** (for CI/CD workflows)
5. **Cloudflare Account** (for security and rate limiting)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/efobi-dev/ecommerce.git
   cd ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - `.env` file for Next.js application.

4. Run initial migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project uses GitHub Actions, PM2, and custom Bash scripts for deployments and rollbacks.

1. **CI/CD Pipeline**: GitHub Actions are set up to automate testing, building, and deploying on every push.
2. **Rollback**: In case of failure, Bash scripts are available to automate rollbacks to the previous stable version.
3. **Monitoring**: Automated scripts notify administrators via a Telegram bot in case of any anomalies.

## Roles & Permissions

The platform has role-based access control, managed via @oslojs:

- **Superadmin**: Full access to the platform, including user and store management.
- **Admin**: Restricted to specific stores and products.
- **User**: Can manage their account, make purchases, and view their order history.

## Miscellaneous

- **Theming**: Supports light and dark modes.
- **Security**: Cloudflare integration for DDoS protection and rate limiting.

## TODO

- **User Profile and Account Management**: Enable users to manage their profiles, view order history, and update account information.
- **Analytics and Web Analytics**: Implement self-hosted analytics to track user behavior and engagement.
- **Automated Monitoring**: Use Bash scripts and a Telegram bot to automate uptime monitoring and error reporting.
- **Open Source Bash Scripts**: Publish all custom Bash scripts used in the CI/CD pipeline in a dedicated repository.

## Contributing

Contributions are welcome! Please open an issue to discuss any new ideas or improvements.
