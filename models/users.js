const bcrypt = require('bcryptjs');
const pool = require('./db');

const users = {
    // Encontrar um usuário por username
    async findByUsername(username) {
        try {
            const query = 'SELECT * FROM users WHERE username = $1';
            const res = await pool.query(query, [username]);
            return res.rows[0];
        } catch (err) {
            console.error('Erro ao buscar usuário:', err.message);
            throw err;
        }
    },

    // Criar um novo usuário
    async create(username, password, role = 'usuario') {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at';
            const values = [username, hashedPassword, role];
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (err) {
            console.error('Erro ao criar usuário:', err.message);
            throw err;
        }
    },

    // Listar todos os usuários
    async findAll() {
        try {
            const query = 'SELECT id, username, role, created_at FROM users';
            const res = await pool.query(query);
            return res.rows;
        } catch (err) {
            console.error('Erro ao listar usuários:', err.message);
            throw err;
        }
    },

    // Atualizar senha de um usuário
    async updatePassword(userId, newPassword) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            const query = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, username, role';
            const values = [hashedPassword, userId];
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (err) {
            console.error('Erro ao atualizar senha:', err.message);
            throw err;
        }
    },

    // Atualizar permissão de um usuário
    async updateRole(userId, newRole) {
        try {
            const query = 'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role';
            const values = [newRole, userId];
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (err) {
            console.error('Erro ao atualizar permissão:', err.message);
            throw err;
        }
    }
};

module.exports = users;