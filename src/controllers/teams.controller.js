const { getAllTeams } = require("../repositories/teams.repository");

// listar todas as equipes + filtros
async function getTeams(req, res, next) {
    try {
        const teams = await getAllTeams();
        const country = req.query.country;
        const power_unit = req.query.power_unit;
        const base = req.query.base;

        const numericFields = [
            "first_entry",
            "world_championships",
            "poles",
            "fastest_laps"
        ];

        const numericFilters = {};

        // converter os filtros numéricos
        for (const field of numericFields) {
            const value = req.query[field];

            if (value === undefined) {
                continue;
            }

            const number = Number(value);

            // validar se o ano é inteiro e maior que zero
            const minimum = field === "first_entry" ? 1 : 0;

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

        const normalizedPowerUnit = typeof power_unit === "string"
            ? power_unit.trim().toLowerCase() || undefined
            : undefined;

        const normalizedBase = typeof base === "string"
            ? base.trim().toLowerCase() || undefined
            : undefined;

        // verificar se o país existe
        const countryExists = teams.some(
            (team) => team.country === normalizedCountry
        );

        if (normalizedCountry !== undefined && !countryExists) {
            return res.status(400).json({
                message: "País não encontrado nos dados da API"
            });
        }

        // aplicar filtros de país e estatísticas
        const filteredTeams = teams.filter((team) => {
            const matchesCountry =
                !normalizedCountry || team.country === normalizedCountry;

            const matchesPowerUnit =
                !normalizedPowerUnit ||
                (typeof team.power_unit === "string" &&
                    team.power_unit.toLowerCase() === normalizedPowerUnit);

            const matchesBase =
                !normalizedBase ||
                (Array.isArray(team.base) &&
                    team.base.some((location) =>
                        location.toLowerCase() === normalizedBase
                    ));

            const matchesNumericFields = numericFields.every((field) =>
                numericFilters[field] === undefined ||
                team[field] === numericFilters[field]
            );

            return matchesCountry &&
                matchesPowerUnit &&
                matchesBase &&
                matchesNumericFields;
        });

        res.json(filteredTeams);

    } catch (err) {
        next(err);
    }
}

// buscar equipe pelo ID
async function getTeamById(req, res, next) {
    try {
        const teams = await getAllTeams();

        // buscar equipe pelo ID informado na URL
        const id = req.params.id;
        const teamFound = teams.find(
            (team) => team.id === id
        );

        if (!teamFound) {
            return res.status(404).json({
                message: "Equipe não encontrada"
            });
        }

        res.json(teamFound);

    } catch (err) {
        next(err);
    }
}

module.exports = { getTeams, getTeamById };
