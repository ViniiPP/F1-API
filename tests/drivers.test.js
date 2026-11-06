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
        }
    );

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

    test("Deve filtrar pilotos por equipe", async () => {
        const response = await request(app).get("/api/v1/drivers?team_id=FER");

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);

        response.body.forEach((driver) => {
            expect(driver.team_id).toBe("FER");
        });
    });

    test("Deve filtrar pilotos pelo número", async () => {
        const response = await request(app).get("/api/v1/drivers?number=16");

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);

        response.body.forEach((driver) => {
            expect(driver.number).toBe(16);
        });
    });

    test.each([
        ["wins", 41],
        ["poles", 65],
        ["podiums", 80],
        ["first_entry", 1984]
    ])("Deve filtrar pilotos por %s=%s", async (field, value) => {
        const response = await request(app).get(`/api/v1/drivers?${field}=${value}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.some((driver) => driver.id === "SEN")).toBe(true);

        response.body.forEach((driver) => {
            expect(driver[field]).toBe(value);
        });
    });

    test.each([
        ["number", "0", "number deve ser um inteiro maior que zero"],
        ["wins", "-1", "wins deve ser um inteiro maior ou igual a zero"],
        ["poles", "abc", "poles deve ser um inteiro maior ou igual a zero"],
        ["podiums", "2.5", "podiums deve ser um inteiro maior ou igual a zero"],
        ["first_entry", "0", "first_entry deve ser um inteiro maior que zero"]
    ])("Deve retornar 400 para %s=%s", async (field, value, message) => {
        const response = await request(app).get(`/api/v1/drivers?${field}=${value}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(message);
    });

    test("Deve combinar filtros de país, equipe e número", async () => {
        const response = await request(app).get("/api/v1/drivers?country=Monaco&team_id=FER&number=16");

        expect(response.status).toBe(200);
        expect(response.body.some((driver) => driver.id === "LEC")).toBe(true);

        response.body.forEach((driver) => {
            expect(driver.country).toBe("Monaco");
            expect(driver.team_id).toBe("FER");
            expect(driver.number).toBe(16);
        });
    });
});

describe("GET /api/v1/drivers/:id", () => {
    test("Deve retornar um piloto pelo ID", async () => {
        const response = await request(app).get("/api/v1/drivers/SEN");

        expect(response.status).toBe(200);
        expect(response.body.id).toBe("SEN");
        expect(response.body.name).toBe("Ayrton Senna");
    });

    test("Deve retornar 404 para piloto inexistente por ID", async () => {
        const response = await request(app).get("/api/v1/drivers/piloto-inexistente");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Piloto não encontrado");
    });
});
