const express = require("express")
const router = express.Router();
const { getAllDrivers } = require("../repositories/drivers.repository");

// listar todos os pilotos + filtro de país com query param
router.get("/", async (req, res) => {
    try {
        const drivers = await getAllDrivers();
        const country = req.query.country;
        const worldChampionships = req.query.worldChampionships;

        // converte param de champios para number se informado
        let worldChampionshipsNumber;
        if (worldChampionships !== undefined) {
            worldChampionshipsNumber = Number(worldChampionships);

            // validação se é inteiro e maior que zero.  evitando -1 ou "abc"
            if (!Number.isInteger(worldChampionshipsNumber) || worldChampionshipsNumber < 0) {
                return res.status(400).json({
                    message: "worldChampionships deve ser um inteiro maior ou igual a zero"
                });
            }
        }

        // remover espaços extras e tratar string vazia da URL de país
        const normalizedCountry = country ? country.trim() || undefined : undefined;

        // verificação de país informado na url: verifica se pelo menos um piloto possui o país informado, se sim, vira true
        const countryExists = drivers.some(
            (driver) => driver.country === normalizedCountry
        );
        if(normalizedCountry !== undefined && !countryExists) {
            return res.status(400).json({
                message: "País não encontrado nos dados da API"
            })
        }

        // query params da URL
        const filteredDrivers = drivers.filter((driver) => {
            const matchesCountry =
                !normalizedCountry || driver.country === normalizedCountry;

            const matchesWorldChampionships =
                worldChampionships === undefined || 
                driver.worldChampionships === worldChampionshipsNumber;

            return matchesCountry && matchesWorldChampionships;
        });

        res.json(filteredDrivers);

    } catch (err) {
        res.status(500).json({
            message: "Erro ao buscar pilotos - API"
        });
    }
});

// listar piloto por ID
router.get("/:id", async (req, res) => {
    try {
        const drivers = await getAllDrivers();

        // busca o piloto informado pelo ID
        const id = req.params.id;
        const driverFound = drivers.find((driver) => driver.id === id);
        
        if(!driverFound){
            res.status(404).json({ message: "Piloto não encontrado"});
            return;
        }
        
        res.json(driverFound);

    } catch (err){
        res.status(500).json({
            message: "Erro ao buscar pilotos - API"
        })
    }
});

module.exports = router;