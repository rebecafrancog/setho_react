# Integração React + Flask

O backend está pronto e o cliente HTTP fica em `app/services/api.ts`. As telas de cadastro e login já utilizam a API Flask: as contas ficam no SQLite e podem ser acessadas por outros dispositivos que se conectem ao mesmo servidor.

## Configuração

1. Copie `.env.local.example` para `.env.local`.
2. Inicie o Flask na porta `5000`.
3. Inicie o React/Next.js na porta `5173`.

## Exemplo: login

```tsx
import {api, tokenStorage} from './services/api';

const response = await api.auth.login(email, password);
tokenStorage.save(response.access_token, true);
setUser(response.user);
```

## Exemplo: listar ONGs

```tsx
const response = await api.organizations.list();
setOrganizations(response.organizations);
```

## Exemplo: inscrição em voluntariado

```tsx
await api.opportunities.register(opportunityId);
```

## Exemplo: doação simulada

```tsx
await api.donations.create({
  organization_id: organizationId,
  project_id: projectId,
  amount: 50,
});
```

## Situação da integração

1. Login e cadastro de usuário: integrados ao Flask e SQLite.
2. Cadastro e login de ONG: integrados ao Flask e SQLite.
3. ONGs, projetos e oportunidades exibidos: ainda preservam dados locais e podem ser migrados gradualmente.
4. Inscrições e doações: o cliente da API está pronto, mas as telas ainda preservam o modo demonstrativo.

O token JWT fica no `localStorage` quando “Lembrar de mim” está marcado e no `sessionStorage` quando não está. Em produção, avalie cookies seguros `HttpOnly`, proteção contra CSRF, HTTPS, migrações de banco e configuração segura dos segredos.
