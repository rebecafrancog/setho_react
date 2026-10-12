# SETHO

Aplicação responsiva em React/Next.js com uma API REST didática em Flask, SQLAlchemy e SQLite.

O código foi organizado de forma didática para um projeto de Análise e Desenvolvimento de Sistemas. Consulte `ARQUITETURA.md` para conhecer as camadas, os modelos, o serviço de persistência, o hook de navegação e os componentes compartilhados.

## Executar

Com Node.js 22 ou superior e npm instalados:

    npm ci
    npm run dev

Para gerar a versão estática:

    npm run build

A saída do front-end fica em `out/`. A prévia local usa a porta 5173 e a API Flask usa a porta 5000.

## Demonstração

Abra Entrar pelo menu e escolha Explorar como usuário ou Explorar como ONG. Também é possível cadastrar contas locais, cadastrar uma ONG em quatro etapas e enviar imagens de até 2 MB.

Doações não efetuam cobranças. Autenticação, recuperação de senha e cadastros são simulados no dispositivo; use dados fictícios. Não há envio de e-mail nem integração de pagamento. Os dados de um navegador não são compartilhados com outros aparelhos. O navegador mantém os registros na chave setho-v1 do localStorage.

## Organização

- app/page.tsx: rotas e fluxos do aplicativo.
- app/forms.tsx: formulários e seletores reutilizáveis.
- app/data.ts: dados iniciais e camada de persistência substituível por uma API.
- app/services/repository.ts: armazenamento front-end com localStorage e sessionStorage.
- app/globals.css: identidade visual e apresentação para celular.
- public/setho.jpeg: logo original fornecida.

## Backend Flask

O backend está na pasta `backend/`. Consulte `backend/README.md` para criar o ambiente virtual, instalar as dependências, preparar o banco SQLite e executar os testes. Consulte `INTEGRACAO_API.md` para ligar cada fluxo do React à API.

As telas ainda preservam o modo local original como apoio didático. O cliente HTTP centralizado em `app/services/api.ts` permite migrar os fluxos gradualmente para o Flask.

## Verificação

Compilação de produção e análise TypeScript. Verificados no navegador: login de demonstração, doação e histórico, inscrição de voluntariado, painel da ONG, publicação de necessidade e ferramenta WebMCP de busca, incluindo rejeição de entrada inválida.

## Contas de demonstração

- Usuário: usuario@setho.com / 123456. A mesma conta permite doação e voluntariado.
- ONG: ong@setho.com / 123456. Direciona ao painel administrativo.

Existem somente os papéis user e ong. Os logins sempre abrem a área correspondente. Cadastros antigos são preservados na atualização.

## Abrir no VS Code

Extraia setho.zip, abra a pasta setho no VS Code (Arquivo > Abrir Pasta) e execute no terminal:

    npm ci
    npm run dev

Acesse http://localhost:5173. Clique em Quero ajudar ou Tenho uma ONG para entrar. Os acessos de demonstração estão na seção expansível da tela de login.

## Visual do usuário

A interface usa fundo creme, folhas, ações rápidas, cards compactos, filtros e histórico. A navegação aparece apenas após o login e muda conforme o tipo de conta. O QR Code é uma demonstração sem valor de pagamento; a confirmação é feita pelo botão Simular pagamento.

- app/user-ui.tsx: componentes visuais da área do usuário.
- app/user-theme.css: tema responsivo inspirado na referência enviada.
- public/community.jpg: imagem gerada por IA de pessoas plantando em comunidade no Brasil, luz natural, tons verdes, sem texto.
- public/botanical.jpg: arte gerada por IA com fundo creme e folhas em verde sálvia nos cantos inferiores.
- public/demo-qr.svg: QR estático contendo SETHO-DEMONSTRACAO-SEM-VALOR-DE-PAGAMENTO.

A logo original fornecida foi preservada. As fotos são ilustrativas, não registros das ONGs demonstrativas.
