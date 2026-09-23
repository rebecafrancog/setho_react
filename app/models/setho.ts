/**
 * Modelos principais do domínio SETHO.
 *
 * Em um projeto acadêmico, os modelos documentam quais dados circulam entre
 * interface, regras de negócio e persistência. Eles também ajudam o TypeScript
 * a encontrar erros antes da execução.
 */
export type AccountRole = 'user' | 'ong';

export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  city: string;
  role: AccountRole;
  org?: string;
  photo?: string;
  remember?: boolean;
  notifications?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  city: string;
  district: string;
  category: string;
  description: string;
  mission: string;
  history: string;
  image: string;
  cover?: string;
}

export interface FundingItem {
  id: string;
  org: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  deadline: string;
  status: string;
  image?: string;
  category?: string;
  objective?: string;
  audience?: string;
}

export interface Opportunity {
  id: string;
  org: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  slots: number;
  requirements: string;
  status: string;
  image?: string;
}

export interface Donation {
  id: string;
  org: string;
  user: string;
  amount: number;
  date: string;
  target?: string;
  targetTitle?: string;
}

export interface Registration {
  id: string;
  user: string;
  name: string;
  opportunity: string;
  org: string;
  date: string;
  status: string;
}

export interface Notification {
  id: string;
  text: string;
  owner: string;
  read: boolean;
  date: string;
}

export interface SethoDatabase {
  orgs: Organization[];
  needs: FundingItem[];
  projects: FundingItem[];
  opportunities: Opportunity[];
  donations: Donation[];
  registrations: Registration[];
  accounts: Account[];
  session: Account | null;
  notifications: Notification[];
  favorites: string[];
}
