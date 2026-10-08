import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * @summary Barra de navegación superior (Toolbar) para FuelBridge.
 * @remarks Componente presentacional que envuelve el logo de la marca,
 * el título y el selector de idiomas. Se utiliza principalmente en
 * vistas públicas (como el Home) donde no se requiere el Sidenav. Muestra
 * un link de inicio de sesión o el nombre de usuario y cerrar sesión según
 * el estado del IamStore.
 * @author FuelBridge Platform
 */
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, LanguageSwitcher],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  protected readonly iam = inject(IamStore);

  signOut(): void {
    this.iam.signOut();
  }
}
