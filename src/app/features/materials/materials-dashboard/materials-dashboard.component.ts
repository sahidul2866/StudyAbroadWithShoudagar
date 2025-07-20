import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-materials-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Study Materials</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive IELTS study materials including grammar guides, vocabulary lists, and practice tests.
          </p>
        </div>

        <!-- Material Categories -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 text-center mb-2">Grammar Guides</h3>
            <p class="text-gray-600 text-center text-sm mb-4">Essential grammar rules and exercises</p>
            <div class="text-center text-sm text-gray-500">25 Resources</div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 text-center mb-2">Vocabulary Lists</h3>
            <p class="text-gray-600 text-center text-sm mb-4">Topic-wise vocabulary for IELTS</p>
            <div class="text-center text-sm text-gray-500">40 Lists</div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 text-center mb-2">Practice Tests</h3>
            <p class="text-gray-600 text-center text-sm mb-4">Full-length practice tests with answers</p>
            <div class="text-center text-sm text-gray-500">15 Tests</div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 text-center mb-2">Video Tutorials</h3>
            <p class="text-gray-600 text-center text-sm mb-4">Expert tips and strategies</p>
            <div class="text-center text-sm text-gray-500">30 Videos</div>
          </div>
        </div>

        <!-- Featured Materials -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Featured Materials</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">IELTS Writing Task 1 Guide</h3>
                  <p class="text-sm text-gray-600 mt-1">Complete guide for academic writing task 1</p>
                  <div class="flex items-center mt-2 text-xs text-gray-500">
                    <span>PDF • 45 pages</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">Academic Vocabulary List</h3>
                  <p class="text-sm text-gray-600 mt-1">1000+ essential academic words</p>
                  <div class="flex items-center mt-2 text-xs text-gray-500">
                    <span>PDF • 25 pages</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">Speaking Practice Videos</h3>
                  <p class="text-sm text-gray-600 mt-1">Sample answers and pronunciation tips</p>
                  <div class="flex items-center mt-2 text-xs text-gray-500">
                    <span>Video • 2 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MaterialsDashboardComponent {}