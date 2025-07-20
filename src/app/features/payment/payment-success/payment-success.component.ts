import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p class="text-gray-600 mb-8">Your payment has been processed successfully.</p>
          <a routerLink="/courses" 
             class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            View Your Courses
          </a>
        </div>
      </div>
    </div>
  `
})
export class PaymentSuccessComponent {}