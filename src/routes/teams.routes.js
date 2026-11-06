const express = require("express");
const { getAllTeams } = require("../repositories/teams.repository");
const router = express.Router();

// listar todas as equipes + filtros
router.get("/", async (req, res) => {
    try {
        const teams = await getAllTeams();
        const country = req.query.country;
        const founded = req.query.founded;

        // conversao para numero
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



        // remover espaços extras e vazios da url
        const normalizedCountry = country ? country.trim() || undefined : undefined;

        // verificar se pelo menos uma equipe possui o país informado
        const countryExists = teams.some((team) => team.country === normalizedCountry);

        if (normalizedCountry !== undefined && !countryExists) {
            return res.status(400).json({
                message: "País não encontrado nos dados da API"
            });
        }

        // filtrar equipes pelo país e ano de fundação
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
        res.status(500).json({
            message: "Erro ao buscar equipes - API"
        });
    }
});

// buscar equipe pelo id
router.get("/:id", async (req, res) => {
    try {
        const teams = await getAllTeams();
        const id = req.params.id;
        const teamFound = teams.find((team) => team.id === id);

        if (!teamFound) {
            return res.status(404).json({
                message: "Equipe não encontrada"
            });
        }
        res.json(teamFound);

    } catch (err) {
        res.status(500).json({
            message: "Erro ao buscar equipe - API"
        });
    }
});

module.exports = router;