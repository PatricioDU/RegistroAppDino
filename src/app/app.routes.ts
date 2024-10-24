import { Routes } from '@angular/router';
import { ingresoGuard } from './guards/ingreso-guard.service';
import { inicioGuard } from './guards/inicio-guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ingreso',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    canActivate: [ingresoGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage),
    canActivate: [inicioGuard]
  },
  {
    path: 'theme',
    loadComponent: () => import('./pages/theme/theme.page').then( m => m.ThemePage)
  },
  {
    path: 'ingreso',
    loadComponent: () => import('./pages/ingreso/ingreso.page').then(m => m.ingresoPage),
    canActivate: [ingresoGuard]
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage),
    canActivate: [inicioGuard]
  },
  {
    path: 'misdatos',
    loadComponent: () => import('./pages/misdatos/misdatos.page').then(m => m.misdatosPage),
  },
];
