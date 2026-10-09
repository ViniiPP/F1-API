const fs = require("fs").promises;

// transformar o json em objeto
async function getAllDrivers() {
    try {
        const data = await fs.readFile("./src/data/drivers.json", "utf8");
        return JSON.parse(data).drivers;
        
    } catch (err) {
        throw new Error("Erro ao ler arquivo: " + err.message);
    }
}

module.exports = {
    getAllDrivers
}
