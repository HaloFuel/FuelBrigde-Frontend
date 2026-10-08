import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * @summary Roles soportados por el backend de FuelBridge.
 * @remarks Deben calzar exactamente con el enum Roles del IAM bounded context
 * en el backend (ROLE_BUYER, ROLE_PROVIDER). Cualquier otro string es rechazado
 * por el servidor al hacer sign-up.
 * @author FuelBridge Platform
 */
export type Role = 'ROLE_BUYER' | 'ROLE_PROVIDER';

/**
 * @summary Entidad de dominio que representa la sesión autenticada del usuario.
 * @remarks Se construye a partir de la respuesta de /authentication/sign-in.
 * El id del backend es numérico (Long autoincremental), no un UUID, a
 * diferencia del resto de entidades del frontend que asumen BaseEntity con
 * id: string; aquí se castea a string solo para cumplir la interfaz y poder
 * reutilizar los mismos tipos base del proyecto.
 * @author FuelBridge Platform
 */
export class AuthenticatedUser implements BaseEntity {
  id: string;
  username: string;
  token: string;
  roles: Role[];

  constructor(params: { id: string; username: string; token: string; roles: Role[] }) {
    this.id = params.id;
    this.username = params.username;
    this.token = params.token;
    this.roles = params.roles;
  }

  hasRole(role: Role): boolean {
    return this.roles.includes(role);
  }
}

/**
 * @summary Payload para registrar un nuevo usuario.
 * @remarks roles debe omitirse o venir vacío para que el backend asigne
 * ROLE_BUYER por defecto; companyId/providerId quedan en null hasta que el
 * usuario complete el perfil de su empresa (fuera del alcance de este login).
 * @author FuelBridge Platform
 */
export interface SignUpPayload {
  username: string;
  password: string;
  roles: Role[];
  companyId: number | null;
  providerId: number | null;
}
