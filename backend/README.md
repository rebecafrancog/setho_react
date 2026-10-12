# Backend Flask do SETHO

API REST didática para o projeto SETHO. Usa Flask, SQLAlchemy, SQLite e autenticação JWT.

## Preparação

No terminal do VS Code:

```bash
cd backend
python -m venv .venv
```

Ative o ambiente virtual no Windows:

```powershell
.venv\Scripts\activate
```

No Linux ou macOS:

```bash
source .venv/bin/activate
```

Instale e execute:

```bash
pip install -r requirements.txt
flask --app run seed
flask --app run run --debug --port 5000
```

A API ficará em `http://localhost:5000/api`.

## Contas de demonstração

- Usuário: `usuario@setho.com` / `123456`
- ONG: `ong@setho.com` / `123456`

## Rotas principais

| Método | Rota | Função |
| --- | --- | --- |
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Entrar |
| GET | `/api/auth/me` | Consultar usuário autenticado |
| GET | `/api/organizations` | Listar ONGs |
| GET | `/api/organizations/:id` | Detalhar ONG |
| PATCH | `/api/organizations/:id` | Editar a própria ONG |
| GET/POST | `/api/projects` | Listar ou cadastrar projetos |
| GET | `/api/opportunities` | Listar oportunidades |
| POST | `/api/opportunities` | Publicar oportunidade |
| POST | `/api/opportunities/:id/registrations` | Inscrever-se |
| GET | `/api/opportunities/registrations/me` | Minhas inscrições |
| POST | `/api/donations` | Registrar doação simulada |
| GET | `/api/donations/me` | Minhas doações |
| GET | `/api/donations/received` | Doações recebidas pela ONG |

Rotas protegidas esperam o cabeçalho:

```text
Authorization: Bearer TOKEN_JWT
```

## Testes

```bash
python -m pytest -q
```

As doações são apenas registros demonstrativos. Não existe cobrança nem integração financeira.
