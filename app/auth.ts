import type {Account, AccountRole, SethoDatabase} from './models/setho';
export const mockAccounts = [
  { id: 'demo-user', name: 'Eloisa Silva', email: 'usuario@setho.com', password: '123456', city: 'João Pessoa', role: 'user' as AccountRole }, // Usuário de teste
  { id: 'demo-ong', name: 'Ana Souza', email: 'ong@setho.com', password: '123456', city: 'João Pessoa', role: 'ong' as AccountRole, org: 'vida' }, // ONG de teste
];
export const accountHome = (role: AccountRole) => role === 'ong' ? 'painel' : 'inicio';
export function authenticate(accounts: Account[], email: string, password: string) {
  const account = accounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!account || account.password !== password || !['user', 'ong'].includes(account.role)) throw new Error('E-mail ou senha incorretos.');
  return account;
}
export function allowedAccountRoute(route: string, role: AccountRole) {
  const page = route.split('/')[0];
  const management = ['painel', 'minha-ong', 'editar-ong', 'gerenciar', 'novo', 'editar', 'inscritos', 'recebidas'];
  const personal = ['inicio', 'doacoes', 'meus-voluntariados', 'apoiadas'];
  if (role === 'user' && management.includes(page)) return 'inicio';
  if (role === 'ong' && personal.includes(page)) return 'painel';
  return route;
}
export function migrateAccounts(data: SethoDatabase) {
  data.accounts = data.accounts || [];
  for (const mock of mockAccounts) {
    if (!data.accounts.some(account => account.id === mock.id || account.email.toLowerCase() === mock.email)) data.accounts.push({...mock});
  }
  if (data.session && ['demo-user','demo-ong'].includes(data.session.id)) {
    const sessionId = data.session.id;
    const account = data.accounts.find(account => account.id === sessionId);
    if (account) data.session = {...data.session, ...account};
  }
  return data;
}
