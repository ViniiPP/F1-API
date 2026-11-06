const { getAllDrivers } = require("../repositories/drivers.repository");

// listar todos os pilotos + filtros por país e títulos mundiais com query param
async function getDrivers(req, res) {
    try {
        const drivers = await getAllDrivers();
        const country = req.query.country;
        const worldChampionships = req.query.worldChampionships;

        // converter títulos mundiais para número
        let worldChampionshipsNumber;
        if (worldChampionships !== undefined) {
            worldChampionshipsNumber = Number(worldChampionships);

            if (!Number.isInteger(worldChampionshipsNumber) || worldChampionshipsNumber < 0) {
                return res.status(400).json({
                    message: "worldChampionships deve ser um inteiro maior ou igual a zero"
                });
            }
        }

        // remover espaços extras e tratar país vazio
        const normalizedCountry = country ? country.trim() || undefined : undefined;

        // verificar se o país informado existe nos dados
        const countryExists = drivers.some(
            (driver) => driver.country === normalizedCountry
        );

        if (normalizedCountry !== undefined && !countryExists) {
            return res.status(400).json({
                message: "País não encontrado nos dados da API"
            });
        }

        // aplicar filtros query param
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
}

// buscar piloto pelo ID
async function getDriverById(req, res) {
    try {
        const drivers = await getAllDrivers();

        // buscar piloto pelo ID informado na URL
        const id = req.params.id;
        const driverFound = drivers.find(
            (driver) => driver.id === id
        );

        if (!driverFound) {
            return res.status(404).json({
                message: "Piloto não encontrado"
            });
        }

        res.json(driverFound);

    } catch (err) {
        res.status(500).json({
            message: "Erro ao buscar pilotos - API"
        });
    }
}

module.exports = { getDrivers, getDriverById };
