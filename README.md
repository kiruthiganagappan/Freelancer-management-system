# Freelancer Management System

A full-stack freelancer management platform with three roles — **Admin**, **Client**, and
**Freelancer** — built with React (Vite) on the frontend and Spring Boot + MySQL on the backend.

## Tech Stack

- **Frontend:** React.js (Vite), React Router, Axios, plain CSS
- **Backend:** Java Spring Boot, Spring Security (JWT), Spring Data JPA / Hibernate
- **Database:** MySQL
- **Auth:** JWT access tokens, BCrypt password hashing

## Project Structure

```
freelancer-management/
├── backend/                     Spring Boot API (Maven)
│   └── src/main/java/com/fms/
│       ├── config/              Security config, CORS, default admin seeder
│       ├── controller/          REST controllers
│       ├── dto/                 Request/response DTOs
│       ├── entity/              JPA entities (User, Project, Proposal)
│       ├── enums/                Role, ProjectStatus, ProposalStatus
│       ├── exception/           Custom exceptions + global handler
│       ├── repository/          Spring Data JPA repositories
│       ├── security/            JWT util, filter, UserDetailsService
│       └── service/             Business logic
├── frontend/                    React + Vite app
│   └── src/
│       ├── api/                 Axios instance with JWT interceptor
│       ├── components/          Navbar, Sidebar, route guards, shared UI
│       ├── context/             AuthContext
│       ├── pages/
│       │   ├── auth/            Login, Register, AdminLogin
│       │   ├── client/          Dashboard, projects, freelancer browsing
│       │   ├── freelancer/      Dashboard, browse/apply, profile
│       │   └── admin/           Dashboard, manage users/projects
│       └── styles/index.css
└── database/schema.sql          Reference SQL / table shapes
```

## Prerequisites

- Java 17+, Maven
- Node.js 18+, npm
- MySQL 8+ running locally

## 1. Database Setup

Create the database (Spring Boot will also auto-create it thanks to
`createDatabaseIfNotExist=true`, but you can do it manually too):

```sql
CREATE DATABASE IF NOT EXISTS freelancer_management_db;
```

Update credentials in `backend/src/main/resources/application.properties` if your MySQL
username/password aren't `root` / `root`.

## 2. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. Hibernate auto-creates/updates all tables on
startup (`ddl-auto=update`), and a default admin account is seeded automatically:

- **Admin email:** `admin@fms.com`
- **Admin password:** `Admin@123`

Use these on the `/admin/login` page. Change or remove the seeder in
`config/DataSeeder.java` for production use.

## 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** and talks to the API at
`http://localhost:8080/api` (configured in `src/api/axios.js`).

## Roles & Flow

- **Client:** registers via `/register`, creates projects, reviews proposals, accepts a
  freelancer (moves project to `IN_PROGRESS`), marks completed work as `COMPLETED`.
- **Freelancer:** registers via `/register`, browses `OPEN` projects, submits proposals,
  tracks applications, and updates progress on assigned projects.
- **Admin:** logs in at `/admin/login`, views platform-wide stats, manages/deactivates
  users, and moderates projects.

## Notes

- JWT secret and expiration are configurable in `application.properties`.
- CORS is restricted to `http://localhost:5173` by default (`app.cors.allowed-origins`).
- Admin accounts cannot self-register — only the seeded admin (or one you create directly
  in the database) can access `/admin/login`.
