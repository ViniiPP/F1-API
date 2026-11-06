const request = require("supertest");

// simular o repository de pilotos
jest.mock("../src/repositories/drivers.repository", () => ({
    getAllDrivers: jest.fn()
}));

const app = require("../src/app");
const { getAllDrivers } = require("../src/repositories/drivers.repository");

describe("Middleware de tratamento de erros", () => {
    test("Deve retornar 500 quando ocorrer um erro interno", async () => {

        // simular uma falha de leitura dos dados
        getAllDrivers.mockRejectedValueOnce(
            new Error("Erro de leitura simulado")
        )

        // evitar exibir o erro simulado no terminal jest
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        try {
            const response = await request(app).get("/api/v1/drivers");

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Erro interno do Servidor");
        } finally {
            consoleSpy.mockRestore();
        }
    });
})
