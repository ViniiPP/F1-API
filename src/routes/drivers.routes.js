const express = require("express")
const router = express.Router();
const fs = require("fs");

// listar todos os pilotos + filtro de país com query param
router.get("/", (req, res) => {
    fs.readFile("./src/data/drivers.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ message: "Erro ao ler arquivo" });
            return;
        }

        // Transforma o string data em objeto JS
        const drivers = JSON.parse(data).drivers;
        const country = req.query.country;

        if (!country) {
            res.json(drivers);
            return;
        }

        const filteredDrivers = drivers.filter(
            (driver) => driver.country === country
        );

        res.json(filteredDrivers);
    });
});

// listar piloto por ID
router.get("/:id", (req, res) => {
    fs.readFile("./src/data/drivers.json", "utf8", (err, data) => {
        if(err){
            res.status(500).json({ message: "Erro ao ler arquivo"})
            return;
        }
        
        // Transforma o string data em objeto JS
        const drivers = JSON.parse(data).drivers;
        const id = req.params.id;
        const driverFound = drivers.find((driver) => driver.id === id);
        
        if(!driverFound){
            res.status(404).json({ message: "Piloto não encontrado"});
            return;
        }

        res.json(driverFound);
    });
});

module.exports = router;