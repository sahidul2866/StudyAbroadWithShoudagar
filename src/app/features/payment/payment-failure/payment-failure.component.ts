import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-payment-failure',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
          <p class="text-gray-600 mb-8">There was an issue processing your payment. Please try again.</p>
          <a routerLink="/courses" 
             class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Try Again
          </a>
        </div>
      </div>
    </div>
  `
})
export class PaymentFailureComponent {}