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
        const response = await request(app).get("/api/v1/teams?country=Atlantis");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("País não encontrado nos dados da API");
    });

    test.each(["abc", "-1", "1963.5"])(
        "Deve retornar 400 para first_entry=%s",
        async (value) => {
            const response = await request(app).get(`/api/v1/teams?first_entry=${value}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("first_entry deve ser um inteiro maior que zero");
        }
    );

    test("Deve filtrar equipes por país e pelo ano de estreia", async () => {
        const response = await request(app).get("/api/v1/teams?country=United%20Kingdom&first_entry=1966");

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.some((team) => team.id === "MCL")).toBe(true);

        response.body.forEach((team) => {
            expect(team.country).toBe("United Kingdom");
            expect(team.first_entry).toBe(1966);
        });
    });

    test("Deve filtrar equipes pelo motor", async () => {
        const response = await request(app).get("/api/v1/teams?power_unit=Mercedes");

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);

        response.body.forEach((team) => {
            expect(team.power_unit).toBe("Mercedes");
        });
    });

    test("Deve filtrar equipes pela sede", async () => {
        const response = await request(app).get("/api/v1/teams?base=Enstone");

        expect(response.status).toBe(200);
        expect(response.body.some((team) => team.id === "ALP")).toBe(true);

        response.body.forEach((team) => {
            expect(team.base).toContain("Enstone");
        });
    });

    test.each([
        ["world_championships", 1],
        ["poles", 5],
        ["fastest_laps", 4],
        ["first_entry", 2009]
    ])("Deve filtrar equipes por %s=%s", async (field, value) => {
        const response = await request(app).get(`/api/v1/teams?${field}=${value}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.some((team) => team.id === "BRW")).toBe(true);

        response.body.forEach((team) => {
            expect(team[field]).toBe(value);
        });
    });

    test.each([
        ["world_championships", "-1", "world_championships deve ser um inteiro maior ou igual a zero"],
        ["poles", "abc", "poles deve ser um inteiro maior ou igual a zero"],
        ["fastest_laps", "2.5", "fastest_laps deve ser um inteiro maior ou igual a zero"]
    ])("Deve retornar 400 para %s=%s", async (field, value, message) => {
        const response = await request(app).get(`/api/v1/teams?${field}=${value}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(message);
    });
});

describe("GET /api/v1/teams/:id", () => {
    test("Deve retornar uma equipe pelo ID", async () => {
        const response = await request(app).get("/api/v1/teams/FER");

        expect(response.status).toBe(200);
        expect(response.body.id).toBe("FER");
        expect(response.body.name).toBe("Scuderia Ferrari");
    });

    test("Deve retornar 404 para equipe inexistente por ID", async () => {
        const response = await request(app).get("/api/v1/teams/inexistente");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Equipe não encontrada");
    });
});
