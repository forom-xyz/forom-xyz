require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({
    origin: ['https://forom.xyz', 'http://192.168.18.23:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_game_key';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// =============================================================================
// AUTHENTICATION
// =============================================================================

// LOCAL REGISTER
app.post('/api/register', async (req, res) => {
    const { username, email, password, color, city } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const dbQuery = `
            INSERT INTO users (username, email, password_hash, user_color, user_city, role) 
            VALUES ($1, $2, $3, $4, $5, 'Associate') 
            RETURNING id, username, role;
        `;
        const result = await pool.query(dbQuery, [username, email, hashedPassword, color, city]);
        res.status(201).json({ message: "Player created!", player: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Registration failed. Username might be taken." });
    }
});

// LOCAL LOGIN
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password_hash)) {
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);
            res.json({ token, player: { username: user.username, role: user.role, xp: user.xp, level: user.level } });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: "Login error" });
    }
});

// =============================================================================
// MATRIX MEMO SYSTEM (The 100 Memo Matrix)
// =============================================================================

// GET all memos for a user in a specific forom
app.get('/api/memos/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(`
            SELECT m.*, c.code as category_code, t.code as tag_code 
            FROM memos m
            JOIN matrix_categories c ON m.category_id = c.id
            JOIN matrix_tags t ON m.tag_id = t.id
            WHERE m.user_id = $1
        `, [userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch memos" });
    }
});

// SAVE/UPDATE a memo in the matrix
app.post('/api/memos', async (req, res) => {
    const { userId, foromId, categoryCode, tagCode, title, description, yt_url } = req.body;
    try {
        // Find IDs for the codes (e.g., 'A' -> 1, '0' -> 1)
        const catRes = await pool.query('SELECT id FROM matrix_categories WHERE code = $1', [categoryCode]);
        const tagRes = await pool.query('SELECT id FROM matrix_tags WHERE code = $1', [tagCode]);
        
        const catId = catRes.rows[0].id;
        const tagId = tagRes.rows[0].id;

        const query = `
            INSERT INTO memos (user_id, forom_id, category_id, tag_id, title, description, yt_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (user_id, forom_id, category_id, tag_id) 
            DO UPDATE SET title = $5, description = $6, yt_url = $7
            RETURNING *;
        `;
        const result = await pool.query(query, [userId, foromId, catId, tagId, title, description, yt_url]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save memo" });
    }
});

// XP LEVEL UP SYSTEM
app.post('/api/quest/complete', async (req, res) => {
    const { userId, xpReward } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET xp = xp + $1, level = floor((xp + $1)/100) + 1 WHERE id = $2 RETURNING xp, level', 
            [xpReward, userId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Level up failed" });
    }
});

const PORT = 8080; 
app.listen(PORT, '0.0.0.0', () => console.log(`Backend Server running on port ${PORT}`));
