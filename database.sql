-- 1. ROLE HIERARCHY & USER SYSTEM
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255), -- ADDED: For your local login system
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture BYTEA,
    currency INTEGER DEFAULT 0, 
    xp INTEGER DEFAULT 0,        -- ADDED: For the leveling system
    level INTEGER DEFAULT 1,     -- ADDED: For the leveling system
    user_color VARCHAR(20), 
    user_city VARCHAR(100), 
    -- Updated Roles: S-mod, Mod, Editor, Associate
    role VARCHAR(50) CHECK (role IN ('S-mod', 'Mod', 'Editor', 'Associate')) DEFAULT 'Associate',
    likes INTEGER DEFAULT 0,
    is_claimed BOOLEAN DEFAULT FALSE,
    auth_provider_id VARCHAR(255) UNIQUE, 
    invite_key VARCHAR(100) UNIQUE,
    linked_account_id INTEGER REFERENCES users(id)
);

-- Insert the new role-based supermods
INSERT INTO users (username, role, currency, is_claimed) VALUES 
('xylo', 'S-mod', 500, TRUE),
('zylo', 'Mod', 300, TRUE),
('bylo', 'Editor', 200, TRUE),
('dylo', 'Associate', 100, TRUE);

-- 2. THE FOROM (Community) SYSTEM
-- This allows different "foroms" to have their own naming conventions
CREATE TABLE foroms (
    id SERIAL PRIMARY KEY,
    forom_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. THE MATRIX DEFINITIONS (The Standard A-J and 0-9)
CREATE TABLE matrix_categories (
    id SERIAL PRIMARY KEY,
    code CHAR(1) UNIQUE NOT NULL -- 'A', 'B', 'C'... 'J'
);

CREATE TABLE matrix_tags (
    id SERIAL PRIMARY KEY,
    code CHAR(1) UNIQUE NOT NULL -- '0', '1', '2'... '9'
);

-- Populate the standard matrix codes
INSERT INTO matrix_categories (code) VALUES ('A'),('B'),('C'),('D'),('E'),('F'),('G'),('H'),('I'),('J');
INSERT INTO matrix_tags (code) VALUES ('0'),('1'),('2'),('3'),('4'),('5'),('6'),('7'),('8'),('9');

-- 4. FOROM CUSTOMIZATION (Where the "Missions" happen)
-- This is where "Category A" becomes "War Room" in Forom 1, but "Library" in Forom 2.
CREATE TABLE forom_category_names (
    forom_id INTEGER REFERENCES foroms(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES matrix_categories(id),
    custom_name VARCHAR(100),
    PRIMARY KEY (forom_id, category_id)
);

CREATE TABLE forom_tag_names (
    forom_id INTEGER REFERENCES foroms(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES matrix_tags(id),
    custom_name VARCHAR(100),
    PRIMARY KEY (forom_id, tag_id)
);

-- 5. THE MEMOS (The content inside the Matrix)
CREATE TABLE memos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    forom_id INTEGER REFERENCES foroms(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES matrix_categories(id), -- The A-J axis
    tag_id INTEGER REFERENCES matrix_tags(id),           -- The 0-9 axis
    title VARCHAR(100) NOT NULL,
    description TEXT,
    yt_url VARCHAR(300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Ensures a user can only have ONE memo per slot in a specific forom matrix
    UNIQUE(user_id, forom_id, category_id, tag_id) 
);