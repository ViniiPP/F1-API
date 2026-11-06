const fs = require("fs").promises;
const path = require("path");

const teamsFilePath = path.join(__dirname, "../data/drivers.json");

// transformar o json em objeto
async function getAllDrivers() {
    try {
        const data = await fs.readFile(teamsFilePath, "utf8");
        return JSON.parse(data).drivers;
        
    } catch (err) {
        throw new Error("Erro ao ler pilotos: " + err.message);
    }
}

module.exports = {
    getAllDrivers
}
