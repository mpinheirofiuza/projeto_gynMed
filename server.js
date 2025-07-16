const app = require('./app');

// Defina a porta (pode ser variável de ambiente futuramente)
const PORT = 3000;

// Inicializa o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
