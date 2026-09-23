# Guia do SETHO no VS Code

Este pacote contém o código-fonte completo do SETHO em React, Next.js e TypeScript.

## 1. Abrir o projeto

1. Instale o Node.js 22 ou superior: https://nodejs.org/
2. Extraia o arquivo ZIP.
3. Abra o VS Code.
4. Vá em **Arquivo > Abrir Pasta** e escolha a pasta `setho`.
5. Abra o terminal integrado com **Terminal > Novo Terminal**.
6. Execute:

```bash
npm ci
npm run dev
```

7. Abra `http://localhost:5173` no navegador.

Para interromper o servidor, volte ao terminal e pressione `Ctrl + C`.

## 2. Onde está cada parte do código

| Arquivo ou pasta | Função |
| --- | --- |
| `app/page.tsx` | Telas, navegação, estados e fluxos principais |
| `app/data.ts` | Dados iniciais e persistência no navegador |
| `app/auth.ts` | Cadastro, login e sessão local |
| `app/models/` | Interfaces TypeScript das entidades do sistema |
| `app/services/` | Serviço responsável pela persistência local |
| `app/hooks/` | Comportamentos React reutilizáveis |
| `app/components/common/` | Elementos visuais compartilhados |
| `app/components/layout/` | Cabeçalho, menu e navegação principal |
| `app/utils/` | Formatação de valores e datas |
| `app/forms.tsx` | Campos e componentes reutilizáveis de formulário |
| `app/user-ui.tsx` | Cards e componentes visuais da área do usuário |
| `app/layout.tsx` | Estrutura global e metadados do Next.js |
| `app/globals.css` | Estilos gerais e identidade visual |
| `app/user-theme.css` | Tema e responsividade da área do usuário |
| `components/ui/` | Componentes genéricos de interface |
| `public/` | Logo, imagens e QR Code demonstrativo |
| `package.json` | Dependências e comandos do projeto |

## 3. Ordem recomendada para estudar

1. `app/layout.tsx`: veja como a aplicação é envolvida pelo layout global.
2. `app/data.ts`: entenda os dados de demonstração e o `repository`.
3. `app/auth.ts`: acompanhe o login, o cadastro e a sessão.
4. `app/user-ui.tsx`: examine componentes menores e reutilizáveis.
5. `app/forms.tsx`: veja como os formulários foram montados.
6. `app/page.tsx`: acompanhe as telas e os fluxos completos.
7. `app/globals.css` e `app/user-theme.css`: altere cores, espaçamento e responsividade.

Leia também `ARQUITETURA.md`, que explica a divisão em camadas e sugere uma sequência para apresentar o projeto na faculdade.

## 4. Conceitos importantes no `page.tsx`

- `"use client"`: permite usar estado, efeitos e APIs do navegador.
- `useState`: guarda valores que mudam durante o uso da aplicação.
- `useEffect`: executa ações depois que o componente aparece.
- `route`: identifica a tela atual por meio do hash da URL.
- `go(...)`: altera a rota exibida.
- `update(...)`: atualiza os dados e os salva no navegador.
- `db`: representa os dados atuais da aplicação.

Exemplo de estado React:

```tsx
const [query, setQuery] = useState("");
```

`query` é o valor atual da pesquisa. `setQuery` altera esse valor e faz o React atualizar a interface.

## 5. Dados e limitações desta versão front-end

- Os dados ficam no `localStorage`, na chave `setho-v1`.
- Não existe API, servidor próprio ou banco de dados neste pacote.
- Login, recuperação de senha e cadastro são simulações locais.
- Doações e Pix são demonstrações e não fazem cobranças reais.
- Não use dados pessoais verdadeiros durante os testes.
- Limpar os dados do site no navegador também apaga os cadastros locais.

## 6. Contas de demonstração

Usuário:

```text
usuario@setho.com
123456
```

ONG:

```text
ong@setho.com
123456
```

## 7. Comandos úteis

```bash
# Instalar exatamente as versões registradas
npm ci

# Iniciar o ambiente de desenvolvimento
npm run dev

# Verificar o código com ESLint
npm run lint

# Gerar a versão de produção
npm run build
```

## 8. Como começar a modificar

- Texto e comportamento das telas: `app/page.tsx`.
- ONGs e outros dados de exemplo: `app/data.ts`.
- Componentes de cards: `app/user-ui.tsx`.
- Cores e aparência: `app/globals.css` e `app/user-theme.css`.
- Imagens: substitua ou acrescente arquivos em `public/` e use caminhos como `/nome-da-imagem.jpg`.

Ao salvar um arquivo com o servidor de desenvolvimento aberto, o navegador normalmente atualiza sozinho.

## 9. Próxima evolução recomendada

Antes de colocar o sistema em produção, substitua a autenticação e o armazenamento local por um backend real, com banco de dados, validação no servidor e integração de pagamento feita por um provedor autorizado.

## 10. Responsividade

O projeto usa uma abordagem **mobile first** e possui três faixas principais:

- celular: abaixo de `600px`;
- tablet: a partir de `600px`;
- desktop/web: a partir de `900px`, com um refinamento adicional em `1200px`.

As regras estão no final de `app/globals.css`. Em telas maiores, o conteúdo ganha mais largura, filtros são reorganizados e listas de ONGs, oportunidades, projetos e doações passam a usar duas colunas. Em telas pequenas, tudo retorna automaticamente para uma coluna e a navegação fica na parte inferior.
