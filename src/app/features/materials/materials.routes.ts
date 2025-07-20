import { Routes } from '@angular/router';

export const materialsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./materials-dashboard/materials-dashboard.component').then(m => m.MaterialsDashboardComponent)
  }
];