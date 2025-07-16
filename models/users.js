const bcrypt = require('bcryptjs');

// Senha padrão criptografada
const senhaPadrao = bcrypt.hashSync('123456', 10);

// Lista de usuários
const usuarios = [
  {
    id: 1,
    username: 'admin',
    password: senhaPadrao,
    role: 'admin'  // Permissão de administrador
  },
  {
    id: 2,
    username: 'usuario',
    password: senhaPadrao,
    role: 'usuario'  // Permissão básica
  }
];

// Exporta o array de usuários
module.exports = usuarios;
