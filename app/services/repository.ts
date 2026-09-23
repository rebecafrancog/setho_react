import {migrateAccounts} from '../auth';
import type {SethoDatabase} from '../models/setho';

const DATABASE_KEY = 'setho-v1';
const SESSION_KEY = 'setho-session';

/**
 * Camada de persistência local.
 * A interface usa este serviço sem precisar conhecer os detalhes do
 * localStorage. Futuramente, ele pode ser substituído por chamadas a uma API.
 */
export function createRepository(initialData: SethoDatabase) {
  return {
    load(): SethoDatabase {
      try {
        const saved = localStorage.getItem(DATABASE_KEY);
        const data = saved ? JSON.parse(saved) : structuredClone(initialData);
        const temporarySession = sessionStorage.getItem(SESSION_KEY);

        if (temporarySession) data.session = JSON.parse(temporarySession);
        return migrateAccounts(data);
      } catch {
        return structuredClone(initialData);
      }
    },

    save(data: SethoDatabase) {
      const persistentData = {
        ...data,
        session: data.session?.remember === false ? null : data.session,
      };

      localStorage.setItem(DATABASE_KEY, JSON.stringify(persistentData));

      if (data.session?.remember === false) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    },
  };
}
