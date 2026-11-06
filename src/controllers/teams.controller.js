const { getAllTeams } = require("../repositories/teams.repository");

// listar todas as equipes + filtros
async function getTeams(req, res, next) {
    try {
        const teams = await getAllTeams();
        const country = req.query.country;
        const founded = req.query.founded;

        // converter ano de fundação para número
        let foundedNumber;
        if (founded !== undefined) {
            foundedNumber = Number(founded);

            // validar se o ano é inteiro e maior que zero
            if(!Number.isInteger(foundedNumber) || foundedNumber <= 0) {
                return res.status(400).json({
                    message:"Founded deve ser um ano inteiro maior que zero"
                });
            }
        }

        // remover espaços extras e tratar país vazio
        const normalizedCountry = country ? country.trim() || undefined : undefined;

        // verificar se o país existe
        const countryExists = teams.some((team) => team.country === normalizedCountry);

        if (normalizedCountry !== undefined && !countryExists) {
            return res.status(400).json({
                message: "País não encontrado nos dados da API"
            });
        }

         // aplicar filtros de país e ano de fundação
        const filteredTeams = teams.filter((team) => {
            const matchesCountry =
                !normalizedCountry || team.country === normalizedCountry;

            const matchesFounded =
                founded === undefined ||
                team.founded === foundedNumber;

            return matchesCountry && matchesFounded;
        });

        res.json(filteredTeams);
        

    } catch(err) {
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