const { getAllDrivers } = require("../repositories/drivers.repository");

// listar todos os pilotos + filtros por país e títulos mundiais com query param
async function getDrivers(req, res, next) {
    try {
        const drivers = await getAllDrivers();
        const country = req.query.country;
        const team_id = req.query.team_id;

        const numericFields = [
            "worldChampionships",
            "number",
            "wins",
            "poles",
            "podiums",
            "first_entry"
        ];

        const numericFilters = {};

        // converter títulos mundiais para número
        // validar também os demais filtros numéricos
        for (const field of numericFields) {
            const value = req.query[field];

            if (value === undefined) {
                continue;
            }

            const number = Number(value);
            const minimum = ["number", "first_entry"].includes(field) ? 1 : 0;

            if (
                typeof value !== "string" ||
                value.trim() === "" ||
                !Number.isSafeInteger(number) ||
                number < minimum
            ) {
                const rule = minimum === 1
                    ? "maior que zero"
                    : "maior ou igual a zero";

                return res.status(400).json({
                    message: `${field} deve ser um inteiro ${rule}`
                });
            }

            numericFilters[field] = number;
        }

        // remover espaços extras e tratar país vazio
        const normalizedCountry = typeof country === "string"
            ? country.trim() || undefined
            : undefined;

        const normalizedTeamId = typeof team_id === "string"
            ? team_id.trim().toUpperCase() || undefined
            : undefined;

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

            const matchesTeam =
                !normalizedTeamId || driver.team_id === normalizedTeamId;

            const matchesNumericFields = numericFields.every((field) =>
                numericFilters[field] === undefined ||
                driver[field] === numericFilters[field]
            );

            return matchesCountry && matchesTeam && matchesNumericFields;
        });

        res.json(filteredDrivers);

    } catch (err) {
        next(err);
    }
}

// buscar piloto pelo ID
async function getDriverById(req, res, next) {
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
        next(err);
    }
}

module.exports = { getDrivers, getDriverById };
