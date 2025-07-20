import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full text-center">
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-green-600">404</h1>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p class="text-gray-600 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div class="space-y-4">
          <a routerLink="/home" 
             class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Go Home
          </a>
          <div>
            <a routerLink="/dashboard" 
               class="text-green-600 hover:text-green-700 font-medium">
              Return to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}