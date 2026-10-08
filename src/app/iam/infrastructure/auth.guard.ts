import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStorage } from './session-storage';

/**
 * @summary Guard que bloquea rutas a usuarios sin sesión activa.
 * @remarks Revisa localStorage directamente en vez del IamStore para evitar
 * una dependencia circular entre el guard (que corre antes de que la app
 * termine de inicializar) y el store (que se hidrata desde el mismo storage).
 * @author FuelBridge Platform
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const session = SessionStorage.load();

  if (session) {
    return true;
  }

  return router.createUrlTree(['/iam']);
};
