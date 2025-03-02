# NestJS Learning Platform Backend

This is the backend for the Learning Platform built using **NestJS**, designed to manage courses, users, payments, and notifications efficiently.

## 🚀 Features

- **Authentication & Authorization** (JWT, Role-Based Access Control)
- **Course Management** (CRUD operations for courses)
- **User Management** (Profile, Roles, Permissions)
- **Payments & Subscriptions** (Stripe, PayPal integration)
- **Notifications System** (Email, SMS, WebSockets)
- **Modular & Scalable Architecture** (Organized and maintainable structure)
- **Database Integration** (Prisma ORM / TypeORM)

---

## 📂 Project Structure

```
nestjs-learning-platform-backend/
│── src/
│   │── modules/                      # Feature Modules
│   │   │── admin/                     # Admin Module
│   │   │   ├── analytics/
│   │   │   │   ├── courses-analytics.service.ts
│   │   │   │   ├── users-analytics.service.ts
│   │   │   ├── guards/
│   │   │   │   ├── admin.guard.ts
│   │   │   ├── dto/
│   │   │   │   ├── update-user-role.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── admin-log.entity.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   ├── admin.module.ts
│   │
│   │   │── users/                     # User Management
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── user.entity.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │
│   │   │── courses/                   # Courses Management
│   │   │   ├── dto/
│   │   │   │   ├── create-course.dto.ts
│   │   │   │   ├── update-course.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── course.entity.ts
│   │   │   ├── courses.controller.ts
│   │   │   ├── courses.service.ts
│   │   │   ├── courses.module.ts
│   │
│   │   │── payments/                  # Payments & Subscriptions
│   │   │   ├── dto/
│   │   │   │   ├── create-payment.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── payment.entity.ts
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── payments.module.ts
│   │
│   │   │── notifications/              # Notifications Module
│   │   │   ├── dto/
│   │   │   │   ├── create-notification.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── notification.entity.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.module.ts
│   │
│   │   │── auth/                      # Authentication & Authorization
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│
│   │── shared/                        # Shared Utilities
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   ├── filters/
│   │   │   ├── exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│
│   │── database/                       # Database Connection (Prisma or TypeORM)
│   │   ├── prisma.service.ts
│   │   ├── prisma.module.ts
│   │   ├── prisma.schema.prisma
│
│   │── config/                         # Configuration Files
│   │   ├── app.config.ts
│   │   ├── jwt.config.ts
│   │   ├── database.config.ts
│
│   │── app.controller.ts
│   │── app.service.ts
│   │── app.module.ts
│
│── prisma/                             # Prisma Migrations
│   │── migrations/
│   │   ├── migration_001.sql
│   │   ├── migration_002.sql
│   │── schema.prisma
│
│── test/                               # Unit & e2e Tests
│   │── admin.e2e-spec.ts
│   │── auth.e2e-spec.ts
│   │── users.e2e-spec.ts
│
│── node_modules/                       # Node Dependencies
│── .env                                # Environment Variables
│── .gitignore                          # Git Ignore File
│── README.md                           # Documentation
│── package.json                         # Dependencies
│── tsconfig.json                         # TypeScript Config
│── nest-cli.json                         # NestJS Config
```

---
