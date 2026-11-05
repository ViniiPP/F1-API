const request = require("supertest");
const app = require("../src/app");

describe("GET /api/v1/teams", () => {
    test("Deve retornar uma lista de equipes", async () => {
        const response = await request(app).get("/api/v1/teams");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });
});

describe("GET /api/v1/teams/:id", () => {
    test("Deve retornar uma equipe pelo ID", async () => {
        const response = await request(app).get("/api/v1/teams/ferrari");

        expect(response.status).toBe(200);
        expect(response.body.id).toBe("ferrari");
        expect(response.body.name).toBe("Scuderia Ferrari");
    });

    test("Deve retornar 404 para equipe inexistente por ID", async () => {
        const response = await request(app).get("/api/v1/teams/inexistente");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Equipe não encontrada");

    });
});