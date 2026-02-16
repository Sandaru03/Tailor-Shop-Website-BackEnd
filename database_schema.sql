-- Create Database
CREATE DATABASE IF NOT EXISTS tailor_shop_db;
USE tailor_shop_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT 'Not Given',
    isBlock BOOLEAN DEFAULT FALSE,
    role VARCHAR(50) DEFAULT 'customer',
    isEmailVerified BOOLEAN DEFAULT FALSE,
    image VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category ENUM('Hair & Skin Care', 'Ladies Fashion', 'Gents Fashion', 'Bridal & Party Wear', 'Accessories & Cosmetics') NOT NULL,
    year VARCHAR(10) NOT NULL,
    image VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(20) NOT NULL,
    garmentType VARCHAR(255) NOT NULL,
    gender ENUM('Gents', 'Ladies') NOT NULL,
    date VARCHAR(20) NOT NULL, -- Storing as string to match existing logic, preferably DATE
    time VARCHAR(20) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Availabilities Table
-- Note: Storing slots as JSON to simplify migration from MongoDB subdocuments
CREATE TABLE IF NOT EXISTS availabilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(20) NOT NULL UNIQUE,
    slots JSON, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Measurements Table
CREATE TABLE IF NOT EXISTS measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    measurements JSON, -- Storing all measurement fields in a JSON column
    videoFront VARCHAR(255),
    videoBack VARCHAR(255),
    status ENUM('pending', 'reviewed', 'completed') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
