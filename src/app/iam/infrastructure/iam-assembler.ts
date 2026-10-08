import { AuthenticatedUser } from '../domain/model/session.entity';
import { SignInResource } from './iam-response';

/**
 * @summary Assembler para transformar la respuesta de autenticación en la entidad de sesión.
 * @remarks No implementa BaseAssembler porque sign-in/sign-up no son recursos
 * CRUD de una colección, son operaciones de autenticación; se mantiene como
 * una clase simple siguiendo el mismo espíritu de separar infraestructura de
 * dominio que el resto de bounded contexts del proyecto.
 * @author FuelBridge Platform
 */
export class IamAssembler {
  toAuthenticatedUserFromResource(resource: SignInResource): AuthenticatedUser {
    return new AuthenticatedUser({
      id: String(resource.id),
      username: resource.username,
      token: resource.token,
      roles: [],
    });
  }
}
