import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * @summary Vista "Acerca de" de FuelBridge.
 * @remarks Muestra información institucional sobre la plataforma FuelBridge
 * y el equipo HaloFuel. Utiliza ngx-translate para mostrar el contenido
 * en el idioma seleccionado. No contiene lógica de negocio.
 * @author FuelBridge Platform
 */
@Component({
  selector: 'app-about',
  imports: [TranslatePipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {}
