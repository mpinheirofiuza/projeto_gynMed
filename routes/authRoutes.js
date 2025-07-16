const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');

const router = express.Router();

const usuarios = require('../models/users');

// Middleware para proteger rotas
function protegerRota(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login.html');
  }
  next();
}

// Rota raiz redireciona para o login
router.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Processa login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = usuarios.find(u => u.username === username);

  if (!user) {
    return res.redirect('/login.html?erro=usuario');
  }

  const senhaCorreta = bcrypt.compareSync(password, user.password);

  if (!senhaCorreta) {
    return res.redirect('/login.html?erro=senha');
  }

  req.session.usuario = user;
  res.redirect('/home');
});

// Página protegida
router.get('/home', protegerRota, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

module.exports = router;
