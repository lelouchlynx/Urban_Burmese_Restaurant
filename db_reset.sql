-- ═══════════════════════════════════════════════════
-- URBAN BURMESE RESTAURANT – Database RESET & SCHEMA
-- ═══════════════════════════════════════════════════
-- Run this file in phpMyAdmin or MySQL CLI when your schema/data
-- is "too messed up". It will DROP and RECREATE all core tables.
-- WARNING: This DELETES ALL existing data in these tables.

CREATE DATABASE IF NOT EXISTS urban_burmese CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE urban_burmese;

-- ─── DROP EXISTING TABLES (IN FK-SAFE ORDER) ───
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS contact_inquiries;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ─── USERS ───
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    phone         VARCHAR(30)  DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── SAVED ADDRESSES ───
CREATE TABLE IF NOT EXISTS addresses (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    label        VARCHAR(50)  NOT NULL DEFAULT 'Home',
    address_text TEXT         NOT NULL,
    is_default   TINYINT(1)   NOT NULL DEFAULT 0,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── CONTACT INQUIRIES ───
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(150) NOT NULL,
    phone        VARCHAR(30)  DEFAULT NULL,
    event_type   VARCHAR(50)  DEFAULT NULL,
    event_date   DATE         DEFAULT NULL,
    guests       INT          DEFAULT NULL,
    message      TEXT         DEFAULT NULL,
    submitted_at DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── RESERVATIONS ───
CREATE TABLE IF NOT EXISTS reservations (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT          DEFAULT NULL,
    guest_name        VARCHAR(100) NOT NULL,
    guest_email       VARCHAR(150) NOT NULL,
    guest_phone       VARCHAR(30)  DEFAULT NULL,
    table_number      INT          NOT NULL,
    party_size        INT          NOT NULL DEFAULT 2,
    reservation_date  DATE         NOT NULL,
    reservation_time  VARCHAR(10)  NOT NULL,
    special_requests  TEXT         DEFAULT NULL,
    status            ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─── ORDERS ───
CREATE TABLE IF NOT EXISTS orders (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT          DEFAULT NULL,
    guest_name       VARCHAR(100) DEFAULT NULL,
    guest_email      VARCHAR(150) DEFAULT NULL,
    guest_phone      VARCHAR(30)  DEFAULT NULL,
    delivery_address TEXT         DEFAULT NULL,
    status           ENUM('pending','preparing','ready','delivered','cancelled') NOT NULL DEFAULT 'pending',
    total            DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes            TEXT         DEFAULT NULL,
    created_at       DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─── ORDER ITEMS ───
CREATE TABLE IF NOT EXISTS order_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT          NOT NULL,
    item_name   VARCHAR(150) NOT NULL,
    spice_level VARCHAR(50)  DEFAULT NULL,
    `portion`   VARCHAR(20)  DEFAULT 'Regular',
    qty         INT          NOT NULL DEFAULT 1,
    unit_price  DECIMAL(10,2) NOT NULL,
    line_total  DECIMAL(10,2) NOT NULL,
    notes       TEXT         DEFAULT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

