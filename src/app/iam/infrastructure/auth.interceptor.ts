import { HttpInterceptorFn } from '@angular/common/http';
import { SessionStorage } from './session-storage';

/**
 * @summary Interceptor funcional que agrega el JWT a cada request saliente.
 * @remarks No se agrega el header en las peticiones de sign-in/sign-up,
 * porque todavía no existe token en esos momentos y el backend tampoco lo
 * exige ahí (son los únicos endpoints públicos junto con GET /provider-companies).
 * @author FuelBridge Platform
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthEndpoint = req.url.includes('/authentication/sign-in') || req.url.includes('/authentication/sign-up');
  const token = SessionStorage.getToken();

  if (!token || isAuthEndpoint) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
