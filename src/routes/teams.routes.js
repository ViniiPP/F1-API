const express = require("express");
const router = express.Router();
const { getTeams, getTeamById } = require("../controllers/teams.controller");

// listar todas as equipes + filtros
router.get("/", getTeams);

// buscar equipe pelo ID
router.get("/:id", getTeamById);

module.exports = router;