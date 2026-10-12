# Integração React + Flask

O backend está pronto e o cliente HTTP fica em `app/services/api.ts`. A interface atual ainda preserva o modo demonstrativo com `localStorage`, permitindo estudar cada troca de forma gradual sem perder as telas existentes.

## Configuração

1. Copie `.env.local.example` para `.env.local`.
2. Inicie o Flask na porta `5000`.
3. Inicie o React/Next.js na porta `5173`.

## Exemplo: login

```tsx
import {api, tokenStorage} from './services/api';

const response = await api.auth.login(email, password);
tokenStorage.save(response.access_token);
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

## Estratégia de migração das telas

1. Trocar login e cadastro locais por `api.auth`.
2. Carregar ONGs e projetos com a API.
3. Enviar oportunidades e inscrições para o Flask.
4. Registrar doações simuladas na API.
5. Depois de confirmar todos os fluxos, remover o antigo `repository` local.

O token JWT fica no `sessionStorage` nesta versão acadêmica. Em produção, avalie cookies seguros `HttpOnly`, proteção contra CSRF, HTTPS, migrações de banco e configuração segura dos segredos.
