-- 1. Création du type ENUM (obligatoire en Postgres avant usage)
CREATE TYPE question_type AS ENUM ('comment', 'ou', 'pourquoi', 'quoi', 'quand', 'qui');

-- 2. Table Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture BYTEA,
    currency INTEGER DEFAULT 0,
    role VARCHAR(50) CHECK (role IN ('supermoderator', 'moderator', 'creator', 'associate')) DEFAULT 'associate',
    likes INTEGER DEFAULT 0,
    is_claimed BOOLEAN DEFAULT FALSE,
    auth_provider_id VARCHAR(255) UNIQUE,
    invite_key VARCHAR(100) UNIQUE,
    linked_account_id INTEGER REFERENCES users(id)
);

-- 3. Table Category
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    color VARCHAR(6) NOT NULL
); -- Corrigé ) au lieu de }

-- 4. Table Memos
CREATE TABLE memos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES category(id),
    title VARCHAR(100) NOT NULL,
    description TEXT, -- Corrigé TEXT au lieu de TEXT(max)
    yt_url VARCHAR(300),
    question question_type, -- Utilise le type ENUM créé plus haut
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insertion des données
INSERT INTO users (username, role, currency, is_claimed, invite_key) VALUES 
('xylo', 'supermoderator', 500, TRUE, NULL),
('Borom', 'supermoderator', 500, FALSE, 'KEY-BOROM-XXXX'),
-- ... (le reste de tes inserts)
('Morom', 'supermoderator', 500, FALSE, 'KEY-MOROM-XXXX');