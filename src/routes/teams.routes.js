const express = require("express");
const { getAllTeams } = require("../repositories/teams.repository");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const teams = await getAllTeams();
        res.json(teams);

    } catch(err) {
        res.status(500).json({
            message: "Erro ao buscar equipes - API"
        });
    }
});

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