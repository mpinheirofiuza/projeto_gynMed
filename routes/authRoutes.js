const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const users = require('../models/users');

const router = express.Router();

// Middleware para proteger rotas
function protegerRota(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }
    next();
}

// Middleware para proteger rotas administrativas
function protegerRotaAdmin(req, res, next) {
    if (!req.session.usuario || req.session.usuario.role !== 'admin') {
        return res.redirect('/home');
    }
    next();
}

// Rota raiz redireciona para o login
router.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Processa login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await users.findByUsername(username);

        if (!user) {
            return res.redirect('/login.html?erro=usuario');
        }

        const senhaCorreta = await bcrypt.compare(password, user.password);

        if (!senhaCorreta) {
            return res.redirect('/login.html?erro=senha');
        }

        req.session.usuario = { id: user.id, username: user.username, role: user.role };
        res.redirect('/home');
    } catch (err) {
        console.error('Erro no login:', err.message);
        res.redirect('/login.html?erro=servidor');
    }
});

// Página protegida (home)
router.get('/home', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

// Página de gerenciamento de usuários (admin)
router.get('/admin/users', protegerRotaAdmin, async (req, res) => {
    try {
        const usuarios = await users.findAll();
        res.sendFile(path.join(__dirname, '../public/admin.html'));
    } catch (err) {
        console.error('Erro ao carregar página de admin:', err.message);
        res.redirect('/home');
    }
});

// Criar novo usuário (admin)
router.post('/admin/users', protegerRotaAdmin, async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await users.findByUsername(username);
        if (existingUser) {
            return res.redirect('/admin/users?erro=usuario_existe');
        }

        await users.create(username, password, role || 'usuario');
        res.redirect('/admin/users?sucesso=usuario_criado');
    } catch (err) {
        console.error('Erro ao criar usuário:', err.message);
        res.redirect('/admin/users?erro=servidor');
    }
});

// Alterar senha (admin)
router.post('/admin/users/:id/password', protegerRotaAdmin, async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    try {
        await users.updatePassword(id, newPassword);
        res.redirect('/admin/users?sucesso=senha_atualizada');
    } catch (err) {
        console.error('Erro ao atualizar senha:', err.message);
        res.redirect('/admin/users?erro=servidor');
    }
});

// Alterar permissão (admin)
router.post('/admin/users/:id/role', protegerRotaAdmin, async (req, res) => {
    const { id } = req.params;
    const { newRole } = req.body;

    try {
        if (!['admin', 'usuario'].includes(newRole)) {
            return res.redirect('/admin/users?erro=role_invalido');
        }
        await users.updateRole(id, newRole);
        res.redirect('/admin/users?sucesso=role_atualizado');
    } catch (err) {
        console.error('Erro ao atualizar permissão:', err.message);
        res.redirect('/admin/users?erro=servidor');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html');
    });
});

module.exports = router;