const fs = require("fs").promises;
const path = require("path");

const teamsFilePath = path.join(__dirname, "../data/teams.json");

async function getAllTeams() {
    try {
        const data = await fs.readFile(teamsFilePath, "utf8");
        return JSON.parse(data).teams;

    } catch (err) {
        throw new Error("Erro ao ler equipes: " + err.message);
    }
}
module.exports = { getAllTeams }