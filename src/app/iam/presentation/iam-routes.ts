import { Routes } from '@angular/router';

const login = () => import('./views/login/login').then((m) => m.Login);

export const iamRoutes: Routes = [{ path: '', loadComponent: login, title: 'Iniciar sesión - FuelBridge' }];
