import { Routes } from '@angular/router';

export const ieltsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ielts-dashboard/ielts-dashboard.component').then(m => m.IeltsDashboardComponent)
  },
  {
    path: 'practice/:section',
    loadComponent: () => import('./practice/practice.component').then(m => m.PracticeComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./results/results.component').then(m => m.ResultsComponent)
  },
  {
    path: 'leaderboard',
    loadComponent: () => import('./leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)
  }
];