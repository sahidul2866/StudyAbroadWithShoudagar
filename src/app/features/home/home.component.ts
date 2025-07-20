import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-green-50 to-red-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Your Gateway to 
              <span class="text-green-600">Study Abroad</span>
              Success
            </h1>
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">
              Master IELTS, get expert guidance, and achieve your dream of studying in 
              USA, UK, Canada, or Australia with our comprehensive platform designed for Bangladeshi students.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <a routerLink="/auth/register" 
                 class="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors text-center">
                Start Your Journey
              </a>
              <a routerLink="/ielts" 
                 class="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors text-center">
                Try IELTS Practice
              </a>
            </div>
          </div>
          <div class="relative">
            <img src="https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=600" 
                 alt="Students studying abroad" 
                 class="rounded-2xl shadow-2xl">
            <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">5000+ Students</div>
                  <div class="text-gray-600 text-sm">Successfully placed abroad</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Study Abroad
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            From IELTS preparation to visa guidance, we provide comprehensive support for your study abroad journey.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- IELTS Practice -->
          <div class="bg-green-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">AI-Powered IELTS Practice</h3>
            <p class="text-gray-600 mb-4">Get personalized feedback on your speaking and writing with our advanced AI evaluation system.</p>
            <a routerLink="/ielts" class="text-green-600 font-semibold hover:text-green-700">Practice Now →</a>
          </div>

          <!-- Video Courses -->
          <div class="bg-blue-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Expert Video Courses</h3>
            <p class="text-gray-600 mb-4">Learn from experienced mentors about visa interviews, SOP writing, and scholarship applications.</p>
            <a routerLink="/courses" class="text-blue-600 font-semibold hover:text-blue-700">Browse Courses →</a>
          </div>

          <!-- Document Generation -->
          <div class="bg-purple-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Smart Document Generator</h3>
            <p class="text-gray-600 mb-4">Create professional SOPs, resumes, and cover letters with AI assistance and export to PDF.</p>
            <a routerLink="/documents" class="text-purple-600 font-semibold hover:text-purple-700">Generate Documents →</a>
          </div>

          <!-- Study Materials -->
          <div class="bg-orange-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Comprehensive Study Materials</h3>
            <p class="text-gray-600 mb-4">Access grammar guides, vocabulary lists, practice tests, and video tutorials for IELTS preparation.</p>
            <a routerLink="/materials" class="text-orange-600 font-semibold hover:text-orange-700">Explore Materials →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-green-600 mb-2">5,000+</div>
            <div class="text-gray-600">Students Helped</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div class="text-gray-600">Visa Success Rate</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-purple-600 mb-2">50+</div>
            <div class="text-gray-600">Expert Courses</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-orange-600 mb-2">24/7</div>
            <div class="text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Target Countries Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Study in Your Dream Destination
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            We specialize in helping Bangladeshi students get admission to top universities worldwide.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center group hover:scale-105 transition-transform">
            <div class="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <span class="text-2xl">🇺🇸</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">United States</h3>
            <p class="text-gray-600">Top universities with excellent research opportunities and scholarships.</p>
          </div>

          <div class="text-center group hover:scale-105 transition-transform">
            <div class="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <span class="text-2xl">🇬🇧</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">United Kingdom</h3>
            <p class="text-gray-600">World-class education system with shorter degree programs.</p>
          </div>

          <div class="text-center group hover:scale-105 transition-transform">
            <div class="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <span class="text-2xl">🇨🇦</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Canada</h3>
            <p class="text-gray-600">Excellent post-study work opportunities and immigration pathways.</p>
          </div>

          <div class="text-center group hover:scale-105 transition-transform">
            <div class="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <span class="text-2xl">🇦🇺</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Australia</h3>
            <p class="text-gray-600">High quality of life and strong job market for international students.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-green-600 to-blue-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">
          Ready to Start Your Study Abroad Journey?
        </h2>
        <p class="text-xl text-green-100 mb-8">
          Join thousands of Bangladeshi students who have successfully achieved their dreams with our platform.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/auth/register" 
             class="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Get Started for Free
          </a>
          <a routerLink="/courses" 
             class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors">
            Browse Courses
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-green-600 to-red-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold">S</span>
              </div>
              <span class="text-lg font-bold">StudyAbroadWithShoudagar</span>
            </div>
            <p class="text-gray-400">
              Empowering Bangladeshi students to achieve their study abroad dreams through comprehensive guidance and support.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a routerLink="/ielts" class="hover:text-white">IELTS Practice</a></li>
              <li><a routerLink="/courses" class="hover:text-white">Video Courses</a></li>
              <li><a routerLink="/documents" class="hover:text-white">Document Generator</a></li>
              <li><a routerLink="/materials" class="hover:text-white">Study Materials</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Destinations</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">Study in USA</a></li>
              <li><a href="#" class="hover:text-white">Study in UK</a></li>
              <li><a href="#" class="hover:text-white">Study in Canada</a></li>
              <li><a href="#" class="hover:text-white">Study in Australia</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Contact Info</h3>
            <ul class="space-y-2 text-gray-400">
              <li>📧 info@studyabroadwithshoudagar.com</li>
              <li>📞 +880 1700-000000</li>
              <li>📍 Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 StudyAbroadWithShoudagar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
})
export class HomeComponent {}