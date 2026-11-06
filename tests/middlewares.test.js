const request = require("supertest");
const app = require("../src/app");

describe("Middleware de rotas inexistentes", () => {
    test("Deve retornar 404 para uma rota inexistente", async () => {
        const response = await request(app)
            .get("/api/v1/cars");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Rota não encontrada");
    });
});