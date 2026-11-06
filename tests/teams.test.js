const request = require("supertest");
const app = require("../src/app");

describe("GET /api/v1/teams", () => {
    test("Deve retornar uma lista de equipes", async () => {
        const response = await request(app).get("/api/v1/teams");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Deve retornar equipes da Itália", async () => {
        const response = await request(app).get("/api/v1/teams?country=Italy");

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);

        response.body.forEach((team) => {
            expect(team.country).toBe("Italy");
        });
    });

    test("Deve retornar 400 para país inexistente", async () => {
        const response = await request(app).get("/api/v1/teams?country=Brazil");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("País não encontrado nos dados da API");
    });

    test.each(["abc", "-1", "1963.5"])(
        "Deve retornar 400 para founded=%s",
        async (value) => {
            const response = await request(app).get(`/api/v1/teams?founded=${value}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Founded deve ser um ano inteiro maior que zero");
        }
    );

    test("Deve filtrar equipes por país e pelo ano de fundação", async () => {
        const response = await request(app).get("/api/v1/teams?country=United%20Kingdom&founded=1963");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].id).toBe("mclaren");
        expect(response.body[0].country).toBe("United Kingdom");
        expect(response.body[0].founded).toBe(1963);
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