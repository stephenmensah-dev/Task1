# NestJS Authentication & Login History Tracking API

This project is a secure NestJS-based backend API that provides user authentication using **JWT (Access + Refresh Tokens)** and tracks user activity including login, logout, and refresh token usage in a `LoginHistory` resource.

---

## Features

-  **User Registration & Authentication**
  - Local strategy with hashed passwords (bcrypt)
  - JWT-based access and refresh token system
  - HTTP-only cookies for secure token storage

-  **Token Refresh Flow**
  - Refresh token is validated before issuing a new access token
  - Supports cookie-based refresh via custom Passport strategy

-  **User Logout**
  - Revokes refresh token on logout
  - Removes secure cookie

-  **Login History Tracking**
  - Logs every login, logout, and refresh event in the `LoginHistory` table
  - `ManyToOne` relationship with the `User` entity
---
##  Tech Stack

- **NestJS**
- **TypeORM** (with PostgreSQL or SQLite, configurable)
- **Passport.js** for authentication strategies
- **JWT** for access/refresh token management
- **Bcrypt** for password hashing
- **Express + Cookies** for session security
