import { Role } from '../domain/model/session.entity';

/**
 * @summary Cuerpo de la petición POST /authentication/sign-in.
 * @author FuelBridge Platform
 */
export interface SignInRequest {
  username: string;
  password: string;
}

/**
 * @summary Respuesta del backend para /authentication/sign-in.
 * @remarks Forma exacta de AuthenticatedUserResource en el backend:
 * record AuthenticatedUserResource(Long id, String username, String token).
 * No incluye roles; el backend no los devuelve en el sign-in.
 * @author FuelBridge Platform
 */
export interface SignInResource {
  id: number;
  username: string;
  token: string;
}

/**
 * @summary Cuerpo de la petición POST /authentication/sign-up.
 * @author FuelBridge Platform
 */
export interface SignUpRequest {
  username: string;
  password: string;
  roles: Role[];
  companyId: number | null;
  providerId: number | null;
}

/**
 * @summary Respuesta del backend para /authentication/sign-up.
 * @remarks No incluye token; hay que hacer sign-in aparte para obtenerlo.
 * @author FuelBridge Platform
 */
export interface SignUpResource {
  id: number;
  username: string;
  roles: Role[];
  companyId: number | null;
  providerId: number | null;
}
