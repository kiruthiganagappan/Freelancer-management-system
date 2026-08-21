-- ==========================================================
-- Freelancer Management System - Database Setup
-- ==========================================================
-- Spring Boot + Hibernate (ddl-auto=update) will create/update
-- these tables automatically on startup. This script is provided
-- for reference and for manually creating the database if needed.
-- ==========================================================

CREATE DATABASE IF NOT EXISTS freelancer_management_db;
USE freelancer_management_db;

-- Hibernate will generate tables matching this shape:

-- CREATE TABLE users (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     role VARCHAR(50) NOT NULL,          -- ROLE_ADMIN, ROLE_CLIENT, ROLE_FREELANCER
--     active BOOLEAN NOT NULL DEFAULT TRUE,
--     skills VARCHAR(1000),
--     experience VARCHAR(255),
--     bio VARCHAR(2000),
--     availability VARCHAR(255),
--     created_at DATETIME
-- );

-- CREATE TABLE projects (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     description VARCHAR(3000),
--     budget DOUBLE,
--     deadline DATE,
--     status VARCHAR(50) NOT NULL,        -- OPEN, IN_PROGRESS, COMPLETED, CANCELLED
--     client_id BIGINT NOT NULL REFERENCES users(id),
--     freelancer_id BIGINT REFERENCES users(id),
--     created_at DATETIME
-- );

-- CREATE TABLE proposals (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     message VARCHAR(2000),
--     expected_budget DOUBLE,
--     status VARCHAR(50) NOT NULL,        -- PENDING, ACCEPTED, REJECTED
--     freelancer_id BIGINT NOT NULL REFERENCES users(id),
--     project_id BIGINT NOT NULL REFERENCES projects(id),
--     created_at DATETIME
-- );

-- A default admin account (admin@fms.com / Admin@123) is seeded
-- automatically on first startup by DataSeeder.java.
