# Formula One API 🏎️

[![Testes automatizados](https://github.com/ViniiPP/F1-API/actions/workflows/tests.yml/badge.svg)](https://github.com/ViniiPP/F1-API/actions/workflows/tests.yml)

Uma **API REST de dados históricos da Fórmula 1**, desenvolvida com **Node.js** e **Express** para consultar pilotos e equipes de diferentes épocas. O projeto oferece filtros combináveis, estatísticas de carreira, validação de parâmetros, tratamento centralizado de erros e testes automatizados.

> **Status:** em desenvolvimento. A base local contém **915 registros de pilotos** e **187 registros de construtores**, incluindo participantes históricos de treinos e inscrições que não necessariamente largaram em corridas. Os dados representam uma compilação histórica, não estatísticas em tempo real.

## Funcionalidades

- Consulta de pilotos e construtores por **ID de três letras** (ex.: `LEC`, `SEN`, `FER`, `ALP`).
- Filtros combináveis por país, equipe, número de piloto, títulos, vitórias, poles, pódios e ano de estreia.
- Filtros de equipes por país, unidade de potência, sede, títulos, poles, voltas mais rápidas e ano de estreia.
- Retorno de dados em JSON, com validação de filtros numéricos e respostas HTTP padronizadas.
- Arquitetura em **Routes, Controllers, Repositories e Middlewares**.
- **41 testes automatizados em 4 suítes**, com Jest e Supertest.
- Integração contínua com GitHub Actions.

## Tecnologias

- **JavaScript / Node.js** (CommonJS)
- **Express 5** — servidor e rotas HTTP
- **Jest** — testes automatizados
- **Supertest** — testes de integração HTTP
- **Nodemon** — ambiente de desenvolvimento
- **GitHub Actions** — execução de testes em push e pull request

## Instalação e execução

**Pré-requisitos:** Node.js e npm instalados. A integração contínua utiliza Node.js 24.

```bash
git clone https://github.com/ViniiPP/F1-API.git
cd F1-API
npm ci
```

Inicie o servidor:

```bash
npm start
```

Ou execute com recarregamento automático durante o desenvolvimento:

```bash
npm run dev
```

**Endereço local:** `http://localhost:3000`  
**URL base da API:** `http://localhost:3000/api/v1`

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/` | Mensagem inicial da aplicação |
| `GET` | `/api/v1` | Informações e versão da API |
| `GET` | `/api/v1/drivers` | Lista pilotos e aplica filtros |
| `GET` | `/api/v1/drivers/:id` | Busca um piloto pelo ID |
| `GET` | `/api/v1/teams` | Lista equipes e aplica filtros |
| `GET` | `/api/v1/teams/:id` | Busca uma equipe pelo ID |

### Pilotos — `/api/v1/drivers`

| Parâmetro | Tipo | Descrição | Exemplo |
| --- | --- | --- | --- |
| `country` | `string` | Nacionalidade registrada na base | `Brazil` |
| `worldChampionships` | `integer ≥ 0` | Número de títulos mundiais | `3` |
| `team_id` | `string` | ID da equipe de referência | `FER` |
| `number` | `integer > 0` | Número do piloto | `16` |
| `wins` | `integer ≥ 0` | Vitórias na carreira | `41` |
| `poles` | `integer ≥ 0` | Pole positions | `65` |
| `podiums` | `integer ≥ 0` | Pódios | `80` |
| `first_entry` | `integer > 0` | Ano da primeira participação registrada | `1984` |

Todos os filtros numéricos utilizam **correspondência exata**. É possível combinar vários parâmetros em uma mesma requisição.

```http
GET /api/v1/drivers
GET /api/v1/drivers/SEN
GET /api/v1/drivers?country=Brazil&worldChampionships=3
GET /api/v1/drivers?team_id=FER&number=16
GET /api/v1/drivers?wins=41&poles=65
GET /api/v1/drivers?first_entry=1984
```

**Exemplo de resposta:** `GET /api/v1/drivers/LEC`

```json
{
  "id": "LEC",
  "slug": "charles-leclerc",
  "name": "Charles Leclerc",
  "country": "Monaco",
  "birthDate": "1997-10-16",
  "number": 16,
  "team_id": "FER",
  "wins": 8,
  "poles": 27,
  "podiums": 52,
  "worldChampionships": 0,
  "first_entry": 2018
}
```

O campo `team_id` indica a equipe atual (para pilotos do grid de referência) ou a última equipe registrada (para os demais). Ele **não representa todas as equipes da carreira**. O campo `number` pode ser `null` quando não há um número único ou permanente verificável.

### Equipes — `/api/v1/teams`

| Parâmetro | Tipo | Descrição | Exemplo |
| --- | --- | --- | --- |
| `country` | `string` | País da equipe | `Italy` |
| `world_championships` | `integer ≥ 0` | Títulos mundiais de construtores | `16` |
| `power_unit` | `string` | Fabricante da unidade de potência | `Mercedes` |
| `base` | `string` | Cidade ou país presente no campo `base` | `Enstone` |
| `first_entry` | `integer > 0` | Ano da primeira participação registrada | `1966` |
| `poles` | `integer ≥ 0` | Pole positions | `5` |
| `fastest_laps` | `integer ≥ 0` | Voltas mais rápidas | `4` |

O parâmetro **`founded` não é um filtro**. O ano de estreia é consultado usando `first_entry`.

```http
GET /api/v1/teams
GET /api/v1/teams/FER
GET /api/v1/teams?country=Italy
GET /api/v1/teams?power_unit=Mercedes
GET /api/v1/teams?base=Enstone
GET /api/v1/teams?country=United%20Kingdom&first_entry=1966
GET /api/v1/teams?world_championships=1&poles=5&fastest_laps=4
```

**Exemplo de resposta:** `GET /api/v1/teams/ALP`

```json
{
  "id": "ALP",
  "slug": "alpine",
  "name": "Alpine",
  "full_name": "BWT Alpine Formula One Team",
  "country": "France",
  "base": ["Enstone", "United Kingdom"],
  "power_unit": "Mercedes",
  "founded": null,
  "first_entry": 1986,
  "world_championships": 2,
  "poles": 21,
  "fastest_laps": 16
}
```

O campo `base` é um array com localização da sede, quando disponível. Algumas equipes históricas têm `base` e `power_unit` iguais a `null`. O campo `founded` pode aparecer no JSON para preservar registros anteriores, mas não está disponível para filtragem.

### Regras dos filtros

- Os nomes dos parâmetros devem ser enviados exatamente como documentados, incluindo maiúsculas em `worldChampionships`.
- `country` utiliza o nome em inglês presente na base e diferencia maiúsculas/minúsculas (ex.: `Brazil`, não `brazil`). Um país ausente da base retorna `400`.
- O parâmetro `team_id` é normalizado para letras maiúsculas (`fer` também funciona); `power_unit` e `base` não diferenciam maiúsculas/minúsculas.
- Os filtros podem ser combinados. Se a combinação for válida, mas não encontrar registros, a resposta será `200 OK` com `[]`.
- Valores inválidos nos parâmetros numéricos retornam `400 Bad Request`.
- A busca por `:id` utiliza o **ID curto**, não o `slug`; os exemplos de IDs devem ser enviados em maiúsculas.

## Códigos de resposta

| Status | Quando ocorre |
| --- | --- |
| `200 OK` | Consulta realizada com sucesso, mesmo que a lista esteja vazia |
| `400 Bad Request` | Filtro numérico inválido ou país inexistente na base |
| `404 Not Found` | Piloto, equipe ou rota não encontrada |
| `500 Internal Server Error` | Falha inesperada tratada pelo middleware |

Exemplo de erro `400`:

```json
{
  "message": "País não encontrado nos dados da API"
}
```

Exemplo de erro `404` ao buscar um piloto inexistente:

```json
{
  "message": "Piloto não encontrado"
}
```

## Estrutura do projeto

```text
F1-API/
├── .github/
│   └── workflows/
│       └── tests.yml
├── src/
│   ├── controllers/
│   │   ├── drivers.controller.js
│   │   └── teams.controller.js
│   ├── data/
│   │   ├── drivers.json
│   │   └── teams.json
│   ├── middlewares/
│   │   ├── errorHandler.middleware.js
│   │   └── notFound.middleware.js
│   ├── repositories/
│   │   ├── drivers.repository.js
│   │   └── teams.repository.js
│   ├── routes/
│   │   ├── drivers.routes.js
│   │   └── teams.routes.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── drivers.test.js
│   ├── errorHandler.test.js
│   ├── middlewares.test.js
│   └── teams.test.js
├── .gitignore
├── package.json
└── package-lock.json
```

**Routes** definem os endpoints; **Controllers** validam parâmetros e geram respostas; **Repositories** consultam os JSONs locais; e **Middlewares** tratam erros e caminhos inexistentes.

## Testes automatizados e CI

O projeto possui **41 testes automatizados**, distribuídos em quatro suítes. Eles cobrem consultas, buscas por ID, filtros individuais e combinados, entradas inválidas e respostas `404` e `500`.

```bash
npm test
```

O workflow [F1 API - Automated Tests](https://github.com/ViniiPP/F1-API/actions/workflows/tests.yml) executa `npm ci` e `npm test` automaticamente em `push` e `pull_request` para a branch `main`.

## Fonte dos dados e limitações

- O conjunto inclui registros históricos de pilotos, construtores, reservas e participantes de treinos; portanto, a contagem não equivale ao número de pilotos que largaram em GPs.
- As equipes podem ter diferentes critérios de continuidade histórica após mudanças de nome ou estrutura (por exemplo, a linhagem da Alpine). Por isso, os totais históricos não são sempre comparáveis diretamente aos de um construtor sob um único nome.
- Os IDs de três letras são identificadores únicos **definidos para esta API**. Não são, necessariamente, abreviações oficiais da FIA; o campo `slug` conserva o identificador histórico anterior.

---

Desenvolvido por [ViniiPP](https://github.com/ViniiPP).
