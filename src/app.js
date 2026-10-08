const express = require('express');
const app = express();
const driversRoutes = require('./routes/drivers.routes');

app.get('/', (req, res) => {
    res.send("Olá F1-API")
});

app.get('/api/v1', (req, res) =>{
    const apiInfo ={
        name: "f1 API",
        version: "0.1",
        description: "API de dados históricos da Fórmula 1"
    }

    res.json(apiInfo);
});

app.use("/api/v1/drivers", driversRoutes);

module.exports = app