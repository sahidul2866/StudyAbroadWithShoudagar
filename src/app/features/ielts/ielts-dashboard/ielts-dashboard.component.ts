import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-ielts-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">IELTS Practice Center</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Improve your English skills with AI-powered practice tests and get instant feedback on your performance.
          </p>
        </div>

        <!-- Practice Sections -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <!-- Listening -->
          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6h6a3 3 0 000-6H9z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Listening</h3>
            <p class="text-gray-600 text-center mb-4">Practice with audio recordings and conversations</p>
            <a routerLink="/ielts/practice/listening" 
               class="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Start Practice
            </a>
          </div>

          <!-- Reading -->
          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Reading</h3>
            <p class="text-gray-600 text-center mb-4">Comprehension tests with various text types</p>
            <a routerLink="/ielts/practice/reading" 
               class="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors">
              Start Practice
            </a>
          </div>

          <!-- Writing -->
          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Writing</h3>
            <p class="text-gray-600 text-center mb-4">AI-powered essay evaluation and feedback</p>
            <a routerLink="/ielts/practice/writing" 
               class="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Start Practice
            </a>
          </div>

          <!-- Speaking -->
          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Speaking</h3>
            <p class="text-gray-600 text-center mb-4">Record responses and get AI feedback</p>
            <a routerLink="/ielts/practice/speaking" 
               class="block w-full bg-orange-600 text-white text-center py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Start Practice
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Tests Completed</span>
                <span class="font-semibold text-gray-900">12</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Best Overall Score</span>
                <span class="font-semibold text-green-600">7.5</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Average Score</span>
                <span class="font-semibold text-gray-900">6.8</span>
              </div>
            </div>
            <a routerLink="/ielts/results" 
               class="block w-full mt-4 bg-gray-100 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-200 transition-colors">
              View Detailed Results
            </a>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Leaderboard</h3>
            <p class="text-gray-600 mb-4">See how you rank against other students</p>
            <a routerLink="/ielts/leaderboard" 
               class="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors">
              View Leaderboard
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IeltsDashboardComponent {}