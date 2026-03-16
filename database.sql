CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture BYTEA,
    currency INTEGER DEFAULT 0,
    role VARCHAR(50) CHECK (role IN ('supermoderator', 'moderator', 'creator', 'associate')) DEFAULT 'associate',
    likes INTEGER DEFAULT 0,
    is_claimed BOOLEAN DEFAULT FALSE, -- Will be set to true when your Vite plugin authenticates a user
    auth_provider_id VARCHAR(255) UNIQUE, -- ID from your future auth plugin (e.g. OAuth/Wallet)
    invite_key VARCHAR(100) UNIQUE, -- Key to claim reserved spots (e.g., S-MOD)
    linked_account_id INTEGER REFERENCES users(id) -- For linking auth accounts to predefined users
);

-- Insert the 9 predefined supermoderators (1209 total users planned limit: 9 S-Mod, 50 Mod, 150 Creator, 1000 Associate)
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
}

CREATE TABLE memos(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES category(id),
    title VARCHAR(100) NOT NULL,
    description TEXT(max),
    yt_url VARCHAR (300),
    question ENUM('comment','ou','pourquoi','quoi','quand','qui'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
);
