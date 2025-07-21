import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { IeltsService, LeaderboardEntry } from '../../../core/services/ielts.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">IELTS Leaderboard</h1>
          <p class="text-gray-600">See how you rank against other students in the community</p>
        </div>

        <!-- Section Filter -->
        <div class="flex justify-center mb-8">
          <div class="bg-white rounded-lg p-1 shadow-sm">
            <button 
              *ngFor="let section of sections"
              (click)="selectedSection = section.value; loadLeaderboard()"
              [class]="selectedSection === section.value ? 
                'bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors' : 
                'text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors'">
              {{ section.label }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-12">
          <div class="spinner mx-auto mb-4" style="width: 2rem; height: 2rem;"></div>
          <p class="text-gray-600">Loading leaderboard...</p>
        </div>

        <!-- Leaderboard -->
        <div *ngIf="!isLoading && leaderboard.length > 0" class="space-y-4">
          <!-- Top 3 Podium -->
          <div class="grid md:grid-cols-3 gap-4 mb-8" *ngIf="leaderboard.length >= 3">
            <!-- 2nd Place -->
            <div class="order-1 md:order-1">
              <div class="card text-center relative" *ngIf="leaderboard[1]">
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div class="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                </div>
                <div class="card-body pt-8">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span class="text-lg font-bold text-gray-600">
                      {{ leaderboard[1].firstName.charAt(0) }}{{ leaderboard[1].lastName.charAt(0) }}
                    </span>
                  </div>
                  <h3 class="font-semibold text-gray-900">{{ leaderboard[1].firstName }} {{ leaderboard[1].lastName }}</h3>
                  <p class="text-sm text-gray-500 mb-2">{{ leaderboard[1].targetCountry }}</p>
                  <div class="text-2xl font-bold text-gray-600 mb-1">{{ leaderboard[1].bestScore }}</div>
                  <div class="text-xs text-gray-500">Best Score</div>
                </div>
              </div>
            </div>

            <!-- 1st Place -->
            <div class="order-2 md:order-2">
              <div class="card text-center relative" *ngIf="leaderboard[0]">
                <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div class="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                    👑
                  </div>
                </div>
                <div class="card-body pt-10">
                  <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-xl font-bold text-yellow-600">
                      {{ leaderboard[0].firstName.charAt(0) }}{{ leaderboard[0].lastName.charAt(0) }}
                    </span>
                  </div>
                  <h3 class="font-semibold text-gray-900 text-lg">{{ leaderboard[0].firstName }} {{ leaderboard[0].lastName }}</h3>
                  <p class="text-sm text-gray-500 mb-3">{{ leaderboard[0].targetCountry }}</p>
                  <div class="text-3xl font-bold text-yellow-600 mb-1">{{ leaderboard[0].bestScore }}</div>
                  <div class="text-sm text-gray-500">Best Score</div>
                </div>
              </div>
            </div>

            <!-- 3rd Place -->
            <div class="order-3 md:order-3">
              <div class="card text-center relative" *ngIf="leaderboard[2]">
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div class="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                </div>
                <div class="card-body pt-8">
                  <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span class="text-lg font-bold text-orange-600">
                      {{ leaderboard[2].firstName.charAt(0) }}{{ leaderboard[2].lastName.charAt(0) }}
                    </span>
                  </div>
                  <h3 class="font-semibold text-gray-900">{{ leaderboard[2].firstName }} {{ leaderboard[2].lastName }}</h3>
                  <p class="text-sm text-gray-500 mb-2">{{ leaderboard[2].targetCountry }}</p>
                  <div class="text-2xl font-bold text-orange-600 mb-1">{{ leaderboard[2].bestScore }}</div>
                  <div class="text-xs text-gray-500">Best Score</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Rest of the Leaderboard -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Full Rankings</h3>
            </div>
            <div class="card-body p-0">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Score</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Test</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let entry of leaderboard; let i = index" 
                        [class]="i < 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <span class="text-sm font-medium text-gray-900">{{ i + 1 }}</span>
                          <span *ngIf="i === 0" class="ml-2 text-yellow-500">👑</span>
                          <span *ngIf="i === 1" class="ml-2 text-gray-400">🥈</span>
                          <span *ngIf="i === 2" class="ml-2 text-orange-500">🥉</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <span class="text-sm font-medium text-gray-600">
                              {{ entry.firstName.charAt(0) }}{{ entry.lastName.charAt(0) }}
                            </span>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-gray-900">
                              {{ entry.firstName }} {{ entry.lastName }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm text-gray-900">{{ entry.targetCountry }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-bold text-green-600">{{ entry.bestScore }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ entry.averageScore }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="badge badge-secondary">{{ entry.testCount }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ entry.lastTestDate | date:'shortDate' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && leaderboard.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No rankings available</h3>
          <p class="text-gray-600 mb-6">Be the first to take a test and appear on the leaderboard!</p>
          <a routerLink="/ielts" class="btn btn-primary">
            Start Practice Test
          </a>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-12">
          <div class="card bg-gradient-to-r from-green-50 to-blue-50">
            <div class="card-body text-center">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Want to climb the leaderboard?</h3>
              <p class="text-gray-600 mb-4">Take more practice tests to improve your ranking and achieve your target score!</p>
              <a routerLink="/ielts" class="btn btn-primary">
                Practice More Tests
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardEntry[] = [];
  selectedSection: string = 'overall';
  isLoading: boolean = false;

  sections = [
    { value: 'overall', label: 'Overall' },
    { value: 'writing', label: 'Writing' },
    { value: 'speaking', label: 'Speaking' },
    { value: 'listening', label: 'Listening' },
    { value: 'reading', label: 'Reading' }
  ];

  constructor(private ieltsService: IeltsService) {}

  ngOnInit() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.isLoading = true;
    
    this.ieltsService.getLeaderboard(this.selectedSection, 50).subscribe({
      next: (response) => {
        this.leaderboard = response.leaderboard;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading leaderboard:', error);
        this.isLoading = false;
      }
    });
  }
}