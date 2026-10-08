import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { environment } from '../../../environments/environment';
import { AuthenticatedUser, SignUpPayload } from '../domain/model/session.entity';
import { SignInResource, SignUpResource } from './iam-response';
import { IamAssembler } from './iam-assembler';

const signInUrl = `${environment.serverBasePath}${environment.iamSignInEndpointPath}`;
const signUpUrl = `${environment.serverBasePath}${environment.iamSignUpEndpointPath}`;

function toFriendlyError(operation: string) {
  return (error: HttpErrorResponse): Observable<never> => {
    let message = operation;
    if (error.status === 401) {
      message = 'Usuario o contraseña incorrectos';
    } else if (error.status === 409) {
      message = 'Ese nombre de usuario ya está registrado';
    } else if (error.status === 0) {
      message = 'No se pudo contactar al servidor';
    } else if (error.error?.message) {
      message = error.error.message;
    }
    console.error(`[FuelBridge IAM Error] ${operation}`, error);
    return throwError(() => new Error(message));
  };
}

/**
 * @summary API gateway para el bounded context IAM (Identity and Access Management).
 * @remarks A diferencia de InventoryApi/OrderingApi, no agrega ApiEndpoint
 * classes porque sign-in/sign-up no son operaciones CRUD sobre una colección;
 * llama directo al HttpClient, igual que lo haría un ApiEndpoint, pero sin
 * forzar el contrato genérico de BaseApiEndpoint (getAll/getById/etc. no
 * tienen sentido para autenticación).
 * @author FuelBridge Platform
 */
@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  private readonly assembler = new IamAssembler();

  constructor(private readonly http: HttpClient) {
    super();
  }

  signIn(username: string, password: string): Observable<AuthenticatedUser> {
    return this.http.post<SignInResource>(signInUrl, { username, password }).pipe(
      map((resource) => this.assembler.toAuthenticatedUserFromResource(resource)),
      catchError(toFriendlyError('Sign-in failed')),
    );
  }

  signUp(payload: SignUpPayload): Observable<SignUpResource> {
    return this.http
      .post<SignUpResource>(signUpUrl, payload)
      .pipe(catchError(toFriendlyError('Sign-up failed')));
  }
}
