export type AccountRole = 'user' | 'ong';
export const mockAccounts = [
  { id: 'demo-user', name: 'Eloisa Silva', email: 'usuario@setho.com', password: '123456', city: 'João Pessoa', role: 'user' as AccountRole },
  { id: 'demo-ong', name: 'Ana Souza', email: 'ong@setho.com', password: '123456', city: 'João Pessoa', role: 'ong' as AccountRole, org: 'vida' },
];
export const accountHome = (role: AccountRole) => role === 'ong' ? 'painel' : 'inicio';
export function authenticate(accounts: any[], email: string, password: string) {
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
export function migrateAccounts(data: any) {
  data.accounts = data.accounts || [];
  for (const mock of mockAccounts) {
    if (!data.accounts.some((a: any) => a.id === mock.id || a.email.toLowerCase() === mock.email)) data.accounts.push({...mock});
  }
  if (data.session && ['demo-user','demo-ong'].includes(data.session.id)) {
    const account = data.accounts.find((a: any) => a.id === data.session.id);
    if (account) data.session = {...data.session, ...account};
  }
  return data;
}
