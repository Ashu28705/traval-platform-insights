CREATE DATABASE IF NOT EXISTS travel_ai;
USE travel_ai;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    place VARCHAR(100) NOT NULL,
    rating INT NOT NULL,
    review TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_destination_location (location),
    INDEX idx_destination_category (category),
    INDEX idx_destination_budget (budget),
    INDEX idx_destination_rating (rating)
);

INSERT INTO destinations (name, location, category, budget, rating, description, image)
SELECT 'Paris', 'France', 'Culture', 1800.00, 4.8, 'Museums, cafes, architecture, and iconic landmarks.', '/static/images/paris.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Paris');

INSERT INTO destinations (name, location, category, budget, rating, description, image)
SELECT 'Bali', 'Indonesia', 'Beach', 1200.00, 4.7, 'Beaches, temples, rice terraces, and tropical stays.', '/static/images/bali.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Bali');

INSERT INTO destinations (name, location, category, budget, rating, description, image)
SELECT 'Dubai', 'UAE', 'Luxury', 2200.00, 4.6, 'Luxury shopping, skyscrapers, desert safaris, and nightlife.', '/static/images/dubai.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Dubai');

INSERT INTO destinations (name, location, category, budget, rating, description, image)
SELECT 'Tokyo', 'Japan', 'City', 2000.00, 4.9, 'Modern city life, temples, food streets, and technology.', '/static/images/tokyo.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Tokyo');

INSERT INTO destinations (name, location, category, budget, rating, description, image)
SELECT 'London', 'United Kingdom', 'History', 1900.00, 4.5, 'Historic landmarks, museums, theatre, and river views.', '/static/images/london.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'London');

INSERT INTO destinations (name, location, category, budget, rating, description, image)
SELECT 'Maldives', 'Maldives', 'Beach', 2600.00, 4.8, 'Island resorts, diving, clear water, and honeymoon stays.', '/static/images/maldives.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Maldives');

INSERT INTO destinations (name, location, category, budget, rating, description, image)
SELECT 'Switzerland', 'Europe', 'Nature', 2500.00, 4.9, 'Alpine scenery, trains, lakes, and mountain villages.', '/static/images/switzerland.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Switzerland');

INSERT INTO destinations (name, location, category, budget, rating, description, image)
SELECT 'Amsterdam', 'Netherlands', 'Culture', 1600.00, 4.4, 'Canals, cycling, museums, and compact city exploration.', '/static/images/amsterdam.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Amsterdam');

INSERT INTO destinations (name, location, category, budget, rating, description, image)
SELECT 'New York', 'USA', 'City', 2300.00, 4.6, 'Landmarks, skyline views, parks, shows, and food culture.', '/static/images/newyork.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'New York');
