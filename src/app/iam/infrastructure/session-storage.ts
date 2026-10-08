import { AuthenticatedUser, Role } from '../domain/model/session.entity';

const STORAGE_KEY = 'fuelbridge.session';

interface StoredSession {
  id: string;
  username: string;
  token: string;
  roles: Role[];
}

/**
 * @summary Persistencia del lado del cliente para la sesión autenticada.
 * @remarks Usa localStorage para que la sesión sobreviva a un refresh de
 * página. No es un mecanismo seguro contra XSS, pero es consistente con el
 * resto del frontend, que tampoco usa cookies httpOnly todavía.
 * @author FuelBridge Platform
 */
export class SessionStorage {
  static save(user: AuthenticatedUser): void {
    const payload: StoredSession = {
      id: user.id,
      username: user.username,
      token: user.token,
      roles: user.roles,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  static load(): AuthenticatedUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as StoredSession;
      return new AuthenticatedUser(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  static clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static getToken(): string | null {
    return this.load()?.token ?? null;
  }
}
