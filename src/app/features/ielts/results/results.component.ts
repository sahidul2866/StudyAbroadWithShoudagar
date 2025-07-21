import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { IeltsService, IeltsTestResult } from '../../../core/services/ielts.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Your IELTS Test Results</h1>
          <p class="text-gray-600">Track your progress and see detailed feedback from all your practice tests</p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex justify-center mb-8">
          <div class="bg-white rounded-lg p-1 shadow-sm">
            <button 
              *ngFor="let section of sections"
              (click)="selectedSection = section.value; loadResults()"
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
          <p class="text-gray-600">Loading your test results...</p>
        </div>

        <!-- Results List -->
        <div *ngIf="!isLoading && results.length > 0" class="space-y-6">
          <div *ngFor="let result of results" class="card hover:shadow-lg transition-shadow">
            <div class="card-body">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="badge badge-primary">{{ result.section | titlecase }}</span>
                    <span class="text-sm text-gray-500">
                      {{ result.createdAt | date:'medium' }}
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-6 mb-4">
                    <div class="text-center">
                      <div class="text-3xl font-bold text-green-600">{{ result.overallScore }}</div>
                      <div class="text-sm text-gray-500">Overall Band</div>
                    </div>
                    
                    <div class="flex-1">
                      <div class="text-sm text-gray-600 mb-2">Performance Breakdown:</div>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" *ngIf="result.detailedScores">
                        <div *ngIf="result.detailedScores.taskAchievement" class="text-center">
                          <div class="text-lg font-semibold text-blue-600">{{ result.detailedScores.taskAchievement }}</div>
                          <div class="text-xs text-gray-500">Task Achievement</div>
                        </div>
                        <div *ngIf="result.detailedScores.coherenceCohesion" class="text-center">
                          <div class="text-lg font-semibold text-green-600">{{ result.detailedScores.coherenceCohesion }}</div>
                          <div class="text-xs text-gray-500">Coherence</div>
                        </div>
                        <div *ngIf="result.detailedScores.lexicalResource" class="text-center">
                          <div class="text-lg font-semibold text-purple-600">{{ result.detailedScores.lexicalResource }}</div>
                          <div class="text-xs text-gray-500">Vocabulary</div>
                        </div>
                        <div *ngIf="result.detailedScores.grammaticalRange" class="text-center">
                          <div class="text-lg font-semibold text-orange-600">{{ result.detailedScores.grammaticalRange }}</div>
                          <div class="text-xs text-gray-500">Grammar</div>
                        </div>
                        <div *ngIf="result.detailedScores.fluency" class="text-center">
                          <div class="text-lg font-semibold text-blue-600">{{ result.detailedScores.fluency }}</div>
                          <div class="text-xs text-gray-500">Fluency</div>
                        </div>
                        <div *ngIf="result.detailedScores.pronunciation" class="text-center">
                          <div class="text-lg font-semibold text-red-600">{{ result.detailedScores.pronunciation }}</div>
                          <div class="text-xs text-gray-500">Pronunciation</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Feedback Preview -->
                  <div class="bg-gray-50 rounded-lg p-4 mb-4">
                    <p class="text-sm text-gray-700 line-clamp-2">{{ result.feedback }}</p>
                  </div>

                  <!-- Strengths and Improvements -->
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 class="text-sm font-semibold text-green-700 mb-2">Key Strengths</h5>
                      <ul class="space-y-1">
                        <li *ngFor="let strength of result.strengths.slice(0, 2)" 
                            class="text-xs text-gray-600 flex items-start">
                          <span class="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          {{ strength }}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 class="text-sm font-semibold text-orange-700 mb-2">Areas to Improve</h5>
                      <ul class="space-y-1">
                        <li *ngFor="let improvement of result.improvements.slice(0, 2)" 
                            class="text-xs text-gray-600 flex items-start">
                          <span class="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          {{ improvement }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="ml-4 flex flex-col space-y-2">
                  <button 
                    (click)="toggleDetails(result.id)"
                    class="btn btn-secondary btn-sm">
                    {{ expandedResults.has(result.id) ? 'Hide Details' : 'View Details' }}
                  </button>
                  <button 
                    (click)="retakeTest(result.section)"
                    class="btn btn-primary btn-sm">
                    Retake Test
                  </button>
                </div>
              </div>

              <!-- Expanded Details -->
              <div *ngIf="expandedResults.has(result.id)" class="mt-6 pt-6 border-t border-gray-200">
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 class="font-semibold text-green-700 mb-3">All Strengths</h5>
                    <ul class="space-y-2">
                      <li *ngFor="let strength of result.strengths" 
                          class="text-sm text-gray-700 flex items-start">
                        <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {{ strength }}
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 class="font-semibold text-orange-700 mb-3">All Improvements</h5>
                    <ul class="space-y-2">
                      <li *ngFor="let improvement of result.improvements" 
                          class="text-sm text-gray-700 flex items-start">
                        <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {{ improvement }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="mt-6">
                  <h5 class="font-semibold text-blue-700 mb-3">Recommendations</h5>
                  <ul class="space-y-2">
                    <li *ngFor="let recommendation of result.recommendations" 
                        class="text-sm text-gray-700 flex items-start">
                      <svg class="w-4 h-4 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      {{ recommendation }}
                    </li>
                  </ul>
                </div>

                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 class="font-semibold text-blue-800 mb-2">Complete Feedback</h5>
                  <p class="text-sm text-blue-700">{{ result.feedback }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && results.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No test results yet</h3>
          <p class="text-gray-600 mb-6">
            {{ selectedSection === 'all' ? 'Take your first IELTS practice test to see results here.' : 
               'No ' + selectedSection + ' test results found. Try a different section or take a test.' }}
          </p>
          <a routerLink="/ielts" class="btn btn-primary">
            Start Practice Test
          </a>
        </div>

        <!-- Pagination -->
        <div *ngIf="pagination && pagination.totalPages > 1" class="flex justify-center mt-8">
          <nav class="flex items-center space-x-2">
            <button 
              (click)="loadResults(currentPage - 1)"
              [disabled]="currentPage === 1"
              class="btn btn-secondary btn-sm">
              Previous
            </button>
            
            <span class="px-4 py-2 text-sm text-gray-700">
              Page {{ currentPage }} of {{ pagination.totalPages }}
            </span>
            
            <button 
              (click)="loadResults(currentPage + 1)"
              [disabled]="currentPage === pagination.totalPages"
              class="btn btn-secondary btn-sm">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  `
})
export class ResultsComponent implements OnInit {
  results: IeltsTestResult[] = [];
  selectedSection: string = 'all';
  isLoading: boolean = false;
  expandedResults: Set<string> = new Set();
  currentPage: number = 1;
  pagination: any = null;

  sections = [
    { value: 'all', label: 'All Tests' },
    { value: 'writing', label: 'Writing' },
    { value: 'speaking', label: 'Speaking' },
    { value: 'listening', label: 'Listening' },
    { value: 'reading', label: 'Reading' }
  ];

  constructor(private ieltsService: IeltsService) {}

  ngOnInit() {
    this.loadResults();
  }

  loadResults(page: number = 1) {
    this.isLoading = true;
    this.currentPage = page;
    
    const section = this.selectedSection === 'all' ? undefined : this.selectedSection;
    
    this.ieltsService.getTestResults(section, page, 10).subscribe({
      next: (response) => {
        this.results = response.results;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading results:', error);
        this.isLoading = false;
      }
    });
  }

  toggleDetails(resultId: string) {
    if (this.expandedResults.has(resultId)) {
      this.expandedResults.delete(resultId);
    } else {
      this.expandedResults.add(resultId);
    }
  }

  retakeTest(section: string) {
    // Navigate to practice test for the specific section
    window.location.href = `/ielts/practice/${section}`;
  }
}