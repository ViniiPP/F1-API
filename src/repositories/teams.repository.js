const fs = require("fs").promises;
const path = require("path");

const teamsFilePath = path.join(__dirname, "../data/teams.json");

async function getAllTeams() {
    const data = await fs.readFile(teamsFilePath, "utf-8");
    return JSON.parse(data);
}

module.exports = { getAllTeams }