const express = require('express');
const path = require('path');
const session = require('express-session');

const authRoutes = require('./routes/authRoutes');

const app = express();

// Configuração de middlewares globais
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'segredo-super-seguro',
  resave: false,
  saveUninitialized: true
}));

// Rotas principais
app.use('/', authRoutes);

// Exporta o app configurado
module.exports = app;
