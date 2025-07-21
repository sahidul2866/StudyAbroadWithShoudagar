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
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-6">
            <span class="text-3xl">🎯</span>
          </div>
          <h1 class="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
            IELTS Practice Center
          </h1>
          <p class="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Improve your English skills with AI-powered practice tests and get instant feedback on your performance.
          </p>
        </div>

        <!-- Practice Sections -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <!-- Listening -->
          <div class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6h6a3 3 0 000-6H9z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 text-center mb-3">Listening</h3>
            <p class="text-gray-600 text-center mb-6 leading-relaxed">Practice with audio recordings and conversations</p>
            <a routerLink="/ielts/practice/listening" 
               class="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
              Start Practice
            </a>
          </div>

          <!-- Reading -->
          <div class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 text-center mb-3">Reading</h3>
            <p class="text-gray-600 text-center mb-6 leading-relaxed">Comprehension tests with various text types</p>
            <a routerLink="/ielts/practice/reading" 
               class="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
              Start Practice
            </a>
          </div>

          <!-- Writing -->
          <div class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 text-center mb-3">Writing</h3>
            <p class="text-gray-600 text-center mb-6 leading-relaxed">AI-powered essay evaluation and feedback</p>
            <a routerLink="/ielts/practice/writing" 
               class="block w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
              Start Practice
            </a>
          </div>

          <!-- Speaking -->
          <div class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 text-center mb-3">Speaking</h3>
            <p class="text-gray-600 text-center mb-6 leading-relaxed">Record responses and get AI feedback</p>
            <a routerLink="/ielts/practice/speaking" 
               class="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
              Start Practice
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <span class="text-xl">📊</span>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">Your Progress</h3>
            </div>
            <div class="space-y-6">
              <div class="flex justify-between items-center">
                <span class="text-gray-700 font-medium">Tests Completed</span>
                <span class="font-bold text-2xl text-blue-600">12</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-700 font-medium">Best Overall Score</span>
                <span class="font-bold text-2xl text-green-600">7.5</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-700 font-medium">Average Score</span>
                <span class="font-bold text-2xl text-purple-600">6.8</span>
              </div>
            </div>
            <a routerLink="/ielts/results" 
               class="block w-full mt-8 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-center py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
              View Detailed Results
            </a>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                <span class="text-xl">🏆</span>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">Leaderboard</h3>
            </div>
            <p class="text-gray-700 mb-6 leading-relaxed">See how you rank against other students in the community</p>
            <a routerLink="/ielts/leaderboard" 
               class="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
              View Leaderboard
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IeltsDashboardComponent {}