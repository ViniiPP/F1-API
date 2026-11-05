const request = require("supertest");
const app = require("../src/app");

describe("GET /api/v1/drivers", () => {
    test("Deve retornar uma lista de pilotos", async () => {
        const response = await request(app).get("/api/v1/drivers");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test.each(["abc", "-1", "2.5"])(
        "Deve retornar 400 para worldChampionships=%s", async (value) => {
        const response = await request(app).get(`/api/v1/drivers?worldChampionships=${value}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("worldChampionships deve ser um inteiro maior ou igual a zero");
    });

    test("Deve retornar pilotos do Brasil", async () => {
        const response = await request(app).get("/api/v1/drivers?country=Brazil");

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        response.body.forEach((driver) => {
            expect(driver.country).toBe("Brazil");
        });
    });

    test("Deve retornar 400 para país inexistente", async () => {
        const response = await request(app).get("/api/v1/drivers?country=Atlantis");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("País não encontrado nos dados da API");
    });

    test("Deve filtrar pilotos por país e títulos mundiais", async () => {
        const response = await request(app).get("/api/v1/drivers?country=Brazil&worldChampionships=3");

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);

        response.body.forEach((driver) => {
            expect(driver.country).toBe("Brazil");
            expect(driver.worldChampionships).toBe(3);
        });

    }); 
});

describe("GET /api/v1/drivers/:id", () => {
    test("Deve retornar um piloto pelo ID", async () => {
        const response = await request(app).get("/api/v1/drivers/ayrton-senna");

        expect(response.status).toBe(200);
        expect(response.body.id).toBe("ayrton-senna");
        expect(response.body.name).toBe("Ayrton Senna");
    });

    test("Deve retornar 404 para piloto inexistente por ID", async () => {
       const response = await request(app).get("/api/v1/drivers/piloto-inexistente");

       expect(response.status).toBe(404);
       expect(response.body.message).toBe("Piloto não encontrado");
    });
});