# Arquitetura didática do SETHO

Este documento apresenta a organização do projeto como um trabalho acadêmico de Análise e Desenvolvimento de Sistemas.

## Objetivo

O SETHO é uma aplicação web responsiva que conecta usuários e organizações sociais. A versão atual demonstra cadastro, autenticação local, doações simuladas, oportunidades de voluntariado, notificações e administração de uma ONG.

## Organização em camadas

```text
Interface (componentes e páginas)
             ↓
Regras da aplicação (autenticação e fluxos)
             ↓
Serviço front-end (persistência local)
             ↓
localStorage e sessionStorage do navegador
```

Essa separação diminui o acoplamento. Nesta versão não existe backend: todas as operações são simuladas no navegador. O serviço de persistência poderá ser substituído futuramente por uma API, caso o projeto evolua.

## Estrutura principal

```text
app/
├── components/
│   ├── common/page-elements.tsx
│   └── layout/app-shell.tsx
├── hooks/use-hash-route.ts
├── models/setho.ts
├── services/repository.ts
├── utils/formatters.ts
├── auth.ts
├── data.ts
├── forms.tsx
├── page.tsx
├── user-ui.tsx
├── globals.css
└── user-theme.css
```

## Responsabilidade de cada camada

- `models/`: define as entidades e os tipos TypeScript.
- `services/`: centraliza o acesso ao armazenamento local.
- `hooks/`: reúne comportamentos React reutilizáveis.
- `components/common/`: contém elementos simples usados por várias telas.
- `components/layout/`: define cabeçalho, menu, conteúdo e navegação.
- `utils/`: contém funções puras de formatação.
- `data.ts`: mantém os dados iniciais e instancia o repositório.
- `auth.ts`: aplica regras de autenticação e permissão.
- `page.tsx`: coordena o estado geral e os casos de uso.

## Padrões utilizados

- Componentização.
- Separação de responsabilidades.
- Padrão Repository para persistência.
- Custom Hook para o roteamento por hash.
- Mobile first para responsividade.

## Limitações acadêmicas conhecidas

- A autenticação é simulada e não deve ser usada em produção.
- As senhas ficam no armazenamento do navegador.
- O Pix é apenas demonstrativo.
- Ainda não existe API ou banco de dados remoto.
- Algumas telas continuam coordenadas por `page.tsx` para manter a demonstração simples.

## Próximas evoluções sugeridas

1. Criar uma API REST para usuários, ONGs e doações.
2. Usar PostgreSQL ou outro banco relacional.
3. Implementar autenticação segura com senha criptografada.
4. Separar os grupos de telas em módulos de funcionalidades.
5. Adicionar testes unitários e de interface.
6. Integrar um provedor de pagamentos autorizado.

## Como apresentar o projeto

1. Problema social que o SETHO pretende resolver.
2. Requisitos funcionais e não funcionais.
3. Tecnologias utilizadas.
4. Arquitetura em camadas.
5. Demonstração dos fluxos de usuário e ONG.
6. Responsividade em celular e computador.
7. Limitações e trabalhos futuros.
