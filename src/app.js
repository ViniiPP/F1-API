const express = require('express');
const app = express();

const driversRoutes = require('./routes/drivers.routes');
const teamsRoutes = require("./routes/teams.routes");

const { notFound } = require("./middlewares/notFound.middleware");
const { errorHandler } = require("./middlewares/errorHandler.middleware");

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

// rotas
app.use("/api/v1/drivers", driversRoutes);
app.use("/api/v1/teams", teamsRoutes);

// middlewares
app.use(notFound);
app.use(errorHandler);


module.exports = app