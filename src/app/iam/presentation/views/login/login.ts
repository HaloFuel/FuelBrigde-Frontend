import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IamStore } from '../../../application/iam.store';
import { Role } from '../../../domain/model/session.entity';

type Mode = 'login' | 'register';

/**
 * @summary Pantalla combinada de inicio de sesión y registro.
 * @remarks Un solo componente con dos modos porque comparten el mismo
 * formulario base (usuario/contraseña); registro agrega la selección de rol.
 * Al registrarse, el store hace sign-up y luego sign-in automático para que
 * el usuario quede logueado sin un paso extra.
 * @author FuelBridge Platform
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly store = inject(IamStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly mode = signal<Mode>('login');
  readonly selectedRole = signal<Role>('ROLE_BUYER');
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;

  readonly isRegisterMode = computed(() => this.mode() === 'register');

  protected credentialsForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  setMode(mode: Mode): void {
    this.mode.set(mode);
    this.store.clearError();
  }

  pickRole(role: Role): void {
    this.selectedRole.set(role);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.credentialsForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'This field is required';
    if (field.errors['minlength']) return `Minimum length: ${field.errors['minlength'].requiredLength}`;

    return '';
  }

  submit(): void {
    if (this.credentialsForm.invalid) {
      this.credentialsForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.credentialsForm.value;
    const onSuccess = () => this.router.navigateByUrl('/dashboard');

    if (this.mode() === 'login') {
      this.store.signIn(username, password, onSuccess);
    } else {
      this.store.signUp(username, password, this.selectedRole(), onSuccess);
    }
  }
}
