const express = require("express")
const router = express.Router();

const { getDrivers, getDriverById } = require("../controllers/drivers.controller");

// listar todos os pilotos + filtros
router.get("/", getDrivers);

// buscar piloto pelo ID
router.get("/:id", getDriverById);

module.exports = router;