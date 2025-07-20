import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Video Courses</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from expert mentors and get step-by-step guidance for your study abroad journey.
          </p>
        </div>

        <!-- Course Categories -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <img src="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400" 
                 alt="Visa Interview Training" class="w-full h-48 object-cover">
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Visa Interview Training</h3>
              <p class="text-gray-600 mb-4">Master the art of visa interviews with expert tips and mock sessions.</p>
              <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-green-600">৳2,999</span>
                <span class="text-sm text-gray-500">12 videos • 8 hours</span>
              </div>
              <button class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                Enroll Now
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <img src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400" 
                 alt="SOP Writing Masterclass" class="w-full h-48 object-cover">
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">SOP Writing Masterclass</h3>
              <p class="text-gray-600 mb-4">Write compelling statements of purpose that get you accepted.</p>
              <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-green-600">৳1,999</span>
                <span class="text-sm text-gray-500">8 videos • 5 hours</span>
              </div>
              <button class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                Enroll Now
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <img src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400" 
                 alt="Scholarship Guide" class="w-full h-48 object-cover">
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Scholarship Guide</h3>
              <p class="text-gray-600 mb-4">Find and apply for scholarships to fund your education abroad.</p>
              <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-green-600">৳2,499</span>
                <span class="text-sm text-gray-500">10 videos • 6 hours</span>
              </div>
              <button class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CoursesListComponent {}