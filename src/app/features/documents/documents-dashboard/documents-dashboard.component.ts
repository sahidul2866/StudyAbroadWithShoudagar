import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-documents-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Document Generator</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Create professional documents for your study abroad applications with AI assistance.
          </p>
        </div>

        <!-- Document Types -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Statement of Purpose</h3>
            <p class="text-gray-600 text-center mb-4">AI-powered SOP generator for university applications</p>
            <a routerLink="/documents/generate/sop" 
               class="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Generate SOP
            </a>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Resume/CV</h3>
            <p class="text-gray-600 text-center mb-4">Professional resume templates for international applications</p>
            <a routerLink="/documents/generate/resume" 
               class="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors">
              Create Resume
            </a>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Cover Letter</h3>
            <p class="text-gray-600 text-center mb-4">Personalized cover letters for job and university applications</p>
            <a routerLink="/documents/generate/cover-letter" 
               class="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Write Cover Letter
            </a>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Bank Solvency</h3>
            <p class="text-gray-600 text-center mb-4">Financial documents for visa applications</p>
            <a routerLink="/documents/generate/bank-solvency" 
               class="block w-full bg-orange-600 text-white text-center py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Generate Document
            </a>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Letter of Recommendation</h3>
            <p class="text-gray-600 text-center mb-4">Professional LOR templates and guidelines</p>
            <a routerLink="/documents/generate/lor" 
               class="block w-full bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700 transition-colors">
              Create LOR
            </a>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Scholarship Essay</h3>
            <p class="text-gray-600 text-center mb-4">Compelling essays for scholarship applications</p>
            <a routerLink="/documents/generate/scholarship-essay" 
               class="block w-full bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Write Essay
            </a>
          </div>
        </div>

        <!-- My Documents -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900">My Documents</h2>
            <a routerLink="/documents/my-documents" 
               class="text-green-600 hover:text-green-700 font-medium">
              View All
            </a>
          </div>
          <p class="text-gray-600">You have 5 saved documents. Click "View All" to manage your documents.</p>
        </div>
      </div>
    </div>
  `
})
export class DocumentsDashboardComponent {}