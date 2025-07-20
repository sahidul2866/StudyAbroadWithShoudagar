import { Routes } from '@angular/router';

export const documentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./documents-dashboard/documents-dashboard.component').then(m => m.DocumentsDashboardComponent)
  },
  {
    path: 'generate/:type',
    loadComponent: () => import('./document-generator/document-generator.component').then(m => m.DocumentGeneratorComponent)
  },
  {
    path: 'my-documents',
    loadComponent: () => import('./my-documents/my-documents.component').then(m => m.MyDocumentsComponent)
  }
];