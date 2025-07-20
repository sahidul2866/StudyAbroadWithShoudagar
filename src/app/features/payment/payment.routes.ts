import { Routes } from '@angular/router';

export const paymentRoutes: Routes = [
  {
    path: 'history',
    loadComponent: () => import('./payment-history/payment-history.component').then(m => m.PaymentHistoryComponent)
  },
  {
    path: 'success',
    loadComponent: () => import('./payment-success/payment-success.component').then(m => m.PaymentSuccessComponent)
  },
  {
    path: 'failure',
    loadComponent: () => import('./payment-failure/payment-failure.component').then(m => m.PaymentFailureComponent)
  }
];