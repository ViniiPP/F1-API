const fs = require("fs").promises;

async function getAllTeams() {
    try {
        const data = await fs.readFile("./src/data/teams.json", "utf8");
        return JSON.parse(data).teams;

    } catch (err) {
        throw new Error("Erro ao ler arquivo: " + err.message);
    }
}
module.exports = { getAllTeams }