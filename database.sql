-- 1. Create the Enum for questions first
CREATE TYPE question_type AS ENUM ('comment', 'ou', 'pourquoi', 'quoi', 'quand', 'qui');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture BYTEA,
    currency INTEGER DEFAULT 0, 
    user_color VARCHAR(20), -- ADDED THIS for blue/yellow/red
    user_city VARCHAR(100), -- ADDED THIS for the town/city
    role VARCHAR(50) CHECK (role IN ('supermoderator', 'moderator', 'creator', 'associate')) DEFAULT 'associate',
    likes INTEGER DEFAULT 0,
    is_claimed BOOLEAN DEFAULT FALSE,
    auth_provider_id VARCHAR(255) UNIQUE, 
    invite_key VARCHAR(100) UNIQUE,
    linked_account_id INTEGER REFERENCES users(id)
);

-- Insert the supermods
INSERT INTO users (username, role, currency, is_claimed, invite_key) VALUES 
('xylo', 'supermoderator', 500, TRUE, NULL),
('Borom', 'supermoderator', 500, FALSE, 'KEY-BOROM-XXXX'),
('Dorom', 'supermoderator', 500, FALSE, 'KEY-DOROM-XXXX'),
('gorom', 'supermoderator', 500, FALSE, 'KEY-GOROM-XXXX'),
('horom', 'supermoderator', 500, FALSE, 'KEY-HOROM-XXXX'),
('jorom', 'supermoderator', 500, FALSE, 'KEY-JOROM-XXXX'),
('Korom', 'supermoderator', 500, FALSE, 'KEY-KOROM-XXXX'),
('Lorom', 'supermoderator', 500, FALSE, 'KEY-LOROM-XXXX'),
('Morom', 'supermoderator', 500, FALSE, 'KEY-MOROM-XXXX');

CREATE TABLE category(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    color VARCHAR(6) NOT NULL
); -- Fixed bracket to parenthesis

CREATE TABLE memos(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES category(id),
    title VARCHAR(100) NOT NULL,
    description TEXT, -- Fixed TEXT(max)
    yt_url VARCHAR (300),
    question question_type, -- Use the type created above
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Removed trailing comma
);