# SETHO

Aplicativo exclusivamente front-end em React e Next.js, responsivo para celular e web, com navegação por rotas hash e dados simulados persistidos no navegador.

O código foi organizado de forma didática para um projeto de Análise e Desenvolvimento de Sistemas. Consulte `ARQUITETURA.md` para conhecer as camadas, os modelos, o serviço de persistência, o hook de navegação e os componentes compartilhados.

## Executar

Com Node.js 22 ou superior e npm instalados:

    npm ci
    npm run dev

Para gerar a versão estática:

    npm run build

A saída de produção fica em `out/` e pode ser hospedada em qualquer servidor de arquivos estáticos. Não existe servidor, API ou banco de dados neste pacote. A prévia local usa a porta 5173.

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

## Arquitetura front-end

O projeto não inclui banco de dados, API, Drizzle, Cloudflare Workers ou arquivos de infraestrutura de servidor. Login, cadastros, doações e inscrições são demonstrações executadas apenas no navegador.

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
