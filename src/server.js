const port = 3000;
const app = require('./app.js');

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
