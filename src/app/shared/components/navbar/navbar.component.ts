import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-lg border-b-2 border-green-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <a routerLink="/home" class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-green-600 to-red-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">S</span>
              </div>
              <span class="text-xl font-bold text-gray-800">StudyAbroadWithShoudagar</span>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <ng-container *ngIf="currentUser; else guestNav">
              <a routerLink="/dashboard" 
                 routerLinkActive="text-green-600 border-b-2 border-green-600"
                 class="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                Dashboard
              </a>
              <a routerLink="/ielts" 
                 routerLinkActive="text-green-600 border-b-2 border-green-600"
                 class="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                IELTS Practice
              </a>
              <a routerLink="/courses" 
                 routerLinkActive="text-green-600 border-b-2 border-green-600"
                 class="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                Courses
              </a>
              <a routerLink="/documents" 
                 routerLinkActive="text-green-600 border-b-2 border-green-600"
                 class="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                Documents
              </a>
              <a routerLink="/materials" 
                 routerLinkActive="text-green-600 border-b-2 border-green-600"
                 class="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                Materials
              </a>
              
              <!-- Admin Link -->
              <a *ngIf="currentUser.role === 'admin'" 
                 routerLink="/admin" 
                 routerLinkActive="text-red-600 border-b-2 border-red-600"
                 class="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors">
                Admin Panel
              </a>

              <!-- User Menu -->
              <div class="relative">
                <button (click)="toggleUserMenu()" 
                        class="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span class="text-green-600 font-semibold text-sm">
                      {{ currentUser.firstName.charAt(0) }}{{ currentUser.lastName.charAt(0) }}
                    </span>
                  </div>
                  <span class="text-sm font-medium">{{ currentUser.firstName }}</span>
                  <svg class="w-4 h-4 transform transition-transform" 
                       [class.rotate-180]="isUserMenuOpen"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div *ngIf="isUserMenuOpen" 
                     class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <a routerLink="/profile" 
                     class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                    Profile Settings
                  </a>
                  <a routerLink="/payment/history" 
                     class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                    Payment History
                  </a>
                  <div class="border-t border-gray-100 my-1"></div>
                  <button (click)="logout()" 
                          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            </ng-container>

            <!-- Guest Navigation -->
            <ng-template #guestNav>
              <a routerLink="/auth/login" 
                 class="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                Login
              </a>
              <a routerLink="/auth/register" 
                 class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Get Started
              </a>
            </ng-template>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center">
            <button (click)="toggleMobileMenu()" 
                    class="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                <path *ngIf="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <ng-container *ngIf="currentUser; else guestMobileNav">
            <a routerLink="/dashboard" 
               class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
              Dashboard
            </a>
            <a routerLink="/ielts" 
               class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
              IELTS Practice
            </a>
            <a routerLink="/courses" 
               class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
              Courses
            </a>
            <a routerLink="/documents" 
               class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
              Documents
            </a>
            <a routerLink="/materials" 
               class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
              Materials
            </a>
            
            <div class="border-t border-gray-200 pt-2 mt-2">
              <div class="px-3 py-2">
                <div class="text-sm font-medium text-gray-500">Signed in as</div>
                <div class="text-sm font-medium text-gray-900">{{ currentUser.firstName }} {{ currentUser.lastName }}</div>
              </div>
              <button (click)="logout()" 
                      class="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
                Sign Out
              </button>
            </div>
          </ng-container>

          <ng-template #guestMobileNav>
            <a routerLink="/auth/login" 
               class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
              Login
            </a>
            <a routerLink="/auth/register" 
               class="block px-3 py-2 text-base font-medium bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors">
              Get Started
            </a>
          </ng-template>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  isUserMenuOpen = false;
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isUserMenuOpen = false;
    this.isMobileMenuOpen = false;
  }
}