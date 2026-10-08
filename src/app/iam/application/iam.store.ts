import { Injectable, signal, computed, inject } from '@angular/core';
import { IamApi } from '../infrastructure/iam-api';
import { SessionStorage } from '../infrastructure/session-storage';
import { AuthenticatedUser, Role, SignUpPayload } from '../domain/model/session.entity';

/**
 * @summary Store para gestión de estado del BC IAM.
 * @remarks Maneja la sesión autenticada usando signals, igual que
 * InventoryStore y FulfillmentStore. Hidrata el estado inicial desde
 * localStorage para que un refresh de página no cierre la sesión.
 * @author FuelBridge Platform
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly api = inject(IamApi);

  // ── State ────────────────────────────────────────────────────────────────
  private readonly _session = signal<AuthenticatedUser | null>(SessionStorage.load());
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // ── Selectors (readonly) ─────────────────────────────────────────────────
  readonly session = this._session.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isAuthenticated = computed(() => this._session() !== null);

  signIn(username: string, password: string, onSuccess?: () => void): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api.signIn(username, password).subscribe({
      next: (user: AuthenticatedUser) => {
        SessionStorage.save(user);
        this._session.set(user);
        this._isLoading.set(false);
        onSuccess?.();
      },
      error: (err: Error) => {
        this._error.set(err.message);
        this._isLoading.set(false);
      },
    });
  }

  signUp(username: string, password: string, role: Role, onSuccess?: () => void): void {
    this._isLoading.set(true);
    this._error.set(null);
    const payload: SignUpPayload = {
      username,
      password,
      roles: [role],
      companyId: null,
      providerId: null,
    };
    this.api.signUp(payload).subscribe({
      next: () => {
        // El backend no devuelve token en sign-up, así que hacemos
        // sign-in inmediatamente después para obtener la sesión.
        this.signIn(username, password, onSuccess);
      },
      error: (err: Error) => {
        this._error.set(err.message);
        this._isLoading.set(false);
      },
    });
  }

  signOut(): void {
    SessionStorage.clear();
    this._session.set(null);
  }

  clearError(): void {
    this._error.set(null);
  }
}
